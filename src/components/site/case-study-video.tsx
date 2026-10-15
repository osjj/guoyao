"use client";

import { useCallback, useId, useState } from "react";
import type { CaseStudyVideo } from "@/lib/case-study-content";
import styles from "./customer-case-study.module.css";

export function CaseStudyVideoPlayer({ video }: { video: CaseStudyVideo }) {
  const captionId = useId();
  const [failedUrl, setFailedUrl] = useState<string>();
  const checkInitialError = useCallback((element: HTMLVideoElement | null) => {
    // A failed preload can finish before React attaches the event handlers.
    if (element?.error) setFailedUrl(video.url);
  }, [video.url]);

  return (
    <figure className={styles.videoFigure}>
      <video
        key={video.url}
        ref={checkInitialError}
        className={styles.videoPlayer}
        src={video.url}
        poster={video.poster}
        controls
        playsInline
        preload="metadata"
        aria-label={video.title}
        aria-describedby={video.caption ? captionId : undefined}
        onError={() => setFailedUrl(video.url)}
        onLoadedMetadata={() => setFailedUrl(undefined)}
      >
        Your browser does not support embedded video. <a href={video.url}>Open the video</a>.
      </video>
      {video.caption && <figcaption id={captionId}>{video.caption}</figcaption>}
      {failedUrl === video.url && <p className={styles.videoError} role="status">This video could not be played. Try opening the video directly.</p>}
      <a className={styles.videoFallback} href={video.url} target="_blank" rel="noopener noreferrer">Open video in a new tab</a>
    </figure>
  );
}
