import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { projectBrands } from "@/data/project-experience";
import styles from "./project-brands.module.css";

export function ProjectBrands() {
  return (
    <section className={styles.section} id="project-brands" aria-labelledby="project-brands-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <p className={styles.kicker}>SELECTED BRAND PROJECT EXPERIENCE</p>
            <h2 id="project-brands-title">Familiar names.<br /><em>Considered details.</em></h2>
          </div>
          <div className={styles.context}>
            <p>A selection of brands represented in our project portfolio, from 2016 to 2026.</p>
            <a href="#project-records">Explore project experience <ArrowDown size={15} aria-hidden="true" /></a>
          </div>
        </div>
        <ul className={styles.logos} aria-label="Brands represented in our project portfolio">
          {projectBrands.map(brand => (
            <li key={brand.name}>
              <Image src={brand.src} alt={brand.name} width={brand.width} height={brand.height} style={{ width: brand.width, height: brand.height }} unoptimized />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
