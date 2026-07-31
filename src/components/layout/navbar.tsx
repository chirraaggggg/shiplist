import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Launches" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-105 transition-transform shadow-sm">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">ShipList</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:flex text-sm h-9">
              Sign in
            </Button>
          </Link>
          <Link href="/submit">
            <Button className="rounded-full px-5 h-9 text-sm shadow-sm font-semibold">
              Submit Product
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
