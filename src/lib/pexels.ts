export async function getWaterVideo(): Promise<string> {
  const apiKey = process.env.PEXELS_API_KEY;
  
  if (!apiKey) {
    throw new Error("PEXELS_API_KEY is not set");
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=calm+water&per_page=1`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    const data = await response.json();
    
    if (!data.videos || data.videos.length === 0) {
      throw new Error("No water videos found");
    }

    const videoFiles = data.videos[0].video_files;
    const videoUrl = videoFiles
      .filter((f: { height: number }) => f.height <= 720)
      .sort((a: { height: number }, b: { height: number }) => b.height - a.height)[0]?.link;

    if (!videoUrl) {
      throw new Error("No suitable video file found");
    }

    return videoUrl;
  } catch (error) {
    console.error("Failed to fetch water video from Pexels:", error);
    // Fallback to a public water video
    return "https://videos.pexels.com/video-files/3045163/3045163-sd_640_360_30fps.mp4";
  }
}
