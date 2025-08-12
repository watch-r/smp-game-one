// /api/eyespy/player?pid=${pid}
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pid = searchParams.get("pid");

    if (!pid) {
        return NextResponse.json(
            { success: false, message: "Missing pid" },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players?id=eq.${pid}`,
            {
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env
                        .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`, // keep private!
                },
            }
        );

        const data = await res.json();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
