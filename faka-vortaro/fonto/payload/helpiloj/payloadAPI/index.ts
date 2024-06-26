import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";
import qs from "qs";

import TerminojAPI from "./TerminojAPI";

export const PAYLOAD_SERVILO = process.env.PAYLOAD_PUBLIC_SERVER_URL!;
export const apiFinpunkto = "/api";

class PayloadAPI {
  private bazaURL: string;
  protected axios: AxiosInstance;
  terminoj: TerminojAPI;

  constructor(agordoj?: CreateAxiosDefaults) {
    this.bazaURL = agordoj?.baseURL ?? `${PAYLOAD_SERVILO}${apiFinpunkto}`;
    this.axios = axios.create({
      baseURL: this.bazaURL,
      withCredentials: true,
      paramsSerializer: {
        serialize: paramj =>
          Object.entries(paramj)
            .filter(ero => typeof ero[1] !== "undefined")
            .map(([sxlosilo, valoro]) => {
              return sxlosilo === "where"
                ? qs.stringify({ where: valoro as unknown }, { encode: false })
                : `${sxlosilo}=${valoro}`;
            })
            .join("&"),
      },
      ...agordoj,
    });
    this.terminoj = new TerminojAPI(this.axios);
  }
}

const payloadAPI = new PayloadAPI();

export default payloadAPI;
