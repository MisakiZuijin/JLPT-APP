import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  type Card,
  type Grade,
} from "ts-fsrs";

export { Rating };

const scheduler = fsrs(
  generatorParameters({ request_retention: 0.9, enable_fuzz: true })
);

/** Bentuk baris tabel public.user_cards */
export type CardRow = {
  id?: number;
  user_id: string;
  item_id: number;
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
  last_review: string | null;
};

export function rowToCard(row: CardRow): Card {
  return {
    due: new Date(row.due),
    stability: row.stability,
    difficulty: row.difficulty,
    scheduled_days: row.scheduled_days,
    learning_steps: row.learning_steps,
    reps: row.reps,
    lapses: row.lapses,
    state: row.state,
    last_review: row.last_review ? new Date(row.last_review) : undefined,
  } as Card;
}

function cardToRow(card: Card) {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    // ts-fsrs v6 tidak lagi menyimpan elapsed_days di Card; kolom ini hanya untuk statistik
    elapsed_days: 0,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as number,
    last_review: card.last_review ? card.last_review.toISOString() : null,
  };
}

/** Terapkan rating ke kartu (atau kartu baru bila null). */
export function applyReview(row: CardRow | null, grade: Grade, now = new Date()) {
  const card = row ? rowToCard(row) : createEmptyCard(now);
  const { card: next, log } = scheduler.next(card, now, grade);
  return { row: cardToRow(next), log };
}

export function isGrade(n: number): n is Grade {
  return n === Rating.Again || n === Rating.Hard || n === Rating.Good || n === Rating.Easy;
}
