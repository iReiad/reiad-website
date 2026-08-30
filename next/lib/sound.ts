/* ============================================================
   sound.ts: the handful of things this site says out loud.

   A lesson finished, a stage finished, a page turned, a setting
   saved. Nothing else, and nothing on a page load: every cue in
   here is tied to something the reader has just done, and a
   browser will not let any of them make a noise before the first
   gesture anyway.

   ---- there is no audio file in this repository ----

   Every cue is SYNTHESISED: a few oscillators, an envelope and a
   filter. That is not a stunt, it is the same argument the card
   drawings make one floor up. A committed `.mp3` cannot answer
   anything, cannot be diffed, has to be fetched, has to be
   licensed, and would be the second binary asset on a site that
   deliberately has none. A cue here is nine numbers in a table
   and it is legible: you can read what it will sound like.

   ---- and they are all one chord ----

   Every note in every cue is a degree of a D major pentatonic,
   which is the whole reason two cues firing at once cannot sound
   wrong: a pentatonic has no semitone in it, so there is no
   interval available that clashes. `HZ` is that scale and nothing
   may play a frequency that is not in it.

   ---- what makes it not annoying ----

   Three things, and all three are load-bearing:

     the master gain is low and a press is a tenth of a finish,
     so the sounds a reader hears often are the quiet ones;

     every cue is under 400ms and most are under 150, so nothing
     is ever still sounding when the next thing happens;

     the attack is 6ms and the release is long. A square edge on
     either end is a click, and a click is what makes synthesised
     audio sound cheap.
   ============================================================ */

/** D major pentatonic, two and a bit octaves, by scale degree.
    Index 0 is D3. Nothing outside this list may be played: it is
    what makes any two cues overlapping still a chord. */
const HZ = [
  146.83, 164.81, 185.00, 220.00, 246.94,
  293.66, 329.63, 369.99, 440.00, 493.88,
  587.33, 659.25, 739.99, 880.00, 987.77,
  1174.66,
];

/** One note of a cue: when it starts, which degree, how long, how
    loud, and what shape. `to` is a glide target, for the two cues
    that mean a direction. */
interface Note {
  at: number; deg: number; ms: number; gain: number;
  type?: OscillatorType; to?: number;
}

export type Cue =
  | "press" | "tick" | "lesson" | "stage"
  | "next" | "prev" | "saved" | "refused";

/** The table. Read it as music: `lesson` is a rising fifth and an
   octave, `stage` is the same idea with the root under it, and
   `refused` is the only one that falls. */
export const CUES: Record<Cue, Note[]> = {
  /* A press. One short note, high and almost inaudible: this is
     the cue a reader hears hundreds of times, so it is the one
     that has to be nearly nothing. */
  press: [{ at: 0, deg: 13, ms: 45, gain: 0.055, type: "triangle" }],

  /* A checkpoint inside a lesson. Two notes, a fourth apart. */
  tick: [
    { at: 0, deg: 8, ms: 70, gain: 0.13 },
    { at: 0.05, deg: 10, ms: 110, gain: 0.11 },
  ],

  /* A lesson finished: the triad, rising. This is the one a
     learner is meant to want to hear again. */
  lesson: [
    { at: 0, deg: 5, ms: 90, gain: 0.15 },
    { at: 0.07, deg: 8, ms: 100, gain: 0.14 },
    { at: 0.14, deg: 10, ms: 240, gain: 0.14 },
    { at: 0.14, deg: 0, ms: 320, gain: 0.06, type: "sine" },
  ],

  /* A whole stage. The same shape an octave wider, with the root
     held underneath it, which is what makes it read as bigger
     rather than as longer. */
  stage: [
    { at: 0, deg: 5, ms: 110, gain: 0.15 },
    { at: 0.08, deg: 8, ms: 110, gain: 0.15 },
    { at: 0.16, deg: 10, ms: 130, gain: 0.15 },
    { at: 0.24, deg: 13, ms: 380, gain: 0.16 },
    { at: 0, deg: 0, ms: 540, gain: 0.075, type: "sine" },
    { at: 0.24, deg: 5, ms: 380, gain: 0.06, type: "sine" },
  ],

  /* Turning a page. A glide rather than two notes, because a
     direction is one movement. */
  next: [{ at: 0, deg: 8, ms: 110, gain: 0.085, type: "triangle", to: 10 }],
  prev: [{ at: 0, deg: 10, ms: 110, gain: 0.085, type: "triangle", to: 8 }],

  /* Saved. A fourth up, soft, and shorter than a lesson: this
     confirms rather than celebrates. */
  saved: [
    { at: 0, deg: 8, ms: 70, gain: 0.1 },
    { at: 0.06, deg: 11, ms: 200, gain: 0.09 },
  ],

  /* The only cue that falls, and the only one with no glide: a
     refusal should not sound like a slide, it should sound like a
     door not opening. */
  refused: [
    { at: 0, deg: 6, ms: 90, gain: 0.1, type: "sine" },
    { at: 0.08, deg: 3, ms: 200, gain: 0.09, type: "sine" },
  ],
};

