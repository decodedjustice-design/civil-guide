import { CSSProperties, ReactNode } from "react";
import styles from "./FoundersStory.module.css";

interface SectionProps {
  label: string;
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function Section({ label, title, children, style }: SectionProps) {
  return (
    <section className={styles.section} style={style}>
      <p className={styles.sectionLabel}>{label}</p>
      <h2 className={styles.sectionHeading}>{title}</h2>
      {children}
    </section>
  );
}
