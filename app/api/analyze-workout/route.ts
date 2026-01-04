
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");
const fileManager = new GoogleAIFileManager(apiKey || "");

export async function POST(request: Request) {
    if (!apiKey) {
        return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save to temporary file
        const tempFilePath = path.join(os.tmpdir(), `upload-${Date.now()}.webm`);
        await writeFile(tempFilePath, buffer);

        // Upload to Gemini
        const uploadResponse = await fileManager.uploadFile(tempFilePath, {
            mimeType: file.type || "video/webm",
            displayName: "Workout Analysis Request",
        });

        const fileUri = uploadResponse.file.uri;
        const name = uploadResponse.file.name;

        // Wait for file processing to be active
        let fileState = await fileManager.getFile(name);
        while (fileState.state === FileState.PROCESSING) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            fileState = await fileManager.getFile(name);
        }

        if (fileState.state === FileState.FAILED) {
            return NextResponse.json({ error: "Video processing failed by Gemini." }, { status: 500 });
        }

        // Generate Content
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: fileUri
                }
            },
            { text: "Analyze this video carefully. detailedly Count the number of completed push-ups performed by the person. Return ONLY the integer number of completed reps. If no push-ups are detected or you are unsure, return 0." }
        ]);

        const responseText = result.response.text();
        const reps = parseInt(responseText.replace(/\D/g, ''), 10) || 0;

        // Cleanup: Delete temp file
        await unlink(tempFilePath).catch(console.error);

        // Cleanup: Delete file from Gemini (optional, good practice)
        // await fileManager.deleteFile(name).catch(console.error);

        return NextResponse.json({ count: reps });

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze video" }, { status: 500 });
    }
}
