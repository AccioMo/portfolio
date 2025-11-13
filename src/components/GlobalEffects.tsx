"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import StarField from "./StarField";
import StarFieldFallback from "./StarFieldFallback";

interface MousePosition {
  x: number;
  y: number;
  timestamp: number;
}

interface GlobalEffectsProps {
  children: React.ReactNode;
  enableMouseTrail?: boolean;
}

export default function GlobalEffects({ children, enableMouseTrail = true }: GlobalEffectsProps) {
  const [mouseTrail, setMouseTrail] = useState<MousePosition[]>([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isInProjectArea, setIsInProjectArea] = useState(false);
  const [documentHeight, setDocumentHeight] = useState(0);
  const [mouseMomentum, setMouseMomentum] = useState(1);

  // Store current mouse position for trail updates using ref
  const currentMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateDocumentHeight = () => {
      setDocumentHeight(Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ));
    };

    updateDocumentHeight();

    window.addEventListener('resize', updateDocumentHeight);

    return () => {
      window.removeEventListener('resize', updateDocumentHeight);
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // For the live mouse position (coordinates display), use clientX/Y
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    // For the trail, use pageX/Y to account for scroll position
    currentMousePos.current.x = e.pageX;
    currentMousePos.current.y = e.pageY;

    // Check if mouse is over a project area
    const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
    const projectArea = elementUnderMouse?.closest('[data-project-area="true"]');
    const cursorHidden = elementUnderMouse?.closest('.my-cursor-none');
    if (cursorHidden) {
      setMousePosition({ x: -5, y: -5 });
      return;
    }
    setIsInProjectArea(!!projectArea);

    // Check if mouse is over interactive elements (buttons, links, etc.)
    const interactiveElement = elementUnderMouse?.closest('button, a, [role="button"], input, textarea, select, .cursor-pointer');
    setIsHoveringButton(!!interactiveElement);

  }, [setMousePosition, setIsInProjectArea, setIsHoveringButton]);

  useEffect(() => {
    const trailInterval = setInterval(() => {
      if (enableMouseTrail && (currentMousePos.current.x !== 0 || currentMousePos.current.y !== 0) && !isInProjectArea) {
        const newPosition: MousePosition = {
          x: currentMousePos.current.x,
          y: currentMousePos.current.y,
          timestamp: Date.now()
        };

        console.log('Mouse Momentum:', mouseMomentum.toFixed(2));
        setMouseTrail(prev => {
          const updatedTrail = [...prev, newPosition];
          return updatedTrail.slice(-32);
        });
      } else {
        // When context menu is visible or in project area, gradually fade the trail
        setMouseTrail(prev => {
          if (prev.length === 0) return prev;
          return prev.slice(1);
        });
      }
    }, 75);

    window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearInterval(trailInterval);
      };
    }, [handleMouseMove, isInProjectArea, enableMouseTrail]);
    
    return (
    <div className="min-h-screen cursor-none transition-all duration-500 ease-out">
      {/* Star Field Background */}
      {/* <StarFieldFallback starLess={false} /> */}
      
      {/* Mouse Trail */}
      <svg
        className="fixed w-full h-full top-0 left-0 pointer-events-none z-40 transition-opacity duration-300"
        style={{ 
          mixBlendMode: 'difference',
          opacity: (isHoveringButton || isInProjectArea || !enableMouseTrail) ? 0 : 1,
          height: `${documentHeight}px`
        }}
      >
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(228, 228, 228, 0.8)" />
            <stop offset="50%" stopColor="rgba(228, 228, 228, 0.8)" />
            <stop offset="100%" stopColor="rgba(228, 228, 228, 0.8)" />
          </linearGradient>
        </defs>
        {/* Individual line segments with independent fade */}
        {mouseTrail.length > 1 && mouseTrail.map((point, index) => {
          if (index === 0) return null; // Skip first point as it has no previous point to connect to
          
          const prevPoint = mouseTrail[index - 1];
          // Use position-based opacity instead of time-based
          const lineOpacity = mouseTrail.length > 1 ? index / (mouseTrail.length - 1) : 1;
          
          // Skip if points are the same to avoid duplicate lines
          if (point.x === prevPoint.x && point.y === prevPoint.y) {
            return null;
          }
          
          return (
            <line
              key={`line-${point.timestamp}-${index}`}
              x1={prevPoint.x}
              y1={prevPoint.y}
              x2={point.x}
              y2={point.y}
              stroke="rgba(228, 228, 228, 0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ opacity: lineOpacity }}
            />
          );
        })}
        {/* Individual trail points with fade effect */}
        {mouseTrail.map((point, index) => {
          // Fade based on position in trail only (no time-based fade)
          const opacity = mouseTrail.length > 1 ? index / (mouseTrail.length - 1) : 1;
          const size = 2;
          if (point.x == mouseTrail[index-1]?.x && point.y == mouseTrail[index-1]?.y) {
            return null; // Skip rendering if the point is the same as the previous one
          }
          return (
            <g key={`${point.timestamp}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={size}
                fill="rgba(228, 228, 228, 0.8)"
                style={{ opacity }}
              />
              {/* Coordinates text on each dot */}
              <text
                x={point.x}
                y={point.y - 8}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.9)"
                fontSize={8}
                fontFamily="monospace"
                style={{ 
                  opacity: opacity * 0.7,
                  pointerEvents: 'none'
                }}
              >
                {point.x},{point.y}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Mouse Coordinates */}
      {/* <div
        className="fixed pointer-events-none z-50 bg-black/10 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-mono"
        style={{
          opacity: (isHoveringButton || isInProjectArea) ? 0 : 1,
          left: mousePosition.x + 15,
          top: mousePosition.y - 30,
          transform: typeof window !== 'undefined' && mousePosition.x > window.innerWidth - 100 ? 'translateX(-100%)' : 'none'
        }}
      >
        {mousePosition.x}, {mousePosition.y}
      </div> */}

      {/* Custom Mouse Cursor Dot */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Main cursor dot */}
        <div 
          className={`rounded-full border-2 transition-all duration-300 relative w-2 h-2 bg-white/80 border-white/60 shadow-md shadow-white/80`}
          // ${
          //   isHoveringButton 
          //     ? 'w-3 h-3 bg-white-200 border-white-100 shadow-lg shadow-white-200/80 scale-150' 
          //     : 'w-2 h-2 bg-white/80 border-white/60 shadow-md shadow-white/80'
          // }`}
          style={{
            backdropFilter: 'blur(4px)',
            boxShadow: isHoveringButton 
              ? '0 0 20px rgba(254, 254, 254, 0.8), 0 0 40px rgba(254, 254, 254, 0.4), 0 0 60px rgba(254, 254, 254, 0.2)' 
              : '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)'
          }}
        >
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-all duration-300 ${
              isHoveringButton ? 'bg-white-50 animate-pulse' : 'bg-white/90'
            }`}
            style={{
              animationDuration: isHoveringButton ? '0.8s' : 'none'
            }}
          />
          {/* {!isHoveringButton && (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-white/40 animate-pulse"
              style={{
                animationDuration: '3s'
              }}
            />
          )} */}
        </div>

      </div>

      {/* Page Content with Transitions */}
      <div className="relative z-10">
        {/* <PageTransition> */}
          {children}
        {/* </PageTransition> */}
      </div>
    </div>
  );
}
