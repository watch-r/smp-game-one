// app/api/eyespy/players/check-suspectroute.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { roomCode, suspectId } = await req.json();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players?room_code=eq.${roomCode}&role=eq.killer`,
        {
            headers: {
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${process.env
                    .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
            },
        }
    );
    const data: player[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
        return NextResponse.json(
            {message: "Nothing", success: false },
            { status: 400 }
        );
    }

    const killer = data[0];
    const correct = killer.id === suspectId;
    return NextResponse.json({ correct, success: true });
}
