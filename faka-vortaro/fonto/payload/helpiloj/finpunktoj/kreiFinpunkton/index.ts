import z from "zod";
import { Endpoint } from "payload/config";
import { Response } from "express";
import { PayloadPeto, KomunaFinpunktAgordo } from "../../../../tipoj/payload-ekstraj-tipoj";

/**
 * Aŭtomate analizas la korpon kaj parametrojn por propra finpunkto uzante la kunhavatan
 * `agordoj`-objekto kaj transdonas la analizitajn valorojn al la `traktilo`-funkcio. La rezulto
 * de la `traktilo`-funkcio estas tiam analizita kaj sendita kiel respondo.
 *
 * Se eraro okazas dum analizo aŭ traktado, 500-eraro sediĝas kun la erarmesaĝo.
 */
const kreiFinpunkton = <Agordoj extends KomunaFinpunktAgordo>({
  agordoj,
  traktilo,
}: {
  agordoj: Agordoj;
  traktilo: <
    KorpoAnalizilo extends NonNullable<Agordoj["korpoAnalizilo"]>,
    ParamAnalizilo extends NonNullable<Agordoj["paramAnalizilo"]>
  >(
    analizitajArgj: {
      analizitaKorpo: z.infer<KorpoAnalizilo>;
      analizitajParamj: z.infer<ParamAnalizilo>;
    },
    peto: PayloadPeto,
    res: Response
  ) => Promise<z.infer<Agordoj["resAnalizilo"]>>;
}): Omit<Endpoint, "root"> => {
  const { vojo, metodo, korpoAnalizilo, paramAnalizilo, resAnalizilo } = agordoj;
  return {
    path: vojo,
    method: metodo,
    handler: async (peto: PayloadPeto, res: Response, sekve) => {
      const { payload, query, body } = peto;
      try {
        const analizitaKorpo = korpoAnalizilo?.parse(body) ?? {};
        const analizitajParamj = paramAnalizilo?.parse(query) ?? {};
        const traktilRezulto = await traktilo({ analizitaKorpo, analizitajParamj }, peto, res);
        const { success, data, error } = resAnalizilo.safeParse(traktilRezulto);
        if (success) {
          res.json(data);
        } else {
          res.status(500).json({ error: "Malvalida respondo", cause: error });
        }
      } catch (e) {
        payload.logger.error(`Eraro en la finpunkto ĉe ${vojo}.`);
        console.error(e);
        sekve(e);
      }
    },
  };
};

export default kreiFinpunkton;
