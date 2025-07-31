import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <body className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center px-4 py-8">
                {/* <!-- Game Title --> */}
                <img
                    src="public/eyespy-killer-game-horizontal.png"
                    alt="EyeSpy: Killer Game Logo"
                    className="h-30 mx-auto rounded-3xl mb-4 justify-center"
                />
                <p className="mb-6 text-gray-300 italic text-center bg-gray-800 p-4 rounded-lg">
                    A real-time party game. Choose an option to begin:
                </p>

                <div className="flex flex-col space-y-4">
                    <Button className="p-3">🎮 Host Game</Button>

                    <button className="bg-blue-600 hover:bg-blue-700 rounded p-3 font-semibold">
                        🤝 Join Game
                    </button>
                </div>
            </body>
            <footer className="text-sm text-gray-500">
                © 2023 My App. All rights reserved.
            </footer>
        </div>
    );
}
