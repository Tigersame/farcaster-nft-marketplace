// components/NavigationBar.jsx
"use client";

import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavigationBar({ title = "CurSwap" }) {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-lg border-b border-purple-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="hidden sm:inline text-sm text-gray-400 group-hover:text-white transition-colors">
              Back
            </span>
          </button>

          {/* Center: Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-lg font-semibold text-white">{title}</h1>
          </div>

          {/* Right: Home Button */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all group shadow-lg"
            title="Go to Homepage"
          >
            <Home className="w-5 h-5 text-white" />
            <span className="hidden sm:inline text-sm text-white font-medium">
              Home
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}
