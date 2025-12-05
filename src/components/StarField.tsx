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
  starLess: boolean;
}

export default function StarField({ starLess }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseBodyRef = useRef<Matter.Body | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize physics engine and stars
  const initPhysics = useCallback((width: number, height: number) => {
    if (!width || !height || width <= 0 || height <= 0) {
      console.warn('Invalid canvas dimensions:', width, height);
      return;
    }

    try {
      // Clean up existing engine
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        Matter.World.clear(engineRef.current.world, false);
      }

      // Create engine with explicit settings for Chrome compatibility
      const engine = Matter.Engine.create({
        enableSleeping: false,
        positionIterations: 6,
        velocityIterations: 4,
        constraintIterations: 2
      });
      
      engine.world.gravity.y = 0;
      engine.world.gravity.x = 0;
      
      // Create invisible walls to contain stars
      const wallThickness = 50;
      const walls = [
        Matter.Bodies.rectangle(width / 2, -wallThickness/2, width, wallThickness, { 
          isStatic: true, 
          render: { visible: false },
          label: 'wall-top'
        }),
        Matter.Bodies.rectangle(width / 2, height + wallThickness/2, width, wallThickness, { 
          isStatic: true, 
          render: { visible: false },
          label: 'wall-bottom'
        }),
        Matter.Bodies.rectangle(-wallThickness/2, height / 2, wallThickness, height, { 
          isStatic: true, 
          render: { visible: false },
          label: 'wall-left'
        }),
        Matter.Bodies.rectangle(width + wallThickness/2, height / 2, wallThickness, height, { 
          isStatic: true, 
          render: { visible: false },
          label: 'wall-right'
        })
      ];
      
      Matter.World.add(engine.world, walls);
      
      // Create stars with bounds checking
      // Adjust star count based on screen size - fewer on mobile for better performance
      const stars: Star[] = [];
      const isMobile = width < 768;
      const baseStarCount = isMobile 
        ? Math.floor((width * height) / 8000) // Fewer stars on mobile
        : Math.floor((width * height) / 5000);
      const starCount = Math.min(200, Math.max(isMobile ? 30 : 50, baseStarCount));
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * (width - 20) + 10; // Keep away from edges
        const y = Math.random() * (height - 20) + 10;
        const size = Math.random() * 1.5 + 0.5;
        
        // Create a circular body for each star
        const body = Matter.Bodies.circle(x, y, size, {
          mass: 0.1,
          frictionAir: 0.08,
          restitution: 0.2,
          friction: 0.02,
          render: { visible: false },
          label: `star-${i}`
        });
        
        const star: Star = {
          body,
          opacity: Math.random() * 0.6 + 0.4, // Ensure minimum visibility
          size,
          originalOpacity: Math.random() * 0.6 + 0.4
        };
        
        stars.push(star);
        Matter.World.add(engine.world, body);
      }
      
      // Create invisible mouse body for interaction
      const mouseBody = Matter.Bodies.circle(width / 2, height / 2, 30, {
        isSensor: true,
        isStatic: true,
        render: { visible: false },
        label: 'mouse-body'
      });
      
      Matter.World.add(engine.world, mouseBody);
      
      engineRef.current = engine;
      starsRef.current = stars;
      mouseBodyRef.current = mouseBody;
      
      console.log(`StarField initialized: ${starCount} stars, ${width}x${height}`);
    } catch (error) {
      console.error('Failed to initialize physics:', error);
    }
  }, []);

  // Physics update function
  const updatePhysics = useCallback(() => {
    const engine = engineRef.current;
    const mouseBody = mouseBodyRef.current;
    const mouse = mouseRef.current;
    
    if (!engine || !mouseBody || starsRef.current.length === 0) return;
    
    try {
      // Update mouse body position with bounds checking
      const { width, height } = dimensionsRef.current;
      const clampedX = Math.max(0, Math.min(width, mouse.x));
      const clampedY = Math.max(0, Math.min(height, mouse.y));
      
      Matter.Body.setPosition(mouseBody, { x: clampedX, y: clampedY });
      
      // Apply repulsion forces to nearby stars
      starsRef.current.forEach(star => {
        if (!star.body || !star.body.position) return;
        
        const dx = star.body.position.x - clampedX;
        const dy = star.body.position.y - clampedY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Smaller push radius on mobile for better touch interaction
        const { width } = dimensionsRef.current;
        const isMobile = width < 768;
        const pushRadius = isMobile ? 30 : 40;
        
        if (distance < pushRadius && distance > 0.1) { // Avoid division by very small numbers
          const normalizedDistance = distance / pushRadius;
          const forceMagnitude = 0.00008 * (1 - normalizedDistance) * (1 - normalizedDistance);
          
          const forceX = (dx / distance) * forceMagnitude;
          const forceY = (dy / distance) * forceMagnitude;
          
          // Ensure force values are finite
          if (isFinite(forceX) && isFinite(forceY)) {
            Matter.Body.applyForce(star.body, star.body.position, {
              x: forceX,
              y: forceY
            });
          }
        }
        
        // Gentle random movement for natural floating effect
        const randomForce = 0.000015;
        const randomX = (Math.random() - 0.5) * randomForce;
        const randomY = (Math.random() - 0.5) * randomForce;
        
        if (isFinite(randomX) && isFinite(randomY)) {
          Matter.Body.applyForce(star.body, star.body.position, {
            x: randomX,
            y: randomY
          });
        }
        
        // Smooth twinkle effect with eased transitions
        const twinkleSpeed = 0.008;
        star.opacity += (Math.random() - 0.5) * twinkleSpeed;
        star.opacity = Math.max(0.2, Math.min(0.8, star.opacity));
      });
      
      // Step the physics simulation with fixed timestep
      Matter.Engine.update(engine, 16.666);
    } catch (error) {
      console.error('Physics update error:', error);
    }
  }, []);

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = contextRef.current;
    if (!ctx) return;

    const { width, height } = dimensionsRef.current;
    if (!width || !height) return;
    
    try {
      // Clear canvas with explicit bounds
      ctx.clearRect(0, 0, width, height);

      // Ensure context state is reset
      ctx.save();
      
      // Render stars
      const isMobile = width < 768;
      const centerX = width / 2;
      const centerY = height / 2;
      
      starsRef.current.forEach((star, index) => {
        if (!star.body || !star.body.position) return;
        
        const x = star.body.position.x;
        const y = star.body.position.y;
        
        // Skip stars that are out of bounds
        if (x < -10 || x > width + 10 || y < -10 || y > height + 10) return;
        
        // Smooth opacity transition based on hover state
        let targetOpacity = starLess ? 0.2 : star.opacity;
        
        // On mobile, fade out stars near the center
        if (isMobile) {
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          const maxDistance = Math.min(width, height) / 2;
          const clearRadius = maxDistance * 0.35; // Clear 35% from center
          
          if (distanceFromCenter < clearRadius) {
            const fadeStart = clearRadius * 0.5;
            if (distanceFromCenter < fadeStart) {
              targetOpacity = 0; // Fully transparent in center
            } else {
              // Gradual fade between fadeStart and clearRadius
              const fadeAmount = (distanceFromCenter - fadeStart) / (clearRadius - fadeStart);
              targetOpacity *= fadeAmount;
            }
          }
        }
        
        // Ensure opacity is valid
        if (!isFinite(targetOpacity) || targetOpacity <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, targetOpacity));
        
        // Dynamic glow effect based on opacity
        const glowIntensity = Math.max(1, star.opacity * 3);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = glowIntensity;
        
        // Add subtle pulsing effect
        const pulseOffset = (Date.now() * 0.001 + star.size + index * 0.1) % (Math.PI * 2);
        const pulseFactor = 1 + Math.sin(pulseOffset) * 0.1;
        const renderSize = Math.max(0.5, star.size * pulseFactor);
        
        ctx.beginPath();
        ctx.arc(x, y, renderSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      ctx.restore();
    } catch (error) {
      console.error('Render error:', error);
    }
  }, [starLess]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isInitializedRef.current) return;
    
    try {
      updatePhysics();
      render();
      animationRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error('Animation loop error:', error);
      // Continue animation even on error
      animationRef.current = requestAnimationFrame(animate);
    }
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

    try {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Get device pixel ratio for high-DPI displays (Chrome compatibility)
      const dpr = window.devicePixelRatio || 1;
      
      // Set canvas size in CSS pixels
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Set canvas size in device pixels for crisp rendering
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Get context and scale for device pixel ratio
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        contextRef.current = ctx;
        
        // Set context properties for better rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
      
      dimensionsRef.current = { width, height };
      
      // Cleanup old engine
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        Matter.World.clear(engineRef.current.world, false);
      }
      
      // Reinitialize physics on resize
      initPhysics(width, height);
      
      console.log(`Canvas resized: ${width}x${height}, DPR: ${dpr}`);
    } catch (error) {
      console.error('Resize error:', error);
    }
  }, [initPhysics]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prevent double initialization
    if (isInitializedRef.current) return;

    try {
      console.log('Initializing StarField component');
      
      // Initial setup
      handleResize();
      
      // Mark as initialized
      isInitializedRef.current = true;
      
      // Event listeners
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
      
      // Start animation with delay to ensure initialization
      setTimeout(() => {
        if (isInitializedRef.current && !animationRef.current) {
          animationRef.current = requestAnimationFrame(animate);
        }
      }, 100);

    } catch (error) {
      console.error('StarField initialization error:', error);
    }

    return () => {
      console.log('Cleaning up StarField component');
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Cleanup physics engine
      if (engineRef.current) {
        try {
          Matter.Engine.clear(engineRef.current);
          Matter.World.clear(engineRef.current.world, false);
        } catch (error) {
          console.error('Engine cleanup error:', error);
        }
        engineRef.current = null;
      }
      
      // Reset refs
      starsRef.current = [];
      mouseBodyRef.current = null;
      contextRef.current = null;
      isInitializedRef.current = false;
    };
  }, []); // Empty dependency array to run only once

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{
        mixBlendMode: 'screen',
        opacity: starLess ? 0.3 : 1,
        transition: 'opacity 300ms ease-out',
        background: 'transparent'
      }}
      onError={(e) => {
        console.error('Canvas error:', e);
      }}
    />
  );
}
