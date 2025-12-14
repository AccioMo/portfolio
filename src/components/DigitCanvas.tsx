"use client";

import { useRef, useEffect, useState, useCallback } from 'react';

interface DigitCanvasProps {
	onImageReady: (imageData: string) => void;
	isProcessing: boolean;
}

export default function DigitCanvas({ onImageReady, isProcessing }: DigitCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [hasDrawn, setHasDrawn] = useState(false);

	// Initialize canvas
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size
		const size = Math.min(window.innerWidth - 40, 280);
		canvas.width = size;
		canvas.height = size;

		// Fill with black background
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, size, size);

		// Set drawing style
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 20;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	}, []);

	const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		setIsDrawing(true);
		setHasDrawn(true);
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
		const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

		ctx.beginPath();
		ctx.moveTo(x, y);
	}, []);

	const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!isDrawing) return;
		e.preventDefault();

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
		const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

		ctx.lineTo(x, y);
		ctx.stroke();
	}, [isDrawing]);

	const stopDrawing = useCallback(() => {
		setIsDrawing(false);
	}, []);

	const clearCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		setHasDrawn(false);
	}, []);

	const processImage = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// Export the canvas directly as base64
		// The backend will handle trimming, resizing, and centering
		const imageData = canvas.toDataURL('image/png');
		onImageReady(imageData);
	}, [onImageReady]);

	return (
		<div className="flex flex-col items-center space-y-4">
			<canvas
				ref={canvasRef}
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseLeave={stopDrawing}
				onTouchStart={startDrawing}
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
				className="border-2 border-secondary rounded-lg cursor-crosshair touch-none"
				style={{ maxWidth: '100%', height: 'auto' }}
			/>

			<div className="flex gap-4">
				<button
					onClick={clearCanvas}
					disabled={isProcessing}
					className="px-6 py-2 border border-secondary rounded-full text-primary hover:bg-secondary hover:text-background transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Clear
				</button>

				<button
					onClick={processImage}
					disabled={!hasDrawn || isProcessing}
					className="px-6 py-2 bg-primary text-background rounded-full hover:bg-secondary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isProcessing ? 'Processing...' : 'Predict'}
				</button>
			</div>
		</div>
	);
}
