import { NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

// Type definitions for Drive files
interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    webContentLink?: string;
    thumbnailLink?: string;
    createdTime: string;
}

interface GalleryItem {
    id: string;
    media_url: string;
    media_type: "IMAGE" | "VIDEO";
    permalink: string;
    caption: string;
    thumbnail_url?: string;
    timestamp: string;
}

// Placeholder data for when API credentials are not configured
const placeholderItems: GalleryItem[] = [
    {
        id: "1",
        media_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=750&fit=crop&q=80",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/janmira.in/",
        caption: "Elegant Diamond Necklace",
        timestamp: new Date().toISOString(),
    },
    {
        id: "2",
        media_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=750&fit=crop&q=80",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/janmira.in/",
        caption: "Gold Statement Earrings",
        timestamp: new Date().toISOString(),
    },
    {
        id: "3",
        media_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=750&fit=crop&q=80",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/janmira.in/",
        caption: "Luxury Diamond Ring",
        timestamp: new Date().toISOString(),
    },
    {
        id: "4",
        media_url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=750&fit=crop&q=80",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/janmira.in/",
        caption: "Pearl Bracelet Collection",
        timestamp: new Date().toISOString(),
    },
    {
        id: "5",
        media_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=750&fit=crop&q=80",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/janmira.in/",
        caption: "Vintage Gold Pendant",
        timestamp: new Date().toISOString(),
    },
    {
        id: "6",
        media_url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=750&fit=crop&q=80",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/janmira.in/",
        caption: "Sapphire Drop Earrings",
        timestamp: new Date().toISOString(),
    },
    {
        id: "7",
        media_url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=750&fit=crop&q=80",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/janmira.in/",
        caption: "Rose Gold Bangles",
        timestamp: new Date().toISOString(),
    },
    {
        id: "8",
        media_url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&h=750&fit=crop&q=80",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/janmira.in/",
        caption: "Emerald Statement Ring",
        timestamp: new Date().toISOString(),
    },
    {
        id: "9",
        media_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=750&fit=crop&q=80",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/janmira.in/",
        caption: "Diamond Tennis Bracelet",
        timestamp: new Date().toISOString(),
    },
    {
        id: "10",
        media_url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=750&fit=crop&q=80",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/janmira.in/",
        caption: "Luxury Jewelry Set",
        timestamp: new Date().toISOString(),
    },
];

// Image and video MIME types
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"];
const VIDEO_MIME_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];

function getMediaType(mimeType: string): "IMAGE" | "VIDEO" | null {
    if (IMAGE_MIME_TYPES.includes(mimeType)) return "IMAGE";
    if (VIDEO_MIME_TYPES.includes(mimeType)) return "VIDEO";
    return null;
}

// Get Google Drive auth client
function getAuthClient() {
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!credentials) return null;

    try {
        const keyFile = JSON.parse(credentials);
        const auth = new google.auth.GoogleAuth({
            credentials: keyFile,
            scopes: ["https://www.googleapis.com/auth/drive.readonly"],
        });
        return auth;
    } catch {
        console.error("Error parsing Google service account credentials");
        return null;
    }
}

export async function GET() {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const auth = getAuthClient();

    // If no credentials or folder ID, return placeholder data
    if (!auth || !folderId) {
        return NextResponse.json({
            items: placeholderItems,
            isPlaceholder: true,
        });
    }

    try {
        const drive = google.drive({ version: "v3", auth });

        // List all files in the folder (images and videos)
        const response = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: "files(id, name, mimeType, createdTime)",
            orderBy: "createdTime desc",
            pageSize: 50, // Get more files to find matching thumbnails
        });

        const files = response.data.files as DriveFile[];

        if (!files || files.length === 0) {
            return NextResponse.json({
                items: placeholderItems,
                isPlaceholder: true,
                message: "No files found in folder",
            });
        }

        // Create a map of base names to image files (for video thumbnails)
        const imageMap = new Map<string, string>();
        files.forEach((file) => {
            if (IMAGE_MIME_TYPES.includes(file.mimeType)) {
                const baseName = file.name.replace(/\.[^/.]+$/, "").toLowerCase();
                imageMap.set(baseName, file.id);
            }
        });

        // Transform to gallery items (only media files that should be displayed)
        const items: GalleryItem[] = files
            .map((file): GalleryItem | null => {
                const mediaType = getMediaType(file.mimeType);
                if (!mediaType) return null;

                const baseName = file.name.replace(/\.[^/.]+$/, "");
                const baseNameLower = baseName.toLowerCase();

                // For videos, check if there's a matching image thumbnail
                // Skip standalone images that are video thumbnails
                if (mediaType === "IMAGE") {
                    // Check if there's a video with the same name - if so, skip this image
                    const hasMatchingVideo = files.some((f) => {
                        const fBase = f.name.replace(/\.[^/.]+$/, "").toLowerCase();
                        return fBase === baseNameLower && VIDEO_MIME_TYPES.includes(f.mimeType);
                    });
                    if (hasMatchingVideo) return null; // Skip - this is a video thumbnail
                }

                // Use local proxy for media URL to avoid permission/CORS issues
                // This fetches directly using the service account and streams to the client
                const mediaUrl = `/api/image/${file.id}`;

                // For video preview, we can uses the same proxy endpoint (browser handles mime type)
                const videoUrl = `/api/image/${file.id}`;

                const permalink = "https://www.instagram.com/janmira.in/";

                // For videos, use matching PNG as thumbnail if available
                let thumbnailUrl = mediaUrl;
                if (mediaType === "VIDEO") {
                    const matchingImageId = imageMap.get(baseNameLower);
                    if (matchingImageId) {
                        thumbnailUrl = `/api/image/${matchingImageId}`;
                    }
                }

                return {
                    id: file.id,
                    media_url: videoUrl, // Use proxy for both
                    media_type: mediaType,
                    permalink: permalink,
                    caption: baseName, // Use base name without extension
                    thumbnail_url: thumbnailUrl,
                    timestamp: file.createdTime,
                };
            })
            .filter((item): item is GalleryItem => item !== null)
            .slice(0, 10); // Limit to 10 items for display

        return NextResponse.json({
            items: items.length > 0 ? items : placeholderItems,
            isPlaceholder: items.length === 0,
        });
    } catch (error) {
        console.error("Error fetching Google Drive files:", error);
        return NextResponse.json({
            items: placeholderItems,
            isPlaceholder: true,
            error: "Failed to fetch Google Drive files",
        });
    }
}
