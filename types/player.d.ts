type player = {
    id: string;
    room_code: string;
    role: "police" | "killer" | "civilian"; // add more roles if needed
    is_alive: boolean;
    name: string; // if your table has player names
    created_at: string; // ISO string from Supabase
    updated_at?: string; // optional if not always present
    // Add any extra columns your Supabase table has
};
