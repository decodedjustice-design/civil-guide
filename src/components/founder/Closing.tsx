import { CSSProperties } from "react";
import styles from "./FoundersStory.module.css";

export function Closing({ style }: { style?: CSSProperties }) {
  return (
    <section className={`${styles.closing} ${styles.section}`} style={style}>
      <p className={styles.closingBadge}>Decoded Justice</p>
      <h2 className={styles.closingHeading}>"So no one has to do this alone."</h2>
      <p className={styles.closingText}>
        She did not found Decoded Justice because she won. She founded it because she learned — at enormous personal cost — that the information existed, that the tools could be built, and that no one had built them for the people who needed them most.
      </p>
      <p className={styles.closingText}>That changes now.</p>
      <p className={styles.tagline}>Clarity. Justice. Empathy.</p>
    </section>
  );
}
