"use client";

import { useEffect, useState } from "react";
import StarField from "../components/StarField";
import ContextMenu from "../components/ContextMenu";

interface MousePosition {
  x: number;
  y: number;
  timestamp: number;
}

export default function Home() {
  const [mouseTrail, setMouseTrail] = useState<MousePosition[]>([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [documentHeight, setDocumentHeight] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isVisible: boolean; activeDirection: string }>({
    x: 0,
    y: 0,
    isVisible: false,
    activeDirection: ''
  });

  useEffect(() => {
    // Set initial document height and update on resize
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
    
    // Handle mouse down for context menu
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) { // Right mouse button
        e.preventDefault();
        setIsHoveringButton(true);
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          isVisible: true,
          activeDirection: ''
        });
      } else {
        setIsHoveringButton(true);
      }
    };

    // Handle mouse up
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) { // Right mouse button
        setContextMenu(prev => ({ ...prev, isVisible: false }));
        setIsHoveringButton(false);
      }
      setIsHoveringButton(false);
    };

    // Prevent default context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('resize', updateDocumentHeight);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    let currentMousePos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // For the live mouse position (coordinates display), use clientX/Y
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // For the trail, use pageX/Y to account for scroll position
      currentMousePos.x = e.pageX;
      currentMousePos.y = e.pageY;

      // If context menu is visible, check direction from center
      if (contextMenu.isVisible) {
        const deltaX = e.clientX - contextMenu.x;
        const deltaY = e.clientY - contextMenu.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 30) { // Only activate when moving away from center
          let activeDirection = '';
          
          // Determine primary direction
          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            activeDirection = deltaY < 0 ? 'top' : 'bottom';
          } else {
            activeDirection = deltaX > 0 ? 'right' : 'left';
          }
          
          setContextMenu(prev => ({ ...prev, activeDirection }));
        } else {
          setContextMenu(prev => ({ ...prev, activeDirection: '' }));
        }
      }
    };

    // Update trail every 50ms with current mouse position
    const trailInterval = setInterval(() => {
      // Only add points if mouse position is valid and has changed
      if (currentMousePos.x !== 0 || currentMousePos.y !== 0) {
        const newPosition: MousePosition = {
          x: currentMousePos.x,
          y: currentMousePos.y,
          timestamp: Date.now()
        };

        setMouseTrail(prev => {
          const updatedTrail = [...prev, newPosition];
          return updatedTrail.slice(-32);
        });
      }
    }, 50);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(trailInterval);
    };
  }, [contextMenu]);

  return (
    <div className="min-h-screen max-h-screen flex justify-center cursor-none bg-background text-foreground transition-all duration-500 ease-out">
      {/* Star Field Background */}
      <StarField isHoveringButton={isHoveringButton} />
      
      {/* Mouse Trail */}
      <svg
        className="absolute max-h-full w-full top-0 left-0 pointer-events-auto z-40 transition-opacity duration-300"
        style={{ 
          mixBlendMode: 'difference',
          opacity: isHoveringButton ? 0 : 1,
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
      <div
        className="fixed pointer-events-auto z-50 bg-black/10 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-mono"
        style={{
          opacity: isHoveringButton ? 0 : 1,
          left: mousePosition.x + 15,
          top: mousePosition.y - 30,
          transform: typeof window !== 'undefined' && mousePosition.x > window.innerWidth - 100 ? 'translateX(-100%)' : 'none'
        }}
      >
        {mousePosition.x}, {mousePosition.y}
      </div>

      {/* Main Space Awesome Very Cool Section */}
      <section className="py-16 px-6 flex items-center justify-center cursor-none select-none">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-tr from-neutral-200 mask-t-to-gray-800 bg-clip-text text-transparent">
        Sup, Bitch
          </h2>
          <p className="text-xl z-50 md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
        I build shit.
          </p>
            <a 
            href="#projects" 
            className="relative z-50 inline-block bg-neutral-700/30 text-white px-8 py-4 rounded-full backdrop-blur-md shadow-lg hover:bg-neutral-600/40 transition-all duration-500 font-medium border border-white/20 cursor-none group overflow-hidden"
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
            >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-150 transition-all duration-700 ease-out blur-sm group-hover:blur-md"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-125 transition-all duration-500 ease-out blur-xs"></div>
            <span className="text-lg font-light relative z-10 flex items-center justify-center leading-none">Jump</span>
            </a>
        </div>
      </section>

      {/* Context Menu */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isVisible={contextMenu.isVisible}
        activeDirection={contextMenu.activeDirection}
        onClose={() => setContextMenu(prev => ({ ...prev, isVisible: false }))}
      />

    </div>
  );
}
