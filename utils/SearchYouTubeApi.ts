
export async function SearchYouTubeApi(query: string) {
   const res = await fetch(
     `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=5&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
   );
   return res.json();
}