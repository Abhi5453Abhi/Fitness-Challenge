
"use server";

import { db } from "@/lib/db";
import { users, workouts, redemptions } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getUser(name: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.name, name)
        });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function getUserWorkouts(userName: string) {
    try {
        const userWorkouts = await db.select()
            .from(workouts)
            .where(eq(workouts.userName, userName))
            .orderBy(desc(workouts.createdAt));
        return userWorkouts;
    } catch (error) {
        console.error("Failed to fetch workouts:", error);
        return [];
    }
}

export async function createUser(name: string, email: string) {
    try {
        const [newUser] = await db.insert(users).values({
            name,
            email,
            coins: 0
        }).returning();
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
}

export async function getAllWorkouts() {
    try {
        const allWorkouts = await db.select().from(workouts).orderBy(desc(workouts.createdAt));
        return allWorkouts;
    } catch (error) {
        console.error("Error getting all workouts:", error);
        return [];
    }
}

export async function verifyWorkout(id: number, count: number) {
    try {
        // 1. Verify the workout
        const [updatedWorkout] = await db.update(workouts)
            .set({
                status: 'VERIFIED',
                adminCount: count,
                geminiCount: count // keeping them in sync for now or just adminCount varies
            })
            .where(eq(workouts.id, id))
            .returning();

        if (updatedWorkout) {
            // 2. Add Coins to User
            // We find the user by name (assuming name is unique/consistent for now as per schema)
            const user = await db.query.users.findFirst({
                where: eq(users.name, updatedWorkout.userName)
            });

            if (user) {
                // Determine the increment amount. 
                // The prompt said: "1 rep = 1 coin".
                // Logic: New Balance = Old Balance + Count
                // We use sql to be safe from race conditions, but simple update is fine for this scale.
                await db.update(users)
                    .set({ coins: user.coins + (count * 5) })
                    .where(eq(users.id, user.id));
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Error verifying workout:", error);
        throw new Error("Verification failed");
    }
}

export async function getUserBalance(userName: string) {
    console.log("getUserBalance called for:", userName);
    try {
        // 1. Calculate Total Earned (Verified Reps * 5)
        const userWorkouts = await db.select()
            .from(workouts)
            .where(eq(workouts.userName, userName));

        const verifiedWorkouts = userWorkouts.filter(w => w.status === 'VERIFIED');
        const totalReps = verifiedWorkouts.reduce((acc, curr) => acc + (curr.adminCount || 0), 0);
        const totalEarned = totalReps * 5;

        console.log("Stats:", {
            totalWorkouts: userWorkouts.length,
            verified: verifiedWorkouts.length,
            totalReps,
            totalEarned
        });

        // 2. Calculate Total Spent
        const userRedemptions = await db.select()
            .from(redemptions)
            .where(eq(redemptions.userName, userName));

        const totalSpent = userRedemptions.reduce((acc, curr) => acc + curr.cost, 0);

        console.log("Redemptions:", { count: userRedemptions.length, totalSpent });

        return { totalEarned, redeemed: totalSpent, available: totalEarned - totalSpent };
    } catch (error) {
        console.error("Error calculating balance:", error);
        return { totalEarned: 0, redeemed: 0, available: 0 };
    }
}

export async function redeemItem(userName: string, itemId: number, itemName: string, cost: number) {
    try {
        const balance = await getUserBalance(userName);
        if (balance.available < cost) return { success: false, message: 'Insufficient funds' };

        await db.insert(redemptions).values({ userName, itemId, itemName, cost });
        return { success: true, message: 'Redemption successful' };
    } catch (error) {
        console.error('Error redeeming item:', error);
        return { success: false, message: 'Transaction failed' };
    }
}

