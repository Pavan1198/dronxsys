import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Shield, Cpu, Network, Radio, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Overview", icon: Radio },
    { href: "/swarm", label: "Swarm Intel", icon: Network },
    { href: "/defense", label: "Defense Sys", icon: Shield },
    { href: "/command", label: "Command Center", icon: Cpu },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
            <Link href="/">
              <span className="font-display font-bold text-xl tracking-widest text-glow-primary cursor-pointer hover:text-primary transition-colors">
                DRONEX<span className="text-white">SYS</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm font-display uppercase tracking-wider cursor-pointer transition-all duration-300",
                        isActive
                          ? "text-primary border-b-2 border-primary text-glow-primary"
                          : "text-muted-foreground hover:text-white hover:border-b-2 hover:border-white/30"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link href="/command">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
                System Login
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" className="text-primary">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
