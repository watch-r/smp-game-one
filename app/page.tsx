import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex items-center justify-center gap-4">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <h1 className="text-2xl font-bold">Welcome to My App</h1>
      </div>
      <p className="text-center text-lg">
        This is a simple Next.js application with a custom layout.
      </p>
      <footer className="text-sm text-gray-500">
        © 2023 My App. All rights reserved.
      </footer>
    </div>
  );
}
