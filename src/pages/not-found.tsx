import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background scanlines flex flex-col items-center justify-center text-center px-4">
      <AlertCircle className="w-24 h-24 text-destructive mb-8 animate-pulse" />
      <h1 className="text-6xl font-display font-black text-glow-destructive text-destructive mb-4">404</h1>
      <h2 className="text-2xl font-mono text-foreground mb-8">SECTOR NOT FOUND</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The navigation vector you requested does not exist in the current airspace database. 
        Return to the command center immediately.
      </p>
      <Link href="/">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
          RETURN TO BASE
        </Button>
      </Link>
    </div>
  );
}
