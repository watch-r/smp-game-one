import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();

        // Validate input
        if (!name) {
            return new Response("Name and password are required", {
                status: 400,
            });
        }

        // Create a new room in the database
        const code = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a random code
        const { error: roomError } = await supabaseAdmin.from("rooms").insert({
            code,
            game_status: "waiting", // Initial status
        });

        if (roomError) {
            console.error("Error creating room:", roomError);
            return new Response("Room Creation Failed", { status: 500 });
        }

        // Create a new player in the database
        const { error: playerError } = await supabaseAdmin
            .from("players")
            .insert({
                name,
                role: "unknown", // Default role
                room_code: code,
                is_host: true, // The player who created the room is the host
                is_alive: true, // Player is initially alive
            });
        if (playerError) {
            console.error("Error creating player:", playerError);
            return new Response("Player Creation Failed", { status: 500 });
        }

        // Return the room code and initial game status
        return NextResponse.json(
            {
                code,
                game_status: "waiting",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating room:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
