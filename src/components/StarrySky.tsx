export default function StarrySky({ children }: { children: React.ReactNode }) {

	const stars = Array.from({ length: 1000 }, (_, i) => {
		const brightness = Math.random();
		let opacity;

		if (brightness < 0.3) opacity = 0.1;
		else if (brightness < 0.6) opacity = 0.2;
		else if (brightness < 0.85) opacity = 0.4;
		else opacity = 0.6;

		return {
			id: i,
			left: `${Math.random() * 100}%`,
			top: `${Math.random() * 100}%`,
			size: brightness > 0.9 ? 1 : 0.5,
			opacity
		};
	});

	return (
		<div className="w-full min-h-screen relative bg-[#171717] grain overflow-x-hidden scrollbar-hide">
			<div className="absolute inset-0 pointer-events-none z-0">
				{stars.map(star => (
					<div
						key={star.id}
						className="absolute rounded-full bg-white pointer-events-none"
						style={{
							left: star.left,
							top: star.top,
							width: `${star.size}px`,
							height: `${star.size}px`,
							opacity: star.opacity
						}}
					/>
				))}
			</div>

			<div className="relative z-10">
				{children}
			</div>
		</div>
	);
}