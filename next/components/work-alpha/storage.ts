/* The account is the record and the browser is a mirror.

   One row per reader in `public.work_alpha_state`, the state object as
   JSON, read and written straight to PostgREST with the reader's own
   bearer, exactly as `lib/research-api.ts` does. A copy is kept under
   `work-alpha` in localStorage BEFORE the network call, so a save that
   fails offline is not lost, and `load()` prefers the newer of the two by
   the `updated_at` the save stamps into the state. */

import { runtimeModule } from "../account/runtime";
import type { Storage, WorkAlphaState } from "./engine";

type AccountModule = typeof import("/account.js");

const TABLE = "work_alpha_state";

interface Who { id: string; token: string; rest: string; anon: string }

async function who(): Promise<Who | null> {
  try {
    const m = await runtimeModule<AccountModule>("/account.js");
    const id = m.current()?.id;
    if (!id) return null;
    const token = await m.token();
    return token ? { id, token, rest: `${m.SUPABASE_URL}/rest/v1`, anon: m.SUPABASE_KEY } : null;
  } catch { return null; }
}

const mirror = {
  read(): Partial<WorkAlphaState> | null {
    try {
      const raw = localStorage.getItem("work-alpha");
      const held: unknown = raw ? JSON.parse(raw) : null;
      return held && typeof held === "object" ? held as Partial<WorkAlphaState> : null;
    } catch { return null; }
  },
  write(state: WorkAlphaState): void {
    try { localStorage.setItem("work-alpha", JSON.stringify(state)); } catch { /* private mode, or full */ }
  },
};

const stamp = (s: Partial<WorkAlphaState> | null): string => s?.updated_at ?? "";

export function supabaseStorage(): Storage {
  return {
    async load() {
      const local = mirror.read();
      const w = await who();
      if (!w) return local;
      try {
        const res = await fetch(`${w.rest}/${TABLE}?select=state&user_id=eq.${encodeURIComponent(w.id)}`, {
          headers: { apikey: w.anon, authorization: `Bearer ${w.token}`, accept: "application/json" },
        });
        if (!res.ok) return local;
        const rows = await res.json() as Array<{ state: Partial<WorkAlphaState> | null }>;
        const remote = rows[0]?.state ?? null;
        if (!remote) return local;
        if (!local) return remote;
        return stamp(remote) >= stamp(local) ? remote : local;
      } catch { return local; }
    },

    async save(state) {
      state.updated_at = new Date().toISOString();
      mirror.write(state);
      const w = await who();
      if (!w) return;
      await fetch(`${w.rest}/${TABLE}`, {
        method: "POST",
        headers: {
          apikey: w.anon,
          authorization: `Bearer ${w.token}`,
          "content-type": "application/json",
          prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({ user_id: w.id, state, updated_at: state.updated_at }),
      });
    },
  };
}
