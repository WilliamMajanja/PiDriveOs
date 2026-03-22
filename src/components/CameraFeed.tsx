import React, { useEffect, useRef } from 'react';

export function CameraFeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Draw simulated road
      ctx.fillStyle = '#18181b'; // zinc-900
      ctx.fillRect(0, 0, width, height);

      // Draw horizon
      ctx.fillStyle = '#09090b'; // zinc-950
      ctx.fillRect(0, 0, width, height / 2);

      // Draw lane lines
      ctx.strokeStyle = '#eab308'; // yellow-500
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 20]);
      
      ctx.beginPath();
      // Left lane
      ctx.moveTo(width * 0.2, height);
      ctx.lineTo(width * 0.45, height / 2);
      // Right lane
      ctx.moveTo(width * 0.8, height);
      ctx.lineTo(width * 0.55, height / 2);
      ctx.stroke();

      // Draw AI bounding boxes
      ctx.setLineDash([]);
      ctx.strokeStyle = '#10b981'; // emerald-500
      ctx.lineWidth = 2;
      
      // Simulated car detection
      const carX = width * 0.6 + Math.sin(offset * 0.05) * 20;
      const carY = height * 0.4 + Math.cos(offset * 0.05) * 10;
      ctx.strokeRect(carX, carY, 60, 40);
      
      ctx.fillStyle = '#10b981';
      ctx.font = '12px monospace';
      ctx.fillText('CAR 89%', carX, carY - 5);

      offset++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="w-full h-full relative bg-zinc-950">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full object-cover opacity-80"
      />
      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
        <div className="flex justify-end">
          <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded border border-white/10 text-xs font-mono text-emerald-400">
            FPS: 30
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-64 h-32 border-2 border-emerald-500/30 rounded-lg relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500/20 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono">
              TARGET ZONE
            </div>
            <div className="w-full h-full border border-emerald-500/10 border-dashed" />
          </div>
        </div>
      </div>
    </div>
  );
}
