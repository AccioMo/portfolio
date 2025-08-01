"use client";

import { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';

interface Star {
  body: Matter.Body;
  opacity: number;
  size: number;
  originalOpacity: number;
}

interface StarFieldProps {
  isHoveringButton: boolean;
}

export default function StarField({ isHoveringButton }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseBodyRef = useRef<Matter.Body | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // Initialize physics engine and stars
  const initPhysics = useCallback((width: number, height: number) => {
    // Create engine
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 0; // No gravity
    engine.world.gravity.x = 0;
    
    // Create invisible walls to contain stars
    const walls = [
      Matter.Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true, render: { visible: false } }), // top
      Matter.Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true, render: { visible: false } }), // bottom
      Matter.Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true, render: { visible: false } }), // left
      Matter.Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true, render: { visible: false } }) // right
    ];
    
    Matter.World.add(engine.world, walls);
    
    // Create stars
    const stars: Star[] = [];
    const starCount = Math.min(200, Math.floor((width * height) / 5000));
    
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5 + 0.5;
      
      // Create a circular body for each star
      const body = Matter.Bodies.circle(x, y, size, {
        mass: 0.1, // Lighter mass for smoother movement
        frictionAir: 0.08, // Increased air resistance for smoother settling
        restitution: 0.2, // Reduced bounce for smoother interactions
        friction: 0.02, // Slightly increased friction
        render: { visible: false }
      });
      
      const star: Star = {
        body,
        opacity: Math.random() * 0.8 + 0.2,
        size,
        originalOpacity: Math.random() * 0.8 + 0.2
      };
      
      stars.push(star);
      Matter.World.add(engine.world, body);
    }
    
    // Create invisible mouse body for interaction
    const mouseBody = Matter.Bodies.circle(width / 2, height / 2, 30, {
      isSensor: true,
      isStatic: true,
      render: { visible: false }
    });
    
    Matter.World.add(engine.world, mouseBody);
    
    engineRef.current = engine;
    starsRef.current = stars;
    mouseBodyRef.current = mouseBody;
  }, []);

  // Physics update function
  const updatePhysics = useCallback(() => {
    const engine = engineRef.current;
    const mouseBody = mouseBodyRef.current;
    const mouse = mouseRef.current;
    
    if (!engine || !mouseBody) return;
    
    // Update mouse body position
    Matter.Body.setPosition(mouseBody, { x: mouse.x, y: mouse.y });
    
    // Apply repulsion forces to nearby stars
    starsRef.current.forEach(star => {
      const dx = star.body.position.x - mouse.x;
      const dy = star.body.position.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const pushRadius = 40; // Smaller interaction radius for subtler effect
      
      if (distance < pushRadius && distance > 0) {
        // Much gentler force with smoother falloff
        const normalizedDistance = distance / pushRadius;
        const forceMagnitude = 0.00008 * (1 - normalizedDistance) * (1 - normalizedDistance); // Much reduced force
        
        const forceX = (dx / distance) * forceMagnitude;
        const forceY = (dy / distance) * forceMagnitude;
        
        Matter.Body.applyForce(star.body, star.body.position, {
          x: forceX,
          y: forceY
        });
      }
      
      // Gentle random movement for natural floating effect
      const randomForce = 0.000015; // Very subtle random movement
      Matter.Body.applyForce(star.body, star.body.position, {
        x: (Math.random() - 0.5) * randomForce,
        y: (Math.random() - 0.5) * randomForce
      });
      
      // Smooth twinkle effect with eased transitions
      const twinkleSpeed = 0.008; // Slower twinkle for smoother animation
      star.opacity += (Math.random() - 0.5) * twinkleSpeed;
      star.opacity = Math.max(0.2, Math.min(0.8, star.opacity));
    });
    
    // Step the physics simulation
    Matter.Engine.update(engine, 16.666); // ~60fps
  }, []);

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensionsRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Render stars
    starsRef.current.forEach(star => {
      ctx.save();
      
      // Smooth opacity transition based on hover state
      const targetOpacity = isHoveringButton ? 0.2 : star.opacity;
      ctx.globalAlpha = targetOpacity;
      
      // Dynamic glow effect based on opacity
      const glowIntensity = star.opacity * 3;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = glowIntensity;
      
      // Add subtle pulsing effect
      const pulseOffset = Date.now() * 0.001 + star.size;
      const pulseFactor = 1 + Math.sin(pulseOffset) * 0.1;
      const renderSize = star.size * pulseFactor;
      
      ctx.beginPath();
      ctx.arc(star.body.position.x, star.body.position.y, renderSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }, [isHoveringButton]);

  // Animation loop
  const animate = useCallback(() => {
    updatePhysics();
    render();
    animationRef.current = requestAnimationFrame(animate);
  }, [updatePhysics, render]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  // Resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    dimensionsRef.current = { width, height };
    
    // Cleanup old engine
    if (engineRef.current) {
      Matter.Engine.clear(engineRef.current);
    }
    
    // Reinitialize physics on resize
    initPhysics(width, height);
  }, [initPhysics]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    handleResize();
    
    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Cleanup physics engine
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [handleMouseMove, handleResize, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{
        mixBlendMode: 'screen',
        opacity: isHoveringButton ? 0.3 : 1,
        transition: 'opacity 300ms ease-out'
      }}
    />
  );
}
