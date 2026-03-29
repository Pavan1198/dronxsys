import { useState } from "react";
import { useDrones, useTelemetry, useDeployDrone, type Drone } from "@/hooks/use-drones";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, Battery, Crosshair, MapPin, Radio, ShieldAlert, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommandCenter() {
  const { data: drones, isLoading: dronesLoading, error: dronesError } = useDrones();
  const { data: telemetry, isLoading: telLoading } = useTelemetry();
  const deployMutation = useDeployDrone();
  const { toast } = useToast();

  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);

  const handleDeploy = (id: string) => {
    deployMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "DEPLOYMENT AUTHORIZED",
          description: `Unit ${id} is en route to intercept vector.`,
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "AUTHORIZATION FAILED",
          description: "Link to launch silo interrupted.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background scanlines pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-glow-primary flex items-center">
              <Radio className="w-8 h-8 mr-3 text-primary animate-pulse" />
              C4ISR DASHBOARD
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">SECURE CONNECTION ESTABLISHED</p>
          </div>
          
          {/* Telemetry Quick Stats */}
          <div className="flex gap-4">
            <TelemetryBadge label="NET LATENCY" value={telLoading ? "--" : `${telemetry?.networkLatency}ms`} normal={true} />
            <TelemetryBadge 
              label="THREATS" 
              value={telLoading ? "--" : telemetry?.threatsDetected?.toString() || "0"} 
              normal={!telemetry || telemetry.threatsDetected === 0} 
            />
            <TelemetryBadge label="SYS HEALTH" value={telLoading ? "--" : `${telemetry?.systemHealth.toFixed(1)}%`} normal={true} />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Fleet Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20 shadow-[0_0_20px_rgba(0,243,255,0.05)]">
              <CardHeader className="border-b border-primary/20 pb-4 bg-primary/5">
                <CardTitle className="text-lg flex justify-between">
                  <span>ACTIVE FLEET ORBAT</span>
                  <Badge variant="outline" className="font-mono">{drones?.length || 0} UNITS</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {dronesError ? (
                  <div className="p-10 text-center text-destructive flex flex-col items-center">
                    <ShieldAlert className="w-12 h-12 mb-4" />
                    <p className="font-display">COMMUNICATION LINK SEVERED</p>
                    <p className="text-sm font-mono mt-2 opacity-70">Cannot retrieve fleet status.</p>
                  </div>
                ) : dronesLoading ? (
                  <div className="p-6 space-y-4">
                    {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full bg-secondary/50" />)}
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {drones?.map((drone: Drone) => (
                      <div 
                        key={drone.id}
                        className={`p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-secondary/50 ${selectedDrone === drone.id ? 'bg-primary/10 border-l-2 border-primary' : ''}`}
                        onClick={() => setSelectedDrone(drone.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded bg-background border ${drone.type === 'INTERCEPTOR' ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'}`}>
                            {drone.type === 'INTERCEPTOR' ? <Zap className="w-5 h-5" /> : <Crosshair className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-display font-bold">{drone.name} <span className="text-xs text-muted-foreground ml-2 font-mono">[{drone.id}]</span></div>
                            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mt-1">
                              <span className="flex items-center"><Battery className="w-3 h-3 mr-1" /> {drone.batteryLevel}%</span>
                              <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {drone.coordinates[0].toFixed(2)}, {drone.coordinates[1].toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={drone.status} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Simulated Map Area */}
            <Card className="h-64 relative overflow-hidden flex items-center justify-center bg-secondary/20 border-primary/20">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/radar-bg.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
               <div className="relative z-10 text-center">
                 <MapPin className="w-8 h-8 text-primary mx-auto mb-2 opacity-50" />
                 <p className="font-mono text-muted-foreground">GEOSPATIAL RENDER ENGINE OFFLINE</p>
               </div>
               
               {/* Plot mock points if loaded */}
               {!dronesLoading && drones && (
                 <div className="absolute inset-0 z-20 pointer-events-none">
                    {drones.map((d: Drone, i: number) => (
                      <div 
                        key={d.id} 
                        className={`absolute w-3 h-3 rounded-full ${d.type === 'INTERCEPTOR' ? 'bg-primary shadow-[0_0_10px_rgba(0,243,255,1)]' : 'bg-muted-foreground'} animate-pulse`}
                        style={{ 
                          left: `${30 + (i * 15)}%`, 
                          top: `${40 + (i % 2 === 0 ? 10 : -10)}%` 
                        }}
                      >
                        <span className="absolute -top-4 -left-2 text-[10px] font-mono text-white whitespace-nowrap">{d.id}</span>
                      </div>
                    ))}
                 </div>
               )}
            </Card>
          </div>

          {/* Right Col: Action Panel */}
          <div className="space-y-6">
            <Card className="border-primary/20 h-full flex flex-col">
              <CardHeader className="border-b border-primary/20 bg-primary/5">
                <CardTitle className="text-lg">UNIT DIRECTIVE</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col">
                {!selectedDrone ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground text-center">
                    <Crosshair className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-display">NO UNIT SELECTED</p>
                    <p className="text-sm">Select a unit from the ORBAT to issue commands.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(() => {
                      const d = drones?.find((d: Drone) => d.id === selectedDrone);
                      if (!d) return null;
                      return (
                        <>
                          <div>
                            <h3 className="text-2xl font-display font-bold text-glow-primary">{d.name}</h3>
                            <p className="font-mono text-muted-foreground">{d.id} // {d.type}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background p-3 rounded border border-border">
                              <p className="text-xs text-muted-foreground mb-1">STATUS</p>
                              <p className="font-mono font-bold text-white">{d.status}</p>
                            </div>
                            <div className="bg-background p-3 rounded border border-border">
                              <p className="text-xs text-muted-foreground mb-1">POWER</p>
                              <p className="font-mono font-bold text-white flex items-center">
                                <Battery className="w-4 h-4 mr-1 text-green-400" /> {d.batteryLevel}%
                              </p>
                            </div>
                          </div>

                          <div className="bg-destructive/10 border border-destructive/30 rounded p-4 mt-8">
                            <h4 className="font-display text-destructive mb-2 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" /> KINETIC OPTIONS
                            </h4>
                            <p className="text-xs text-muted-foreground mb-4">
                              Authorization required for kinetic launch protocols. Action cannot be aborted once initiated.
                            </p>
                            <Button 
                              variant="destructive" 
                              className="w-full font-bold tracking-widest"
                              disabled={d.status !== "READY" || deployMutation.isPending}
                              onClick={() => handleDeploy(d.id)}
                            >
                              {deployMutation.isPending ? "AUTHORIZING..." : "INITIATE LAUNCH"}
                            </Button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

function TelemetryBadge({ label, value, normal }: { label: string, value: string, normal: boolean }) {
  return (
    <div className={`px-4 py-2 rounded border ${normal ? 'border-primary/30 bg-primary/5' : 'border-destructive/50 bg-destructive/10'} backdrop-blur`}>
      <p className="text-[10px] text-muted-foreground font-display">{label}</p>
      <p className={`text-xl font-bold font-mono ${normal ? 'text-primary' : 'text-destructive text-glow-destructive'}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = "bg-secondary text-secondary-foreground";
  switch(status) {
    case "READY": color = "bg-green-500/20 text-green-400 border border-green-500/30"; break;
    case "DEPLOYED": color = "bg-primary/20 text-primary border border-primary/30"; break;
    case "MAINTENANCE": color = "bg-orange-500/20 text-orange-400 border border-orange-500/30"; break;
    case "DESTROYED": color = "bg-destructive/20 text-destructive border border-destructive/30"; break;
  }
  return (
    <span className={`text-[10px] px-2 py-1 font-mono rounded-sm ${color}`}>
      {status}
    </span>
  );
}
