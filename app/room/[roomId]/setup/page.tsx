import React from "react";

interface SetupPageProps {
    params: {
        roomId: string;
    };
}

const RoomSetup = async ({ params }: SetupPageProps) => {
    const { roomId } = await params;
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Room Setup</h1>
            <p className="mt-4">
                You're setting up room: <strong>{roomId}</strong>
            </p>
            {/* Add setup UI here */}
        </div>
    );
};

export default RoomSetup;
