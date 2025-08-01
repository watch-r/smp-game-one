import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { name, roomCode } = await request.json();

        // Validate roomCode
        if (
            !roomCode ||
            typeof roomCode !== "string" ||
            roomCode.trim() === "" ||
            !name
        ) {
            return NextResponse.json(
                { error: "Name and Room ID is required" },
                { status: 400 }
            );
        }

        // Check if the room exists
        const { data: room, error: roomError } = await supabaseAdmin
            .from("rooms")
            .select("*")
            .eq("code", roomCode)
            .single();
        if (roomError || !room) {
            return NextResponse.json(
                { error: "Room not found" },
                { status: 404 }
            );
        }

        // Check if the user is already in the room
        const { data: existingUser, error: userError } = await supabaseAdmin
            .from("players")
            .select("*")
            .eq("room_code", roomCode)
            .eq("name", name)
            .maybeSingle();
        if (userError) {
            return NextResponse.json(
                { error: userError.message },
                { status: 500 }
            );
        }
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists in this room" },
                { status: 409 }
            );
        }

        // Insert the new user into the room
        const { data: newUser, error: insertError } = await supabaseAdmin
            .from("players")
            .insert({
                name: name,
                room_code: roomCode,
                is_alive: true,
                is_host: false,
                role: "unknown",
            })
            .select("*")
            .single();
        if (insertError || !newUser) {
            return NextResponse.json(
                { error: insertError?.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Successfully joined the room", roomCode },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error joining room:", error);
        return NextResponse.json(
            { error: "Error joining room" },
            { status: 500 }
        );
    }
}
