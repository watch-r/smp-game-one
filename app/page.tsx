import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {/* <!-- Game Title --> */}
            <Image
                src="/img/eyespy-killer-game-horizontal.png"
                width={300}
                height={100}
                alt="EyeSpy: Killer Game Logo"
                className="mb-8 rounded-lg"
            />
            <p className="mb-6 text-gray-300 italic text-center p-4 rounded-lg">
                A real-time party game. Choose an option to begin:
            </p>

            <div className="flex flex-col space-y-4">
                <Button variant={"secondary"} size={"lg"}>
                    🎮 Host Game
                </Button>
                <Button variant={"destructive"} size={"lg"}>
                    🤝 Join Game
                </Button>
            </div>
            <footer className="mt-4 text-center text-sm pt-5 rounded-lg p-3">
                <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="text-gray-400">
                        Made with ❤️ by MonStar Zero Studios
                    </p>

                    <p className="text-gray-400">© 2025 MonStar Zero Studios</p>
                </div>
            </footer>
        </div>
    );
}
