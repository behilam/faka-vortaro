import type { z } from "zod";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { PaginatedDocs } from "payload/database";
import type { CreateResult } from "payload/dist/collections/requestHandlers/create";
import type { UpdateResult } from "payload/dist/collections/requestHandlers/update";
import type { DeleteResult } from "payload/dist/collections/requestHandlers/delete";

import { PAYLOAD_SERVILO, apiFinpunkto } from ".";
import type { KomunaFinpunktAgordo } from "../../../tipoj/payload-ekstraj-tipoj";
import type { OmitMeta, TWhere } from "../../../tipoj/payload-utiltipoj";
import type { Config } from "../../../tipoj/payload-asertitaj-tipoj";

interface TCreateResult<T> extends Omit<CreateResult, "doc"> {
  doc: T;
}

interface TUpdateResult<T> extends Omit<UpdateResult, "doc"> {
  doc: T;
}

interface TDeleteResult<T> extends DeleteResult {
  doc: T;
}

interface TAxiosRequestConfig<Depth> extends AxiosRequestConfig {
  params?: {
    depth?: Depth;
    [key: string]: unknown;
  };
}

const akiriFinpunktVojon = (agordoj: KomunaFinpunktAgordo): string => {
  const slug = agordoj.vojo;
  switch (agordoj.bazaVojo) {
    case "collections":
    case undefined:
      return `${apiFinpunkto}/${agordoj.koletko}${slug}`;
    case "globals":
      return `${apiFinpunkto}/globals/${agordoj.cxieaKol}${slug}`;
    case "base":
      return `${apiFinpunkto}${slug}`;
    case "root":
      return slug;
  }
};

const akiriTraktilArgjn = (
  agordoj: KomunaFinpunktAgordo,
  { korpo, param }: { korpo?: unknown; param?: unknown }
): [path: string, ...args: unknown[]] => {
  const { korpoAnalizilo, paramAnalizilo } = agordoj;
  const bazaURL = PAYLOAD_SERVILO;
  const vojo = akiriFinpunktVojon(agordoj);
  const analizitajParamj = param ? paramAnalizilo?.parse(param) : undefined;
  switch (agordoj.metodo) {
    case "get":
    case "delete":
    case "head":
    case "options":
      return [vojo, { params: analizitajParamj, baseURL: bazaURL }] satisfies [
        string,
        AxiosRequestConfig
      ];
    case "post":
    case "patch":
    case "put":
      const parsedBody = korpo ? korpoAnalizilo?.parse(korpo) : undefined;
      return [vojo, parsedBody, { params: analizitajParamj, baseURL: bazaURL }] satisfies [
        string,
        unknown,
        AxiosRequestConfig
      ];
  }
};

class BazaKolektoAPI<CollName extends keyof Config<0>["collections"]> {
  constructor(protected name: CollName, protected axios: AxiosInstance) {}

  async create<Depth extends number = 2>(
    data: OmitMeta<Config<0>["collections"][CollName]>,
    config?: TAxiosRequestConfig<Depth>
  ) {
    const res = await this.axios.post<
      TCreateResult<Config<NoInfer<Depth>>["collections"][CollName]>
    >(this.name, data, config);
    return res.data.doc;
  }

  async find<Depth extends number = 2>(
    params: {
      where?: TWhere<Config<0>["collections"][CollName]>;
      depth?: Depth;
      [key: string]: unknown;
    },
    config?: Omit<AxiosRequestConfig, "params">
  ) {
    const res = await this.axios.get<
      PaginatedDocs<Config<NoInfer<Depth>>["collections"][CollName]>
    >(this.name, {
      params,
      ...config,
    });
    return res.data;
  }

  async findSingle<Depth extends number = 2>(
    params: {
      where?: TWhere<Config<0>["collections"][CollName]>;
      depth?: Depth;
      [key: string]: unknown;
    },
    config?: Omit<AxiosRequestConfig, "params">
  ) {
    const res = await this.axios.get<
      PaginatedDocs<Config<NoInfer<Depth>>["collections"][CollName]>
    >(this.name, {
      params: { ...params, limit: 1 },
      ...config,
    });
    const first = res.data.docs.at(0);
    if (!first) throw new Error(`Failed to find item`);
    return first;
  }

  async findById<Depth extends number = 2>(id: string, config?: TAxiosRequestConfig<Depth>) {
    const res = await this.axios.get<Config<NoInfer<Depth>>["collections"][CollName]>(
      `${this.name}/${id}`,
      config
    );
    return res.data;
  }

  async update<Depth extends number = 2>(
    id: string,
    data: Partial<Config<0>["collections"][CollName]>,
    config?: TAxiosRequestConfig<Depth>
  ) {
    const res = await this.axios.patch<
      TUpdateResult<Config<NoInfer<Depth>>["collections"][CollName]>
    >(`${this.name}/${id}`, data, config);
    return res.data.doc;
  }

  async delete<Depth extends number = 2>(id: string, config?: TAxiosRequestConfig<Depth>) {
    const res = await this.axios.delete<
      TDeleteResult<Config<NoInfer<Depth>>["collections"][CollName]>
    >(`${this.name}/${id}`, config);
    return res.data.doc;
  }

  /**
   * Pass the shared endpoint config to this handle to automatically make the request using axios.
   * This can throw.
   * */
  protected async handleCustomEndpoint<Agordoj extends KomunaFinpunktAgordo>(
    agordoj: Agordoj,
    argj: {
      [Sxlosilo in [
        Agordoj["korpoAnalizilo"] extends z.ZodType ? "korpo" : never,
        Agordoj["paramAnalizilo"] extends z.ZodType ? "param" : never
      ][number]]: z.infer<NonNullable<Agordoj[`${Sxlosilo}Analizilo`]>>;
    }
  ): Promise<z.infer<Agordoj["resAnalizilo"]>> {
    const res = await this.axios[agordoj.metodo]<z.infer<Agordoj["resAnalizilo"]>>(
      ...akiriTraktilArgjn(agordoj, argj)
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.data;
  }
}

export default BazaKolektoAPI;
