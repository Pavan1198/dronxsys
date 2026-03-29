import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

// Simulated Schemas
export const DroneSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["RECON", "INTERCEPTOR", "ATTACK", "RELAY"]),
  status: z.enum(["READY", "DEPLOYED", "MAINTENANCE", "DESTROYED"]),
  batteryLevel: z.number().min(0).max(100),
  coordinates: z.tuple([z.number(), z.number()]),
});

export type Drone = z.infer<typeof DroneSchema>;

export const TelemetrySchema = z.object({
  activeUnits: z.number(),
  threatsDetected: z.number(),
  systemHealth: z.number(),
  networkLatency: z.number(), // ms
});

export type Telemetry = z.infer<typeof TelemetrySchema>;

// Mock Data
const MOCK_DRONES: Drone[] = [
  { id: "AX-01", name: "Wraith-1", type: "INTERCEPTOR", status: "READY", batteryLevel: 100, coordinates: [34.0522, -118.2437] },
  { id: "AX-02", name: "Wraith-2", type: "INTERCEPTOR", status: "DEPLOYED", batteryLevel: 84, coordinates: [34.0530, -118.2420] },
  { id: "RC-99", name: "EyeInSky", type: "RECON", status: "DEPLOYED", batteryLevel: 45, coordinates: [34.0600, -118.2500] },
  { id: "SW-01", name: "SwarmNode-Alpha", type: "RELAY", status: "READY", batteryLevel: 100, coordinates: [34.0522, -118.2437] },
];

// Hooks
export function useDrones() {
  return useQuery({
    queryKey: ["/api/drones"],
    queryFn: async () => {
      // Simulate API call
      await new Promise(r => setTimeout(r, 800));
      // Randomly fail to show error boundary handling (10% chance)
      if (Math.random() > 0.9) throw new Error("Connection to Command Center lost.");
      return MOCK_DRONES;
    },
    retry: 1,
  });
}

export function useTelemetry() {
  return useQuery({
    queryKey: ["/api/telemetry"],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return {
        activeUnits: Math.floor(Math.random() * 20) + 10,
        threatsDetected: Math.floor(Math.random() * 3),
        systemHealth: 98 + Math.random() * 2,
        networkLatency: Math.floor(Math.random() * 5) + 2,
      } as Telemetry;
    },
    refetchInterval: 3000, // Real-time simulated polling
  });
}

export function useDeployDrone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (droneId: string) => {
      await new Promise(r => setTimeout(r, 1000));
      // Simulate successful deployment
      return { success: true, droneId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drones"] });
      queryClient.invalidateQueries({ queryKey: ["/api/telemetry"] });
    },
  });
}
