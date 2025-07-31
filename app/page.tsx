import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import Image from "next/image";

export default function Home() {
    return (
        <div className="items-center justify-items-center min-h-screen p-8 pb-20 space-y-3.5">
            <body className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
                {/* <!-- Game Title --> */}
                <Image
                    src="/img/eyespy-killer-game-horizontal.png"
                    width={300}
                    height={100}
                    alt="EyeSpy: Killer Game Logo"
                />
                <p className="mb-6 text-gray-300 italic text-center bg-gray-800 p-4 rounded-lg">
                    A real-time party game. Choose an option to begin:
                </p>

                <div className="flex flex-col space-y-4">
                    <Button className="p-3">🎮 Host Game</Button>

                    <Button className="p-3">🤝 Join Game</Button>
                    <ThemeToggle />
                </div>
            </body>
            <footer className="text-sm text-gray-500">
                © 2023 My App. All rights reserved.
            </footer>
        </div>
    );
}
