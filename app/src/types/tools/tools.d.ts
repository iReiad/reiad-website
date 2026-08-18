declare const $: <T extends Element = HTMLElement>(sel: string, root?: ParentNode) => T | null;
declare const $$: <T extends Element = HTMLElement>(sel: string, root?: ParentNode) => T[];
declare const bdt: Intl.NumberFormat;
declare const num: Intl.NumberFormat;
declare const dec: Intl.NumberFormat;
declare const pct: Intl.NumberFormat;
/** ৳12,34,567, but shortened once it stops being readable. */
declare function money(n: number): string;
/** Every input's value, as the DOM gives them: a string, or a
    boolean for a checkbox. */
type Values = Record<string, string | boolean>;
declare function readState(toolId: string): Record<string, string>;
declare function writeState(toolId: string, values: Values): void;
/** One line on an area chart: the numbers, and the token it is
    drawn in. `color` is a `var(--series-N)` string rather than a
    colour, which is the whole point of the two tokens. */
type Series = {
    values: number[];
    color: string;
    fill?: number;
};
/** Stacked area: what you put in vs. what the growth added. */
declare function areaChart(series: Series[], { height, labels }?: {
    height?: number;
    labels?: string[];
}): string;
/** One bar: the figure above it, the caption under it, and the
    token it is drawn in. */
type Bar = {
    label: string;
    caption: string;
    value: number;
    color: string;
};
/** Simple bar comparison. */
declare function barChart(bars: Bar[], { height }?: {
    height?: number;
}): string;
/** A control a calculator reads. `select` has no `checked` and
    `input` has no `options`, so what the two share is what this
    file uses: a name, a value and a type. */
type Control = HTMLInputElement | HTMLSelectElement;
/** What a calculator does with the values: write its figures and
    draw its chart into its own root. */
type Compute = (values: Values, root: HTMLElement) => void;
declare function bindTool(id: string, compute: Compute): void;
/** Write one figure and the line under it.

    Every lookup is optional. A calculator's markup is a route's
    now, so a renamed `data-stat` should leave the rest of the
    page working rather than throwing on the first one and taking
    the chart with it. */
declare const setStat: (root: HTMLElement, key: string, value: string, note?: string) => void;
/** The element a calculator writes into, or somewhere harmless.

    Ten call sites assign `innerHTML` to `.chart-box` and
    `.verdict`. The markup is a Next route's now, so a renamed
    class should cost one chart rather than throwing partway
    through and leaving the figures above it stale. */
declare const slot: (root: HTMLElement, sel: string) => HTMLElement;
