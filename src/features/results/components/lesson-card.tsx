import type { Lesson } from "@/content/lessons";
import styles from "./lesson-card.module.css";

interface LessonCardProps {
  readonly title: string;
  readonly count: number;
  readonly lesson: Lesson;
}

export function LessonCard({ title, count, lesson }: LessonCardProps) {
  return (
    <li className={styles.card}>
      <h3 className={styles.title}>
        {title}
        {count > 1 && <span className={styles.count}>×{count}</span>}
      </h3>
      <p>{lesson.text}</p>
      <a className={styles.source} href={lesson.source.url} target="_blank" rel="noreferrer">
        Fonte: {lesson.source.label}
      </a>
    </li>
  );
}
