"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchYouTubeApi } from "../../utils/SearchYouTubeApi";
import Player from "../ui/Player";

export default function SearchYouTube() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Inception trailer"; // 👈 читаем из URL
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await SearchYouTubeApi(query);
      setVideos(data.items || []);
    };
    fetchData();
  }, [query]);

  return <Player videos={videos} />;
}
