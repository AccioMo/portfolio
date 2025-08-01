"use client";

import { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  isVisible: boolean;
  activeDirection: string;
  onClose: () => void;
}

export default function ContextMenu({ x, y, isVisible, activeDirection, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const navigationPaths = [
    { name: 'Works', path: '/works', direction: 'top' },
    { name: 'About', path: '/about', direction: 'right' },
    { name: 'Contact', path: '/contact', direction: 'left' },
    { name: 'Inspect', path: '#', direction: 'bottom' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevent default context menu
      document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [isVisible, onClose]);

  const handleNavigation = (item?: any) => {
    // If there's an active direction, navigate to that item instead
    let targetItem = item;
    if (activeDirection) {
      targetItem = navigationPaths.find(navItem => navItem.direction === activeDirection);
    }
    
    if (!targetItem) return;
    
    console.log(`Navigating to ${targetItem.name}`);
    if (targetItem.name === 'Inspect') {
      // Open browser dev tools
      console.log('Opening dev tools...');
      alert('Press F12 to open Developer Tools');
    } else if (targetItem.path === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.location.href = targetItem.path;
    }
    onClose();
  };

  if (!isVisible) return null;

  const centerSize = 20;
  const x_distance = 80; // Reduced from 100 to make lines shorter
  const y_distance = 50; // Reduced from 100 to make lines shorter

  // Calculate positions for each direction
  const getItemPosition = (direction: string) => {
    switch (direction) {
      case 'top':
        return { x: x, y: y - y_distance };
      case 'right':
        return { x: x + x_distance, y: y };
      case 'bottom':
        return { x: x, y: y + y_distance };
      case 'left':
        return { x: x - x_distance, y: y };
      default:
        return { x: x, y: y };
    }
  };

  return (
    <div 
      ref={menuRef} 
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseUp={(e) => {
        // Navigate based on active direction when clicking anywhere in the menu
        if (activeDirection) {
          e.stopPropagation();
          handleNavigation();
        }
      }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {/* Center circle */}
      <div
        className="absolute bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110"
        style={{
          left: x - centerSize / 2,
          top: y - centerSize / 2,
          width: centerSize,
          height: centerSize,
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
      </div>

      {/* Active direction indicator */}
      {activeDirection && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: x - 60,
            top: y - 60,
            width: 120,
            height: 120,
            background: `conic-gradient(from ${
              activeDirection === 'top' ? '270deg' : 
              activeDirection === 'right' ? '0deg' : 
              activeDirection === 'bottom' ? '90deg' : '180deg'
            }, rgba(255, 255, 255, 0.1) 0deg, rgba(255, 255, 255, 0.05) 90deg, transparent 90deg)`,
            borderRadius: '50%',
            opacity: 0.6
          }}
        />
      )}

      {/* Navigation items */}
      {navigationPaths.map((item, index) => {
        const position = getItemPosition(item.direction);
        const isActive = activeDirection === item.direction;
        const animationDelay = index * 10; // Staggered entrance animation
        
        return (
          <div
            key={index}
            className={`absolute pointer-events-auto cursor-none transition-all duration-500 ease-out transform ${
              isActive 
                ? 'scale-110 opacity-100' 
                : 'scale-100 opacity-70 hover:opacity-90 hover:scale-105'
            }`}
            style={{
              left: position.x,
              top: position.y,
              transform: `translate(-50%, -50%) scale(${isActive ? 1.1 : 1})`,
              filter: isActive ? 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.9))' : undefined,
              animation: isVisible ? `fadeInScale 0.2s ease-out ${animationDelay}ms both` : undefined
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              handleNavigation(item);
            }}
          >
            <span className={`text-white font-medium text-sm transition-all duration-500 ease-out ${
              isActive ? 'text-shadow-lg' : ''
            }`}
            style={{
              textShadow: isActive ? '0 0 15px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.5)' : undefined
            }}>
              {item.name}
            </span>
          </div>
        );
      })}

      {/* Connection lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        {navigationPaths.map((item, index) => {
          const position = getItemPosition(item.direction);
          const isActive = activeDirection === item.direction;
          const animationDelay = index * 50;
          
          return (
            <line
              key={`line-${index}`}
              x1={x}
              y1={y}
              x2={position.x}
              y2={position.y}
              stroke={isActive ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.4)"}
              strokeWidth={isActive ? "2.5" : "1"}
              strokeDasharray="1,3"
              className="transition-all duration-500 ease-out"
              style={{
                filter: isActive ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.7))' : undefined,
                opacity: isVisible ? 1 : 0,
                animation: isVisible ? `drawLine 0.8s ease-out ${animationDelay + 200}ms both` : undefined
              }}
            />
          );
        })}
      </svg>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
          100% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes drawLine {
          0% {
            stroke-dasharray: 0, 100;
            opacity: 0;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            stroke-dasharray: 1, 3;
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
