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
        How one mother's experience navigating housing, public agencies, law enforcement, family systems, records, and legal processes became a platform built to help people organize what happened, understand what is documented, and see what comes next.
      </p>
    </header>
  );
}
