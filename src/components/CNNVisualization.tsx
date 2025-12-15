"use client";

import { useEffect, useState } from 'react';

interface Layer {
	filters?: number;
	kernel_size?: number;
	stride?: number;
	padding?: string;
	activation?: string;
	pooling?: { type: string; size: number };
	units?: number;
}

interface CNNArchitecture {
	input: { width: number; height: number; channels: number };
	conv_layers: Layer[];
	hidden_layers: Layer[];
	output_layer: Layer;
}

interface CNNVisualizationProps {
	architecture: CNNArchitecture;
	lastPredictionTime: number | null;
	inputImage: string | null;
	prediction: string | null;
}

export default function CNNVisualization({ architecture, lastPredictionTime, inputImage, prediction }: CNNVisualizationProps) {
	const [timestamp, setTimestamp] = useState(Date.now());

	useEffect(() => {
		if (lastPredictionTime) {
			setTimestamp(Date.now());
		}
	}, [lastPredictionTime]);

	// Map layers to file prefixes
	// 1st Conv Layer (index 0, 16 filters) -> "0-channel_X"
	// 2nd Conv Layer (index 1, 32 filters) -> "1-channel_X"
	const getImagesForLayer = (layerIndex: number, filterCount: number) => {
		// Direct mapping based on 16/32 structure
		const prefix = layerIndex;

		return Array.from({ length: filterCount }).map((_, i) => ({
			src: `/cnn/outputs/${prefix}-channel_${i}.png?t=${timestamp}`,
			alt: `L${layerIndex} F${i}`
		}));
	};

	return (
		<div className="w-full m-auto p-4 sm:p-8 rounded-2xl border border-white/10 overflow-x-auto">
			<h3 className="text-2xl font-light tracking-wide mb-8 text-white/90 text-center uppercase font-mono">
				Neural Network A<span className="text-primary">c</span>tivation
			</h3>

			<div className="flex flex-row items-center gap-6 sm:gap-12 min-w-max pb-4 px-4 justify-center">
				{/* Input Node */}
				<div className="flex flex-col items-center gap-3 group">
					<div className="w-20 h-20 border border-white/20 bg-transparent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:border-primary/50 transition-colors duration-500 overflow-hidden relative">
						{inputImage ? (
							<img src={inputImage} alt="Input" className="w-full h-full object-contain pixelated" />
						) : (
							<div className="text-xs text-center text-white/60 font-mono leading-tight">
								INPUT<br />
								<span className="text-white/90 font-bold">{architecture.input.width}x{architecture.input.height}</span>
							</div>
						)}
					</div>
				</div>

				{/* Connection Line */}
				<div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

				{/* Convolutional Layers */}
				{architecture.conv_layers.map((layer, idx) => (
					<div key={`conv-${idx}`} className="flex flex-row items-center gap-6">
						<div className="flex flex-col items-center gap-4">
							<div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] text-white/50 uppercase tracking-wider font-mono">
								Conv {idx + 1}
							</div>

							{/* Feature Map Grid using CSS Grid */}
							<div
								className="grid gap-px bg-white/10 p-px rounded border border-white/10 shadow-lg"
								style={{
									gridTemplateColumns: idx === 1
										? 'repeat(4, 1fr)'
										: `repeat(${Math.ceil(Math.sqrt(layer.filters || 0))}, 1fr)`
								}}
							>
								{getImagesForLayer(idx, layer.filters || 0).map((img, i) => (
									<div key={i} className="relative w-6 h-6 sm:w-8 sm:h-8 bg-black group overflow-hidden">
										<img
											src={img.src}
											alt={img.alt}
											className="w-full h-full object-contain pixelated opacity-80 group-hover:opacity-100 transition-opacity"
											onError={(e) => {
												(e.target as HTMLImageElement).style.display = 'none';
											}}
										/>
									</div>
								))}
							</div>

							<div className="text-[10px] text-white/40 font-mono">
								{layer.filters} filters • {layer.kernel_size}x{layer.kernel_size}
							</div>
						</div>

						{idx < architecture.conv_layers.length - 1 && (
							<div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
						)}
					</div>
				))}

				{/* Connection Line */}
				<div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

				{/* Fully Connected Layers */}
				<div className="flex flex-row items-center gap-6">
					{architecture.hidden_layers.map((layer, idx) => (
						<div key={`hidden-${idx}`} className="flex flex-col items-center gap-2">
							<div className="relative h-32 w-8 bg-white/5 rounded-full border border-white/10 flex flex-col justify-around py-2 px-1 overflow-hidden">
								{/* Abstract representation of neurons */}
								{Array.from({ length: 8 }).map((_, i) => (
									<div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 mx-auto" />
								))}
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" />
							</div>
							<div className="text-[10px] text-white/50 font-mono uppercase">
								{layer.units} Dense
							</div>
						</div>
					))}

					<div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

					{/* Output Layer */}
					<div className="flex flex-col items-center gap-2">
						<div className="relative h-44 w-10 bg-transparent rounded-full border border-primary/30 flex flex-col justify-around py-2 px-1">
							{Array.from({ length: 10 }).map((_, i) => (
								<div
									key={i}
									className={`w-full text-[8px] text-center font-mono transition-all duration-300 ${prediction === i.toString()
										? 'text-primary font-bold scale-125'
										: 'text-primary/40'
										}`}
								>
									{i}
								</div>
							))}
						</div>
						<div className="text-[10px] text-primary/80 font-mono uppercase font-bold">
							Output
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
