"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

export interface DrawingCanvasRef {
    exportImage: () => Promise<string>;
    clearCanvas: () => void;
}

interface DrawingCanvasProps {
    className?: string;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({ className }, ref) => {
    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    useImperativeHandle(ref, () => ({
        exportImage: async () => {
            if (canvasRef.current) {
                return await canvasRef.current.exportImage("png");
            }
            return "";
        },
        clearCanvas: () => {
            canvasRef.current?.clearCanvas();
        }
    }));

    return (
        <div className={`relative w-full h-full ${className}`}>
            <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={20}
                strokeColor="white"
                canvasColor="transparent"
                style={{
                    border: "none",
                    borderRadius: "inherit",
                }}
                withTimestamp={true}
            />
        </div>
    );
});

DrawingCanvas.displayName = "DrawingCanvas";

export default DrawingCanvas;
