"use client";

import { useEffect, useState } from "react";
import StarField from "./StarField";
import ContextMenu from "./ContextMenu";
import PageTransition from "./PageTransition";
import StarFieldFallback from "./StarFieldFallback";

interface MousePosition {
  x: number;
  y: number;
  timestamp: number;
}

interface GlobalEffectsProps {
  children: React.ReactNode;
}

export default function GlobalEffects({ children }: GlobalEffectsProps) {
  const [mouseTrail, setMouseTrail] = useState<MousePosition[]>([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isInProjectArea, setIsInProjectArea] = useState(false);
  const [documentHeight, setDocumentHeight] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isVisible: boolean; activeDirection: string }>({
    x: 0,
    y: 0,
    isVisible: false,
    activeDirection: ''
  });
  
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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
    
    const handleMouseDown = (e: MouseEvent) => {
      const RIGHT_MOUSE_BTN = 2;
      const LEFT_MOUSE_BTN = 0;
      
      switch (e.button) {
        case RIGHT_MOUSE_BTN:
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            isVisible: true,
            activeDirection: ''
          });
          break;
          
        case LEFT_MOUSE_BTN:
          const currentTime = Date.now();
          const timeDiff = currentTime - lastClickTime;
          const positionDiff = Math.sqrt(
            Math.pow(e.clientX - clickPosition.x, 2) + 
            Math.pow(e.clientY - clickPosition.y, 2)
          );
          
          // Optimized double-click detection
          // - Time window: 400ms (slightly more forgiving than system default)
          // - Position tolerance: 5px (allows for slight mouse movement)
          if (timeDiff < 400 && positionDiff < 5 && clickCount === 1) {
            // Double-click detected
            e.preventDefault();
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              isVisible: true,
              activeDirection: ''
            });
            setClickCount(0); // Reset count
          } else {
            // First click or reset
            setClickCount(1);
            setLastClickTime(currentTime);
            setClickPosition({ x: e.clientX, y: e.clientY });
            
            // Reset click count after timeout to prevent accumulation
            setTimeout(() => {
              setClickCount(0);
            }, 400);
          }
          break;
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      const RIGHT_MOUSE_BTN = 2;
      const LEFT_MOUSE_BTN = 0;
      if (e.button === RIGHT_MOUSE_BTN || e.button === LEFT_MOUSE_BTN) {
        setContextMenu(prev => ({ ...prev, isVisible: false }));
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('resize', updateDocumentHeight);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('resize', updateDocumentHeight);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [lastClickTime, clickCount, clickPosition]);

  useEffect(() => {
    let currentMousePos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // For the live mouse position (coordinates display), use clientX/Y
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // For the trail, use pageX/Y to account for scroll position
      currentMousePos.x = e.pageX;
      currentMousePos.y = e.pageY;

      // Check if mouse is over a project area
      const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
      const projectArea = elementUnderMouse?.closest('[data-project-area="true"]');
      setIsInProjectArea(!!projectArea);

      // Check if mouse is over interactive elements (buttons, links, etc.)
      const interactiveElement = elementUnderMouse?.closest('button, a, [role="button"], input, textarea, select, .cursor-pointer');
      setIsHoveringButton(!!interactiveElement);

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

    // Update trail every 75ms with current mouse position
    const trailInterval = setInterval(() => {
      // Only add points if mouse position is valid, has changed, and not in project area
      // Don't add new points when context menu is visible, but continue fading existing trail
      if ((currentMousePos.x !== 0 || currentMousePos.y !== 0) && !isInProjectArea && !contextMenu.isVisible) {
        const newPosition: MousePosition = {
          x: currentMousePos.x,
          y: currentMousePos.y,
          timestamp: Date.now()
        };

        setMouseTrail(prev => {
          const updatedTrail = [...prev, newPosition];
          return updatedTrail.slice(-32);
        });
      } else {
        // When context menu is visible or in project area, gradually fade the trail
        setMouseTrail(prev => {
          if (prev.length === 0) return prev;
          // Remove oldest points to create fading effect
          return prev.slice(1);
        });
      }
    }, 75);

    window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearInterval(trailInterval);
      };
    }, [contextMenu, isInProjectArea]);  return (
    <div className="min-h-screen cursor-none bg-background text-foreground transition-all duration-500 ease-out">
      {/* Star Field Background */}
      <StarFieldFallback starLess={false} />
      
      {/* Mouse Trail */}
      <svg
        className="fixed w-full h-full top-0 left-0 pointer-events-none z-40 transition-opacity duration-300"
        style={{ 
          mixBlendMode: 'difference',
          opacity: (isHoveringButton || isInProjectArea) ? 0 : 1,
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
        className="fixed pointer-events-none z-50 bg-black/10 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-mono"
        style={{
          opacity: (isHoveringButton || isInProjectArea) ? 0 : 1,
          left: mousePosition.x + 15,
          top: mousePosition.y - 30,
          transform: typeof window !== 'undefined' && mousePosition.x > window.innerWidth - 100 ? 'translateX(-100%)' : 'none'
        }}
      >
        {mousePosition.x}, {mousePosition.y}
      </div>

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
          className={`rounded-full border-2 transition-all duration-300 relative ${
            isHoveringButton 
              ? 'w-4 h-4 bg-white-200 border-white-100 shadow-lg shadow-white-200/80 scale-150' 
              : 'w-2 h-2 bg-white/80 border-white/60 shadow-md shadow-white/80'
          }`}
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
          {!isHoveringButton && (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-white/40 animate-pulse"
              style={{
                animationDuration: '3s'
              }}
            />
          )}
        </div>

      </div>

      {/* Context Menu */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isVisible={contextMenu.isVisible}
        activeDirection={contextMenu.activeDirection}
        onClose={() => setContextMenu(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Page Content with Transitions */}
      <div className="relative z-10">
        {/* <PageTransition> */}
          {children}
        {/* </PageTransition> */}
      </div>
    </div>
  );
}
