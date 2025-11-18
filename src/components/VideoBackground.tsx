import { getWaterVideo } from "@/lib/pexels";

export default async function VideoBackground() {
  const videoUrl = await getWaterVideo();

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
      <video
        autoPlay
        muted
        loop
        className="w-full h-full object-cover blur-2xl"
      >
        <source
          src={videoUrl}
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-background/70" />
    </div>
  );
}
