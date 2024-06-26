/* eslint-disable @typescript-eslint/no-explicit-any */
import type z from "zod";
import type { Endpoint } from "payload/config";
import type { PayloadRequest } from "payload/types";
import type { Result } from "payload/dist/auth/operations/login";

import type { Kol } from "../payload/kolektoj/nomoj";
import type { CxieaKol } from "../payload/cxieajKolektoj/nomoj";
import type { Uzanto } from "./payload-asertitaj-tipoj";

export interface PayloadPeto extends PayloadRequest {
  user: (Uzanto & { collection: Kol.Uzantoj }) | null;
}

export type TEnsalutRezulto<TUzanto = Uzanto> = Result & { user: TUzanto };

export type KomunaFinpunktAgordo = {
  metodo: Exclude<Endpoint["method"], "connect">;
  /** La URL-nomo de la finpunkto. */
  vojo: `/${string}`;
  paramAnalizilo?: z.ZodObject<any, any>;
  korpoAnalizilo?: z.ZodObject<any, any>;
  resAnalizilo: z.ZodType<any, any>;
} & (
  | {
      /** Kie troviĝas la finpunkto. @default "collections" */
      bazaVojo?: "collections";
      koletko: Kol;
    }
  | { bazaVojo: "globals"; cxieaKol: CxieaKol }
  | { bazaVojo: "base" | "root" }
);

export type OrdigSxlosilo<Kol extends Record<string, any>> = `${"-" | ""}${keyof Kol & string}`;
