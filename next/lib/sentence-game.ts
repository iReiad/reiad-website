/* The half of the sentence game a SERVER component needs: which of
   a day's lines can be played. `components/sentence-game.tsx` is the
   client half and imports this too, so the two agree about what a
   word is. */

export interface GameLine { target: string; bn: string }

export const tokens = (s: string): string[] => s.trim().split(/\s+/).filter(Boolean);

/** The lines a game can be made of: whole sentences of three
    words or more. A line with `=` in it is a pronunciation key. */
export function playable(lines: GameLine[]): GameLine[] {
  return lines.filter((l) => !l.target.includes("=") && tokens(l.target).length >= 3);
}

/** Whether a day has a game at all: two lines is the least a round
    can shuffle. The book mounts on this and the hub links on it, so
    a threshold typed in either place would let the two disagree. */
export const hasGame = (lines: GameLine[]): boolean => playable(lines).length >= 2;
