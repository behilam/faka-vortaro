import z from "zod";
import mongoose from "mongoose";

import { Kol } from "../../nomoj";
import { KomunaFinpunktAgordo } from "../../../../tipoj/payload-ekstraj-tipoj";
import kreiFinpunkton from "../../../helpiloj/finpunktoj/kreiFinpunkton";
import { Termino, Tradukoj } from "../../../../tipoj/payload-asertitaj-tipoj";
import { AldonManiero, TerminKampo } from "../../../helpiloj/finpunktoj/kreiFinpunkton/helpiloj";
import { OmitMeta } from "../../../../tipoj/payload-utiltipoj";

type Valoroj = Record<TerminKampo, string | null>;

export const agordoj = {
  metodo: "post",
  vojo: "/alsxutiCsv",
  bazaVojo: "collections",
  koletko: Kol.Terminoj,
  korpoAnalizilo: z.object({
    vicoj: z.array(z.array(z.string())),
    kolumnoj: z.record(z.nativeEnum(TerminKampo), z.union([z.number(), z.null()])),
    vicarNumero: z.number().min(0),
    opo: z.number().min(1),
  }),
  resAnalizilo: z.object({
    kreitaj: z.number(),
    malsukcesaj: z.array(
      z.object({
        vico: z.number(),
        termino: z.string(),
        kialo: z.string(),
      })
    ),
    ignoritaj: z.number(),
  }),
} satisfies KomunaFinpunktAgordo;

export type Rezulto = z.infer<(typeof agordoj)["resAnalizilo"]>;

export default kreiFinpunkton({
  agordoj,
  traktilo: async ({ analizitaKorpo }, req) => {
    const uzanto = req.user;
    if (!uzanto) throw new Error("Vi devas esti ensalutinta por fari tion");

    const { kolumnoj, vicoj, vicarNumero, opo } = analizitaKorpo;
    if (typeof kolumnoj.termino !== "number") {
      throw new Error("CSV-dosiero devas enhavi kolumnon por la termino");
    }

    let kreitaj = 0;
    const malsukcesaj: { vico: number; termino: string; kialo: string }[] = [];
    let ignoritaj = 0;
    const TerminModelo = mongoose.model<Termino<0>>(Kol.Terminoj);
    console.log(vicoj, "VICOJ");

    if (vicarNumero % 3 === 0) throw new Error("Npit");

    for (const [vicNumero, vico] of vicoj.entries()) {
      const Valoro = Object.fromEntries(
        Object.values(TerminKampo)
          .map<[TerminKampo, string | null]>(kampo =>
            typeof kolumnoj[kampo] === "number" ? [kampo, vico[kolumnoj[kampo]]] : [kampo, null]
          )
          .map(([k, v]) => (k === TerminKampo.Termino ? [k, v?.toLowerCase()] : [k, v]))
      ) as Valoroj;
      try {
        if (!Valoro.termino?.trim()) throw "Mankas termino";
        if (!Valoro.signifo?.trim()) throw "Mankas signifo";

        const tradukoj = Object.fromEntries(
          Object.entries(Valoro)
            .filter((ero): ero is [keyof Tradukoj, string] => {
              switch (ero[0] as keyof typeof Valoro) {
                case TerminKampo.DE:
                case TerminKampo.EN:
                case TerminKampo.ES:
                case TerminKampo.FR:
                case TerminKampo.JA:
                case TerminKampo.PT:
                case TerminKampo.ZH:
                  return !!ero[1];
                case TerminKampo.Ekzemplo:
                case TerminKampo.Signifo:
                case TerminKampo.Termino:
                  return false;
              }
            })
            .map(
              ([kampo, valoro]) =>
                [kampo, [{ traduko: valoro }]] satisfies [
                  keyof Tradukoj,
                  NonNullable<Tradukoj[keyof Tradukoj]>
                ]
            )
        ) as Partial<Record<keyof Tradukoj, [{ traduko: string }]>>;

        const trovitaTermino = await TerminModelo.findOneAndUpdate(
          { termino: { $eq: Valoro.termino } },
          {
            $setOnInsert: {
              kreinto: uzanto.id,
              termino: Valoro.termino,
              signifoj: [{ signifo: Valoro.signifo }],
              lingvoj: tradukoj,
            } satisfies OmitMeta<Termino<0>>,
          },
          { upsert: true, lean: true }
        );

        if (trovitaTermino === null) {
          kreitaj++;
        } else ignoritaj++;

        console.log("DONE ==============");
      } catch (eraro) {
        console.error("Eraro dum enporto de CSV-dosiero", eraro);
        const kialo = typeof eraro === "string" ? eraro : "Eraro nekonata";
        malsukcesaj.push({
          vico: vicarNumero * opo + vicNumero + 2,
          termino: Valoro.termino?.trim() || "<sen termino>",
          kialo,
        });
      }
    }
    return { ignoritaj, kreitaj, malsukcesaj };
  },
});