/** Everything goes through this, so nothing can ever be louder
    than this number however many cues overlap. */
const MASTER = 0.5;

let ctx: AudioContext | null = null;
let bus: GainNode | null = null;

/** The context, made on the first cue and never before.

    An AudioContext built at import time starts SUSPENDED under
    every browser's autoplay policy and stays suspended until a
    gesture resumes it, which means the first cue is silently
    dropped. Building it inside the first cue means the first cue
    IS the gesture. */
function audio(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = typeof window !== "undefined"
    ? (window.AudioContext
      ?? (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext)
    : undefined;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
    bus = ctx.createGain();
    bus.gain.value = MASTER;
    /* A limiter, not a taste decision. Six oscillators at once in
       `stage` sum past 1.0 and the browser clips, which sounds
       like a broken speaker rather than like a loud chord. */
    const cap = ctx.createDynamicsCompressor();
    cap.threshold.value = -14;
    cap.ratio.value = 12;
    bus.connect(cap);
    cap.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Whether the site is allowed to make a noise.

    An attribute set before the first paint by the boot script in
    `next/components/shell.tsx` and kept by `aab/src/prefs.ts`, so
    this is a string comparison inside a click handler rather than
    a JSON parse out of localStorage. */
function allowed(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-sound") !== "off";
}

/** Play one cue. Safe to call anywhere, including on the server,
    where it does nothing. */
export function cue(name: Cue): void {
  if (!allowed()) return;
  const c = audio();
  if (!c || !bus) return;
  /* A tab that was backgrounded comes back suspended. Resuming is
     a promise nobody waits on: if it has not resumed by the time
     the notes are scheduled they are simply inaudible, which is
     the right answer for a cue about something that has already
     happened. */
  if (c.state === "suspended") void c.resume();

  const now = c.currentTime;
  for (const note of CUES[name] ?? []) {
    const osc = c.createOscillator();
    const env = c.createGain();
    const tone = c.createBiquadFilter();

    osc.type = note.type ?? "triangle";
    const start = now + note.at;
    const end = start + note.ms / 1000;
    osc.frequency.setValueAtTime(HZ[note.deg], start);
    if (note.to !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(HZ[note.to], end);
    }

    /* A low pass at four times the note takes the top off a
       triangle's harmonics. Without it these read as a chiptune,
       which is not the register this site is in. */
    tone.type = "lowpass";
    tone.frequency.value = HZ[note.deg] * 4;
    tone.Q.value = 0.6;

    /* 6ms up, then an exponential down to silence. Ramping to
       exactly 0 is not allowed on an exponential ramp and throws;
       ramping to a value under a thousandth is inaudible and is
       what everybody means. */
    env.gain.setValueAtTime(0.0001, start);
    env.gain.exponentialRampToValueAtTime(note.gain, start + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(tone); tone.connect(env); env.connect(bus);
    osc.start(start);
    osc.stop(end + 0.02);
  }
}

/** The same thing as an event, for the modules in `aab/` that
    cannot import from `next/`. `next/components/sound.tsx`
    listens. */
export const SOUND_EVENT = "reiad:sound";
