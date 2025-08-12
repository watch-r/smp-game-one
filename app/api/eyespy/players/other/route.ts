import { NextRequest, NextResponse } from "next/server";
import { Player, ApiResponse } from "@/types/types";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roomCode = searchParams.get("roomCode");

    if (!roomCode) {
        return NextResponse.json(
            { success: false, message: "Missing roomCode" },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players?room_code=eq.${roomCode}&is_alive=eq.true&role=neq.police`,
            {
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env
                        .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
                },
            }
        );
        const data: Player[] = await res.json();
        return NextResponse.json<ApiResponse<Player[]>>({
            success: true,
            data,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
