
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { storeItems } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        const items = await db.select().from(storeItems).orderBy(desc(storeItems.createdAt));
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, cost, imageUrl, stock } = body;

        if (!name || !cost || !imageUrl) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newItem = await db.insert(storeItems).values({
            name,
            description: description || "",
            cost,
            imageUrl,
            stock: stock || -1
        }).returning();

        return NextResponse.json(newItem[0]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }
}
