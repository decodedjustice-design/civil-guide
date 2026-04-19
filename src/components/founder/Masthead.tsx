import styles from "./FoundersStory.module.css";

export function Masthead() {
  return (
    <header className={styles.masthead}>
      <p className={styles.mastheadEyebrow}>Decoded Justice &nbsp;·&nbsp; Founder's Story</p>
      <h1 className={styles.mastheadTitle}>
        Built From the <em>Inside</em>
        <br />
        of a Broken System
      </h1>
      <div className={styles.mastheadRule} />
      <p className={styles.mastheadSub}>
        How one mother's experience navigating five intersecting government systems — simultaneously, alone, and in crisis — became a platform built for everyone left doing the same.
      </p>
    </header>
  );
}
