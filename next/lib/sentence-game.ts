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
