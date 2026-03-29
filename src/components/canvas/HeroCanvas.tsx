import React, { useEffect, useRef } from 'react';

// Math utilities
const distance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2-x1)**2 + (y2-y1)**2);

class Particle {
  x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number;
  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 0;
    this.maxLife = Math.random() * 30 + 20;
    this.color = color;
    this.size = Math.random() * 3 + 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
  }
  draw(ctx: CanvasRenderingContext2D) {
    const opacity = 1 - (this.life / this.maxLife);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

class Drone {
  x: number; y: number; type: 'ATTACKER' | 'INTERCEPTOR'; target?: Drone | null;
  speed: number; active: boolean; color: string; size: number;
  
  constructor(x: number, y: number, type: 'ATTACKER' | 'INTERCEPTOR') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.active = true;
    this.size = type === 'ATTACKER' ? 12 : 8;
    this.speed = type === 'ATTACKER' ? Math.random() * 1.5 + 1 : 4.5;
    
    // Convert HSL vars to strings for canvas
    this.color = type === 'ATTACKER' ? '#ff3300' : '#00f3ff';
  }

  update(width: number, height: number, targets: Drone[]) {
    if (!this.active) return;

    if (this.type === 'ATTACKER') {
      this.x += this.speed;
      // Gentle sine wave motion
      this.y += Math.sin(this.x * 0.02) * 0.5;
      
      if (this.x > width + 50) this.active = false; // Off screen
    } 
    else if (this.type === 'INTERCEPTOR') {
      if (!this.target || !this.target.active) {
        // Find new target
        const activeTargets = targets.filter(t => t.active);
        if (activeTargets.length > 0) {
          // Find closest
          this.target = activeTargets.reduce((prev, curr) => 
            distance(this.x, this.y, curr.x, curr.y) < distance(this.x, this.y, prev.x, prev.y) ? curr : prev
          );
        } else {
          // Fly up and off screen if no targets
          this.y -= this.speed;
          if (this.y < -50) this.active = false;
        }
      }

      if (this.target && this.target.active) {
        // Homing logic
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        // Collision Check
        if (dist < this.size + this.target.size) {
          this.active = false;
          this.target.active = false;
          return { exploded: true, x: this.x, y: this.y };
        }
      }
    }
    return { exploded: false };
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Tilt attacker forward
    if (this.type === 'ATTACKER') ctx.rotate(0.2);
    // Point interceptor at target
    if (this.type === 'INTERCEPTOR' && this.target) {
      const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      ctx.rotate(angle);
    }

    // Glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    
    // Draw Quadcopter shape
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    
    // Cross arms
    ctx.beginPath();
    ctx.moveTo(-this.size, -this.size);
    ctx.lineTo(this.size, this.size);
    ctx.moveTo(this.size, -this.size);
    ctx.lineTo(-this.size, this.size);
    ctx.stroke();

    // Central body
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(0, 0, this.size/2, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    // Rotors
    ctx.fillStyle = this.color;
    const rSize = this.size/3;
    const offset = this.size;
    [[-1,-1], [1,-1], [-1,1], [1,1]].forEach(([dx, dy]) => {
      ctx.beginPath();
      // Simulate spinning by changing radius
      const spin = Math.random() > 0.5 ? rSize : rSize * 0.5;
      ctx.arc(dx * offset, dy * offset, spin, 0, Math.PI*2);
      ctx.fill();
    });

    ctx.restore();
  }
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let attackers: Drone[] = [];
    let interceptors: Drone[] = [];
    let particles: Particle[] = [];
    
    let phase = 0; // 0: clear sky, 1: attackers spawn, 2: interceptors launch
    let phaseTimer = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const spawnAttackers = () => {
      const num = 4 + Math.floor(Math.random() * 2);
      for(let i=0; i<num; i++) {
        const y = canvas.height * 0.15 + Math.random() * (canvas.height * 0.4);
        attackers.push(new Drone(-50 - (Math.random() * 200), y, 'ATTACKER'));
      }
    };

    const spawnInterceptors = () => {
      const activeAttackers = attackers.filter(a => a.active).length;
      if (activeAttackers === 0) return;
      
      const num = Math.min(activeAttackers, 5);
      for(let i=0; i<num; i++) {
        const x = canvas.width * 0.3 + Math.random() * (canvas.width * 0.4);
        interceptors.push(new Drone(x, canvas.height + 50, 'INTERCEPTOR'));
      }
    };

    const createExplosion = (x: number, y: number) => {
      for(let i=0; i<30; i++) {
        particles.push(new Particle(x, y, Math.random() > 0.5 ? '#ff3300' : '#ffff00'));
      }
      for(let i=0; i<20; i++) {
        particles.push(new Particle(x, y, '#00f3ff')); // Interceptor debris
      }
    };

    const render = () => {
      // Clear with slight trailing effect for motion blur
      ctx.fillStyle = 'rgba(10, 15, 20, 0.3)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background (tactical feel)
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      
      // Moving grid effect
      const offset = (Date.now() / 50) % gridSize;
      
      ctx.beginPath();
      for(let x = offset; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
      }
      for(let y = offset; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // State Machine
      phaseTimer++;
      if (phase === 0 && phaseTimer > 60) {
        spawnAttackers();
        phase = 1;
        phaseTimer = 0;
      } else if (phase === 1 && phaseTimer > 120) { // 2.5 seconds later
        spawnInterceptors();
        phase = 2;
        phaseTimer = 0;
      } else if (phase === 2) {
        // Reset if all inactive
        if (attackers.every(a => !a.active) && interceptors.every(i => !i.active) && particles.length === 0) {
          phase = 0;
          phaseTimer = 0;
          attackers = [];
          interceptors = [];
        }
      }

      // Update & Draw
      attackers.forEach(a => {
        a.update(canvas.width, canvas.height, []);
        a.draw(ctx);
      });

      interceptors.forEach(i => {
        const res = i.update(canvas.width, canvas.height, attackers);
        if (res?.exploded) {
          createExplosion(res.x, res.y);
        }
        i.draw(ctx);
      });

      // Update particles
      particles = particles.filter(p => p.life < p.maxLife);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      style={{ filter: 'contrast(1.2) saturate(1.2)' }}
    />
  );
}
