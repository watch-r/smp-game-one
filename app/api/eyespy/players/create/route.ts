import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body?.name || !body?.room_code) {
        return NextResponse.json(
            { success: false, message: "Missing required fields" },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players`,
            {
                method: "POST",
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env
                        .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: "Failed to create player" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
