"use client";

import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  originalOpacity: number;
}

interface StarFieldProps {
  starLess: boolean;
}

export default function StarFieldFallback({ starLess }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize stars without physics engine
  const initStars = useCallback((width: number, height: number) => {
    if (!width || !height || width <= 0 || height <= 0) {
      console.warn('Invalid canvas dimensions:', width, height);
      return;
    }

    try {
      const stars: Star[] = [];
      const starCount = Math.min(200, Math.max(50, Math.floor((width * height) / 5000)));
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * (width - 20) + 10;
        const y = Math.random() * (height - 20) + 10;
        const size = Math.random() * 1.5 + 0.5;
        
        const star: Star = {
          x,
          y,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          opacity: Math.random() * 0.6 + 0.4,
          size,
          originalOpacity: Math.random() * 0.6 + 0.4
        };
        
        stars.push(star);
      }
      
      starsRef.current = stars;
      console.log(`StarField Fallback initialized: ${starCount} stars, ${width}x${height}`);
    } catch (error) {
      console.error('Failed to initialize stars:', error);
    }
  }, []);

  // Update star positions
  const updateStars = useCallback(() => {
    const mouse = mouseRef.current;
    const { width, height } = dimensionsRef.current;
    
    if (!width || !height) return;
    
    try {
      starsRef.current.forEach(star => {
        // Apply mouse repulsion
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const pushRadius = 60;
        
        if (distance < pushRadius && distance > 0.1) {
          const force = (pushRadius - distance) / pushRadius * 0.02;
          const forceX = (dx / distance) * force;
          const forceY = (dy / distance) * force;
          
          star.vx += forceX;
          star.vy += forceY;
        }
        
        // Apply random movement
        star.vx += (Math.random() - 0.5) * 0.002;
        star.vy += (Math.random() - 0.5) * 0.002;
        
        // Apply friction
        star.vx *= 0.98;
        star.vy *= 0.98;
        
        // Update position
        star.x += star.vx;
        star.y += star.vy;
        
        // Boundary checking with bounce
        if (star.x <= 0 || star.x >= width) {
          star.vx *= -0.8;
          star.x = Math.max(0, Math.min(width, star.x));
        }
        if (star.y <= 0 || star.y >= height) {
          star.vy *= -0.8;
          star.y = Math.max(0, Math.min(height, star.y));
        }
        
        // Twinkle effect
        const twinkleSpeed = 0.008;
        star.opacity += (Math.random() - 0.5) * twinkleSpeed;
        star.opacity = Math.max(0.2, Math.min(0.8, star.opacity));
      });
    } catch (error) {
      console.error('Star update error:', error);
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
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      
      starsRef.current.forEach((star, index) => {
        if (star.x < -10 || star.x > width + 10 || star.y < -10 || star.y > height + 10) return;
        
        const targetOpacity = starLess ? 0.2 : star.opacity;
        if (!isFinite(targetOpacity) || targetOpacity <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, targetOpacity));
        
        const glowIntensity = Math.max(1, star.opacity * 3);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = glowIntensity;
        
        const pulseOffset = (Date.now() * 0.001 + star.size + index * 0.1) % (Math.PI * 2);
        const pulseFactor = 1 + Math.sin(pulseOffset) * 0.1;
        const renderSize = Math.max(0.5, star.size * pulseFactor);
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, renderSize, 0, Math.PI * 2);
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
      updateStars();
      render();
      animationRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error('Animation loop error:', error);
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [updateStars, render]);

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
      
      const dpr = window.devicePixelRatio || 1;
      
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        contextRef.current = ctx;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
      
      dimensionsRef.current = { width, height };
      initStars(width, height);
      
      console.log(`Canvas resized: ${width}x${height}, DPR: ${dpr}`);
    } catch (error) {
      console.error('Resize error:', error);
    }
  }, [initStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isInitializedRef.current) return;

    try {
      console.log('Initializing StarField Fallback component');
      
      handleResize();
      isInitializedRef.current = true;
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
      
      setTimeout(() => {
        if (isInitializedRef.current && !animationRef.current) {
          animationRef.current = requestAnimationFrame(animate);
        }
      }, 100);

    } catch (error) {
      console.error('StarField Fallback initialization error:', error);
    }

    return () => {
      console.log('Cleaning up StarField Fallback component');
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      starsRef.current = [];
      contextRef.current = null;
      isInitializedRef.current = false;
    };
  }, []);

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
