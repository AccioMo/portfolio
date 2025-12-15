"use client";

import { useEffect, useRef, useState } from "react";
import CNNVisualization from "@/components/CNNVisualization";
import DrawingCanvas, { DrawingCanvasRef } from "@/components/DrawingCanvas";

const CNN_ARCHITECTURE = {
    input: { width: 28, height: 28, channels: 1 },
    conv_layers: [
        { filters: 16, kernel_size: 5, stride: 1 },
        { filters: 32, kernel_size: 5, stride: 1 }
    ],
    hidden_layers: [
        { units: 120 },
        { units: 84 }
    ],
    output_layer: { units: 10 }
};

export default function CNNDemoPage() {
    const canvasRef = useRef<DrawingCanvasRef>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const visualizationRef = useRef<HTMLDivElement>(null);

    const [isPredicting, setIsPredicting] = useState(false);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [predictionLog, setPredictionLog] = useState<string[]>([]);
    const [lastPredictionTime, setLastPredictionTime] = useState<number | null>(null);
    const [showVisualization, setShowVisualization] = useState(false);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            navigator.sendBeacon("/api/cleanup-cnn");
        };
    }, []);

    const handlePredict = async () => {
        if (!canvasRef.current) return;

        setIsPredicting(true);
        try {
            const image = await canvasRef.current.exportImage();
            const response = await fetch("/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image }),
            });

            const data = await response.json();
            if (data.success) {
                const match = data.output.match(/Prediction: (\d)/); // Fallback matching, though we rely on full output
                const pred = match ? match[1] : "?";

                // Parse the output lines for display log
                // Expected format: "0: 100.00%" ...
                const lines = data.output
                    .split('\n')
                    .filter((line: string) => line.trim().match(/^\d+:\s+\d+\.\d+%?/))
                    .slice(0, 10); // Ensure we get digits 0-9

                // Find best prediction from logs if possible to be robust
                // The backend might not explicitly saying "Prediction: X", but the probabilities
                // cnn.exe output format is provided by user. We can find max.
                let bestDigit = pred;
                let maxProb = -1;

                const parsedLogs = lines.map((line: string) => {
                    const [digitStr, probStr] = line.split(':').map(s => s.trim());
                    const prob = parseFloat(probStr.replace('%', ''));
                    if (prob > maxProb) {
                        maxProb = prob;
                        bestDigit = digitStr;
                    }
                    return { digit: digitStr, prob, raw: line };
                });

                setPrediction(bestDigit);
                setPredictionLog(lines.length > 0 ? lines : [data.output]); // Fallback to raw output if regex fails
                setProcessedImage(data.inputImage);
                setLastPredictionTime(Date.now());
                setShowVisualization(true);

                // Scroll to visualization after a short delay
                setTimeout(() => {
                    visualizationRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 200);
            }
        } catch (error) {
            console.error("Prediction failed:", error);
        } finally {
            setIsPredicting(false);
        }
    };

    const handleClear = () => {
        canvasRef.current?.clearCanvas();
        setPrediction(null);
        setProcessedImage(null);
        setPredictionLog([]);
        setShowVisualization(false);
        setLastPredictionTime(null);
    };

    return (
        <div className="h-screen bg-transparent text-primary overflow-y-auto scrollbar-hide snap-y snap-mandatory" ref={containerRef}>

            {/* SNAP SECTION 1: Input & Control */}
            <div className="h-screen w-full snap-start flex flex-col pt-32 px-4 md:px-8 relative">
                <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 h-[80vh] min-h-[500px]">

                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight">
                            Convolutional Neural Network Visualization
                        </h1>
                    </div>

                    {/* Main Grid: 2 Squares */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center justify-center">

                        {/* Square 1: Drawing Input */}
                        <div className="w-full h-full max-h-[400px] aspect-square mx-auto relative group flex flex-col">
                            <div className="absolute top-0 left-0 bg-primary text-background text-[10px] font-bold px-2 py-1 z-10 font-mono uppercase">
                                Input
                            </div>
                            <div className="flex-1 border border-secondary/20 rounded-lg overflow-hidden relative shadow-lg transition-all duration-300 group-hover:border-primary/30">
                                <DrawingCanvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
                                {/* Grid overlay hint */}
                                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:28px_28px]" />
                            </div>
                        </div>

                        {/* Square 2: Text Output */}
                        <div className="w-full h-full max-h-[400px] aspect-square mx-auto relative group flex flex-col">
                            <div className="absolute top-0 left-0 bg-secondary text-primary text-[10px] font-bold px-2 py-1 z-10 font-mono uppercase">
                                Output
                            </div>
                            <div className="flex-1 border border-secondary/20 rounded-lg overflow-hidden relative shadow-lg transition-all duration-300 group-hover:border-primary/30 bg-transparent p-6 font-mono text-sm sm:text-base flex flex-col overflow-y-auto custom-scrollbar">
                                {predictionLog.length > 0 ? (
                                    <div className="w-full h-full flex flex-col justify-center space-y-1">
                                        <p className="text-secondary mb-2 text-xs border-b border-secondary/20 pb-2">cnn.exe output stream:</p>
                                        {predictionLog.map((line, i) => {
                                            // Highlight the max probability line
                                            const isHighProb = line.includes('100.00%') || (parseFloat(line.split(':')[1]) > 50);
                                            return (
                                                <div key={i} className={`flex justify-between ${isHighProb ? 'text-primary font-bold' : 'text-secondary'}`}>
                                                    <span>{line.split(':')[0]}</span>
                                                    <span>{line.split(':')[1]}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-center text-secondary/40 space-y-2">
                                        <div>
                                            <p className="text-xs font-mono uppercase">Awaiting process...</p>
                                            <p className="text-[10px] opacity-50 mt-1">Ready for tensor input</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-6 mt-auto pb-12">
                        <button
                            onClick={handleClear}
                            className="px-6 py-2 rounded text-sm text-secondary hover:text-primary border border-secondary/30 hover:border-primary font-mono uppercase tracking-wider transition-all"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handlePredict}
                            disabled={isPredicting}
                            className="px-8 py-2 rounded bg-primary text-background font-bold text-sm font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPredicting ? "Processing..." : "Analyze"}
                        </button>
                    </div>

                </div>

                {/* Scroll Hint */}
                {showVisualization && (
                    <div
                        className="absolute bottom-4 left-0 w-full flex justify-center cursor-pointer animate-bounce opacity-50 hover:opacity-100"
                        onClick={() => visualizationRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                )}
            </div>

            {/* SNAP SECTION 2: Visualization */}
            {showVisualization && (
                <div ref={visualizationRef} className="min-h-screen w-full snap-start flex flex-col items-center justify-center p-4 pt-20 border-t border-secondary/10 bg-transparent">
                    <div className="w-full max-w-7xl animate-fade-in">

                        {/* Prediction Big Number */}
                        {/* <div className="flex flex-col items-center mb-16">
                            <div className="relative">
                                <h2 className="text-[120px] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-transparent blur-[1px] select-none">
                                    {prediction}
                                </h2>
                                <h2 className="absolute inset-0 text-[120px] leading-none font-bold text-primary/10 select-none animate-pulse-slow">
                                    {prediction}
                                </h2>
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
                                <span className="text-secondary font-mono text-xs uppercase tracking-[0.3em]">
                                    Predicted Digit
                                </span>
                                <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
                            </div>
                        </div> */}

                        {/* The Architecture Visualization */}
                        <CNNVisualization
                            architecture={CNN_ARCHITECTURE}
                            lastPredictionTime={lastPredictionTime}
                            inputImage={processedImage}
                            prediction={prediction}
                        />

                        {/* Footer Action */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => {
                                    handleClear();
                                    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group flex flex-col items-center gap-2 mx-auto"
                            >
                                <div className="w-10 h-10 rounded-full border border-secondary/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-background transition-all duration-300">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <span className="text-xs font-mono text-secondary group-hover:text-primary transition-colors uppercase tracking-wider">
                                    Analyze Another
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
