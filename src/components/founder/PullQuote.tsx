import { CSSProperties } from "react";
import styles from "./FoundersStory.module.css";

interface PullQuoteProps {
  quote: string;
  cite: string;
  style?: CSSProperties;
}

export function PullQuote({ quote, cite, style }: PullQuoteProps) {
  return (
    <blockquote className={styles.pullQuote} style={style}>
      <p className={styles.pullQuoteText}>{quote}</p>
      <cite className={styles.pullQuoteCite}>{cite}</cite>
    </blockquote>
  );
}
