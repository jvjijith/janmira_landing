import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// Get Google Drive auth client
function getAuthClient() {
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!credentials) return null;

    try {
        const keyFile = JSON.parse(credentials);
        return new google.auth.GoogleAuth({
            credentials: keyFile,
            scopes: ["https://www.googleapis.com/auth/drive.readonly"],
        });
    } catch {
        console.error("Error parsing Google service account credentials");
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = getAuthClient();

    if (!auth || !id) {
        return new NextResponse("Unauthorized or Missing ID", { status: 401 });
    }

    try {
        const drive = google.drive({ version: "v3", auth });

        // Get file metadata to set correct Content-Type
        const metadata = await drive.files.get({
            fileId: id,
            fields: "mimeType, name, size",
        });

        const mimeType = metadata.data.mimeType || "application/octet-stream";

        // Fetch the file content as a stream
        const response = await drive.files.get(
            { fileId: id, alt: "media" },
            { responseType: "stream" }
        );

        // Create a new stream for the response
        // Using standard Web Streams API (ReadableStream) compatible with Next.js App Router
        const stream = new ReadableStream({
            start(controller) {
                const nodeStream = response.data;
                nodeStream.on("data", (chunk) => controller.enqueue(chunk));
                nodeStream.on("end", () => controller.close());
                nodeStream.on("error", (err) => controller.error(err));
            },
        });

        // Set caching headers for better performance (cache for 1 hour)
        const headers = new Headers();
        headers.set("Content-Type", mimeType);
        headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
        if (metadata.data.size) {
            headers.set("Content-Length", metadata.data.size);
        }

        return new NextResponse(stream, {
            status: 200,
            headers
        });

    } catch (error) {
        console.error("Error serving Drive image:", error);
        return new NextResponse("Error fetching image", { status: 500 });
    }
}
