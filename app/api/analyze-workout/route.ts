
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { NextResponse } from "next/server";
// import { writeFile, unlink } from "fs/promises";
// import path from "path";
// import os from "os";

// Polyfill XMLHttpRequest for Firebase Storage in Node.js environment
// import "xhr2";
// @ts-ignore
// global.XMLHttpRequest = require("xhr2");

// Firebase imports
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase imports removed for local dev reliability
// import { storage } from "@/lib/firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// DB imports
import { db } from "@/lib/db";
import { workouts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey || "");
// const fileManager = new GoogleAIFileManager(apiKey || "");


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userName, videoUrl } = body;

        if (!videoUrl) {
            return NextResponse.json({ error: "No video URL provided" }, { status: 400 });
        }

        console.log("Processing workout for:", userName, "Video:", videoUrl);

        // 2. Save to PENDING state in DB
        const [newWorkout] = await db.insert(workouts).values({
            userName: userName || "Anonymous",
            videoUrl: videoUrl,
            status: "PENDING",
            adminCount: null,
            geminiCount: 0
        }).returning({ id: workouts.id });

        console.log("DB Record created:", newWorkout.id);


        /* GEMINI ANALYSIS TEMPORARILY DISABLED
        // To re-enable:
        // 1. Uncomment imports
        // 2. Restore temp file creation
        // 3. Restore fileManager.uploadFile
        // 4. Restore model.generateContent
        */

        return NextResponse.json({ count: 0, message: "Video uploaded for manual review" });

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze video" }, { status: 500 });
    }
}
