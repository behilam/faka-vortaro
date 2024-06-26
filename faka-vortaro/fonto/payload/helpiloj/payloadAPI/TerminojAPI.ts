import type { z } from "zod";
import type { AxiosInstance } from "axios";

import BazaKolektoAPI from "./BazaKolektoAPI";
import { Kol } from "../../kolektoj/nomoj";
import { agordoj as alsxutiCsvAgordoj } from "../../kolektoj/Terminoj/finpunktoj/alsxutiCsv";

class TerminojAPI extends BazaKolektoAPI<Kol.Terminoj> {
  constructor(axios: AxiosInstance) {
    super(Kol.Terminoj, axios);
  }

  async alsxutiCsv(korpo: z.infer<(typeof alsxutiCsvAgordoj)["korpoAnalizilo"]>) {
    return this.handleCustomEndpoint(alsxutiCsvAgordoj, { korpo });
  }
}

export default TerminojAPI;
