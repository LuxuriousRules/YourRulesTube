"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchYouTubeApi } from "../../utils/SearchYouTubeApi";
import Player from "../ui/Player";
import Loading from "../ui/Loading";

export default function SearchYouTube() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Inception trailer"; // 👈 читаем из URL
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await SearchYouTubeApi(query);
        if (!data || data.error) {
          const msg = data?.error?.message || "No data returned";
          throw new Error(msg);
        }
        if (mounted) setVideos(data.items || []);
      } catch (err: any) {
        console.error("SearchYouTube fetch error:", err);
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [query]);

  if (loading) return <div style={{ position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"}}>
    <Loading/>
    </div>;
  if (error) return <p>Ошибка загрузки видео: {error}</p>;

  return <Player videos={videos} />;
}
