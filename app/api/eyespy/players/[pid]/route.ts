import { NextResponse, NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { pid: string } }
) {
    try {
        const awaitedParams = await params; // await params object itself
        const pid = awaitedParams.pid;
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/players?id=eq.${pid}`,
            {
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env
                        .NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!}`,
                },
            }
        );
        const data: player = await res.json();
        return NextResponse.json({ success: true, data });
    } catch (error) {}
}
