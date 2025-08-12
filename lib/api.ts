export const api = {
    players: {
        async get(pid: string) {
            const res = await fetch(`/api/eyespy/players/${pid}`);
            return res.json();
        },
        async listAlive(roomCode: string) {
            const res = await fetch(
                `/api/eyespy/players/other?roomCode=${roomCode}`
            );
            return res.json();
        },
        async updateAlive(pid: string, dead: boolean) {
            const res = await fetch(`/api/eyespy/players/update-alive`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pid, dead }),
            });
            return res.json();
        },
        async create(playerData: {
            name: string;
            room_code: string;
            role?: string;
        }) {
            const res = await fetch(`/api/eyespy/players/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(playerData),
            });
            return res.json();
        },
        async checkSuspect(roomCode: string, suspectId: string) {
            const res = await fetch(`/api/eyespy/players/check-suspect`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomCode, suspectId }),
            });
            return res.json();
        },
    },
};
