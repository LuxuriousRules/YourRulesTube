"use client";

import { useState } from "react";
import style from "./Player.module.scss";
import ChatWindow from "./ChatWindow";

interface PlayerProps {
  videos: any[];
}

export default function Player({ videos }: PlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<any>(videos[0] || null);

  return (
    <div className={style.wrapp}>
      {videos.length > 0 ? (
        <div className={style.container}>
          <div className={style.mainContent}>
            {/* Основное видео */}
            <div className={style.mainVideo}>
              <iframe
                className={style.iframe}
                
                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
                title={selectedVideo.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            
            </div>
                {/* Список рекомендованных видео */}
          <div className={style.sidebar}>
            <div className={style.videoList}>
              {videos.map((video) => (
                <div
                  key={video.id.videoId}
                  className={`${style.videoCard} ${
                    selectedVideo.id.videoId === video.id.videoId ? style.active : ""
                  }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <img
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    className={style.thumbnail}
                  />
                  <div className={style.cardInfo}>
                    <p className={style.cardTitle}>{video.snippet.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
           
          </div>
            {/* Чат Gemini */}
            <ChatWindow
              videoTitle={selectedVideo.snippet.title}
              videoDescription={selectedVideo.snippet.description}
            />
        </div>
      ) : (
        <p>Загрузка видео...</p>
      )}
    </div>
  );
}



