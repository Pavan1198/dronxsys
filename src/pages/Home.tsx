import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Crosshair, Radar, ShieldAlert, Cpu, Zap, Activity, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { HeroCanvas } from "@/components/canvas/HeroCanvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground scanlines">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroCanvas />
        
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge variant="outline" className="mb-6 border-primary text-primary px-4 py-1 font-display tracking-widest bg-background/50 backdrop-blur">
              Next-Gen Aerial Supremacy
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter mb-6">
              DOMINATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">THE SKIES</span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-sans font-light">
              Autonomous swarm intelligence meets rapid-response kinetic interception. 
              The ultimate multi-layered defense architecture.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/command">
                <Button size="lg" className="w-full sm:w-auto h-14 text-lg">
                  Access Command Center <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 text-lg bg-background/50 backdrop-blur">
                View Specifications
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 text-xs font-mono text-primary/50 flex flex-col gap-1 hidden md:flex">
          <span>SYS_STATUS: NOMINAL</span>
          <span>AIRSPACE: SECURE</span>
          <span>NET_LATENCY: 2.4ms</span>
        </div>
        <div className="absolute bottom-10 right-10 flex gap-2 hidden md:flex">
          <div className="w-16 h-1 bg-primary/20 rounded overflow-hidden">
            <div className="w-full h-full bg-primary animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
          <div className="w-4 h-1 bg-primary/20 rounded" />
          <div className="w-2 h-1 bg-primary/20 rounded" />
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="py-24 relative border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-glow-primary">TACTICAL ARCHITECTURE</h2>
            <div className="h-1 w-24 bg-primary mx-auto mt-6 shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Network}
              title="Swarm Intelligence"
              desc="Self-organizing mesh network allowing up to 500 units to coordinate seamlessly without centralized command."
              stats={["2ms Latency", "500+ Units", "Auto-healing"]}
            />
            <FeatureCard 
              icon={Crosshair}
              title="Kinetic Interception"
              desc="High-velocity autonomous interceptors designed to physically neutralize hostile UAS threats in mid-air."
              stats={["Mach 0.8", "99.9% Accuracy", "Instant Launch"]}
              highlight
            />
            <FeatureCard 
              icon={Radar}
              title="GPS-Denied Nav"
              desc="Advanced computer vision and inertial sensors ensure operational continuity in heavily jammed environments."
              stats={["Optical Flow", "LIDAR", "RF Hardened"]}
            />
          </div>
        </div>
      </section>

      {/* DEEP DIVE SECTION */}
      <section className="py-24 bg-secondary/20 border-y border-border relative overflow-hidden">
        {/* Abstract background image */}
        <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/swarm-mesh.png`} alt="Swarm Mesh" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="destructive" className="mb-4"><ShieldAlert className="w-3 h-3 mr-1" /> Active Threat Mitigation</Badge>
              <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
                PHASE-2 INTERCEPTOR PROTOCOL
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                When unauthorized airspace incursions are detected, the system transitions from passive monitoring to active mitigation. 
                Interceptor drones are launched from subterranean silos, engaging targets using predictive AI tracking.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Automated threat classification via edge AI",
                  "Calculated optimal intercept trajectories",
                  "Multi-vector simultaneous swarm attacks",
                  "Post-strike localized EMP bursts"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-sm font-sans font-medium">
                    <Zap className="w-5 h-5 text-primary mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full sm:w-auto">
                Read Whitepaper
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-full border border-primary/30 flex items-center justify-center p-8 relative animate-[spin_60s_linear_infinite]">
                <div className="absolute inset-0 rounded-full border border-dashed border-primary/20 animate-[spin_40s_linear_infinite_reverse]" />
                <img 
                  src={`${import.meta.env.BASE_URL}images/radar-bg.png`} 
                  alt="Radar Display" 
                  className="w-full h-full object-cover rounded-full opacity-80 mix-blend-screen animate-[spin_60s_linear_infinite_reverse]" 
                />
              </div>
              {/* Overlay static UI on spinning radar */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Activity className="w-16 h-16 text-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Cpu className="w-16 h-16 text-primary mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">READY TO DEPLOY?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Request simulation access to experience the command dashboard and live interception telemetry.
          </p>
          <Link href="/command">
            <Button size="lg" className="h-16 px-12 text-xl shadow-[0_0_30px_rgba(0,243,255,0.3)]">
              INITIALIZE SYSTEM
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="border-t border-border bg-card py-12 text-center text-muted-foreground text-sm font-mono">
        <p>© 2025 DRONEX SYSTEMS. CLASSIFIED TIER 1. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, stats, highlight = false }: any) {
  return (
    <Card className={cn(
      "transition-all duration-500 hover:-translate-y-2",
      highlight ? "border-primary/50 shadow-[0_0_30px_rgba(0,243,255,0.1)]" : "hover:border-primary/30"
    )}>
      <CardHeader>
        <Icon className={cn("w-10 h-10 mb-4", highlight ? "text-primary" : "text-muted-foreground")} />
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-6">{desc}</CardDescription>
        <div className="grid grid-cols-1 gap-2 border-t border-border/50 pt-4">
          {stats.map((stat: string, i: number) => (
            <div key={i} className="flex items-center text-xs font-mono">
              <div className="w-1 h-1 bg-primary mr-2" />
              <span className="text-foreground">{stat}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
