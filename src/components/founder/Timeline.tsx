import styles from "./FoundersStory.module.css";

interface TimelineItem {
  date: string;
  text: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className={styles.timeline}>
      {items.map((item) => (
        <div key={item.date} className={styles.timelineItem}>
          <p className={styles.timelineDate}>{item.date}</p>
          <p className={styles.timelineText}>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
