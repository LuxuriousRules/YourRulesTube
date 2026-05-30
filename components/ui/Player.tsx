"use client";

import style from "./Player.module.scss";

interface PlayerProps {
  videos: any[];
}

export default function Player({ videos }: PlayerProps) {
  return (
    <div className={style.wrapp}>
      {videos.length > 0 ? (
        <div className={style.list}>
          {videos.map((video) => (
            <div key={video.id.videoId} className={style.item}>
              <iframe
                className={style.iframe}
                width="300"
                height="200"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      ) : (
        <p>Загрузка видео...</p>
      )}
    </div>
  );
}



