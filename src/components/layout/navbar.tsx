import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">ShipList</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/leaderboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Leaderboard
          </Link>
          <Link href="/categories" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Categories
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:flex">Log in</Button>
          </Link>
          <Link href="/submit">
            <Button className="rounded-full px-6 shadow-sm">Submit Product</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
