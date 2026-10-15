import Image from "next/image";
import type { CaseStudyImage } from "@/lib/case-study-content";
import { ImagePreviewButton } from "@/components/admin/image-preview";
import styles from "./case-study-image-gallery.module.css";

export function CaseStudyImageGallery({ images, label }: { images: readonly CaseStudyImage[]; label: string }) {
  if (images.length === 0) return null;

  const multiple = images.length > 1;
  return (
    <div className={`${styles.gallery} ${multiple ? styles.multiple : ""}`} role="group" aria-label={`${label} images`}>
      {images.map((image, index) => (
        <figure className={styles.figure} key={`${image.url}-${index}`}>
          <ImagePreviewButton src={image.url} alt={image.alt} className={styles.preview}>
            <Image
              src={image.url}
              alt={image.alt}
              width={1536}
              height={1024}
              unoptimized
              loading="lazy"
              sizes={multiple ? "(min-width: 1000px) 30vw, (min-width: 761px) 40vw, 92vw" : "(min-width: 1000px) 60vw, 92vw"}
            />
          </ImagePreviewButton>
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
