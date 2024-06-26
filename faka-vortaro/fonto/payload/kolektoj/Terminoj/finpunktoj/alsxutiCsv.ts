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
    kolumnoj: z.array(z.nativeEnum(TerminKampo)),
    maniero: z.nativeEnum(AldonManiero),
  }),
  resAnalizilo: z.object({
    kreitaj: z.number(),
    malsukcesaj: z.array(
      z.object({
        vico: z.number(),
        termino: z.string(),
      })
    ),
    ignoritaj: z.number(),
  }),
  // resAnalizilo: z.string(),
} satisfies KomunaFinpunktAgordo;

export default kreiFinpunkton({
  agordoj,
  traktilo: async ({ analizitaKorpo }, req) => {
    const uzanto = req.user;
    if (!uzanto) throw new Error("Vi devas esti ensalutinta por fari tion");

    const { kolumnoj, vicoj } = analizitaKorpo;
    const troviKolumnNumeron = (kampo: TerminKampo): number | null => {
      const indekso = kolumnoj.findIndex(k => k === kampo);
      return indekso < 0 ? null : indekso;
    };
    const Indekso = Object.fromEntries(
      Object.values(TerminKampo).map(kampo => [kampo, troviKolumnNumeron(kampo)])
    ) as Record<TerminKampo, number | null>;

    if (Indekso.termino === null) {
      throw new Error("CSV-dosiero devas enhavi kolumnon por la termino");
    }

    let kreitaj = 0;
    const malsukcesaj: { vico: number; termino: string; kialo: string }[] = [];
    let ignoritaj = 0;
    const TerminModelo = mongoose.model<Termino<0>>(Kol.Terminoj);
    console.log(vicoj, "VICOJ");

    for (const [vicNumero, vico] of vicoj.entries()) {
      const Valoro = Object.fromEntries(
        Object.values(TerminKampo).map<[TerminKampo, string | null]>(kampo =>
          typeof Indekso[kampo] === "number" ? [kampo, vico[Indekso[kampo]]] : [kampo, null]
        )
      ) as Valoroj;
      try {
        if (!Valoro.termino) throw "Mankas termino";
        if (!Valoro.signifo) throw "Mankas signifo";

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
          vico: vicNumero + 2,
          termino: Valoro.termino || "<sen termino>",
          kialo,
        });
      }
    }
    return { ignoritaj, kreitaj, malsukcesaj };
  },
});
