"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { FileText, Github } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
               <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                NextRole
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1 tracking-wide">
                Your better role
              </span>
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <nav className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
              <Link href="/analyze" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-white dark:hover:bg-gray-700">
                Analyze
              </Link>
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-white dark:hover:bg-gray-700">
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Link
                href="https://github.com/SwintexD"
                target="_blank"
              >
                <Github className="h-5 w-5" />
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
