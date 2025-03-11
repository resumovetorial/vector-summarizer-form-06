
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasSize = () => {
      const size = Math.min(120, window.innerWidth / 4);
      canvas.width = size;
      canvas.height = size;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Animation variables
    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }> = [];
    
    // Create particles
    for (let i = 0; i < 12; i++) {
      const radius = Math.random() * 2 + 1;
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 40,
        y: canvas.height / 2 + (Math.random() - 0.5) * 40,
        radius,
        color: `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.5})`,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw "V" shape
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.3, canvas.height * 0.3);
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.7);
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.3);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgb(59, 130, 246)';
      ctx.stroke();
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className={cn("relative w-[120px] h-[120px] flex items-center justify-center", className)}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 text-xl font-bold animate-float">
        VecSum
      </div>
    </div>
  );
};

export default AnimatedLogo;
