import { NextResponse } from "next/server";

// Type definitions for Instagram API response
interface InstagramPost {
    id: string;
    media_url: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
    permalink: string;
    caption?: string;
    thumbnail_url?: string;
    timestamp: string;
}

interface InstagramAPIResponse {
    data: InstagramPost[];
    paging?: {
        cursors: {
            before: string;
            after: string;
        };
        next?: string;
    };
}

// Placeholder data for when API credentials are not configured
const placeholderPosts: InstagramPost[] = [
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

export async function GET() {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    // If no credentials, return placeholder data
    if (!accessToken || !userId) {
        return NextResponse.json({
            posts: placeholderPosts,
            isPlaceholder: true,
        });
    }

    try {
        // Fetch from Instagram Graph API
        const fields = "id,media_url,media_type,permalink,caption,thumbnail_url,timestamp";
        const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=10&access_token=${accessToken}`;

        const response = await fetch(url, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Instagram API error: ${response.status}`);
        }

        const data: InstagramAPIResponse = await response.json();

        return NextResponse.json({
            posts: data.data,
            isPlaceholder: false,
        });
    } catch (error) {
        console.error("Error fetching Instagram posts:", error);
        // Return placeholder data on error
        return NextResponse.json({
            posts: placeholderPosts,
            isPlaceholder: true,
            error: "Failed to fetch Instagram posts",
        });
    }
}
