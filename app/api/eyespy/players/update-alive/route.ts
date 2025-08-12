import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    const { pid, dead } = await req.json();

    if (!pid || typeof dead !== "boolean") {
        return NextResponse.json(
            { success: false, message: "Invalid data" },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players?id=eq.${pid}`,
            {
                method: "PATCH",
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env
                        .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ is_alive: !dead }),
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: "Failed to update player" },
                { status: res.status }
            );
        }

        return NextResponse.json(
            { success: true, message: "Player updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
