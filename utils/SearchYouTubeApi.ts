
export async function SearchYouTubeApi(query: string) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
    query
  )}&maxResults=5&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message || `YouTube API error: ${res.status}`;
    throw new Error(msg);
  }
  return json;
}