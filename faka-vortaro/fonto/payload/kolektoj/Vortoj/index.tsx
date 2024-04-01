import type { CollectionConfig, Option } from "payload/types";

import { Vorto } from "../../../tipoj/payload-asertitaj-tipoj";
import { Kol } from "../nomoj";

const lingvoj = ["en", "es", "zh"] satisfies readonly Option[] as unknown as Option[];

export const Vortoj: CollectionConfig = {
  slug: Kol.Vortoj,
  admin: {
    useAsTitle: "nomo" satisfies keyof Vorto<0>,
    defaultColumns: ["nomo", "signifoj"] satisfies (keyof Vorto<0>)[],
  },
  labels: {
    plural: "Vortoj",
    singular: "Vorto",
  },
  typescript: {
    interface: "Vorto",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "nomo",
      type: "text",
      required: true,
    },
    {
      name: "signifoj",
      type: "array",
      required: true,
      defaultValue: [{ signifo: "" }] satisfies Vorto<0>["signifoj"],
      fields: [
        {
          name: "signifo",
          type: "textarea",
          required: true,
        },
        {
          name: "transitivo",
          type: "select",
          options: ["tr", "ntr", "x"],
        },
      ],
    },
    {
      name: "aliajLingvoj",
      type: "array",
      fields: [
        {
          name: "lingvo",
          type: "select",
          options: lingvoj,
          required: true,
        },
        {
          name: "tradukoj",
          type: "text",
          hasMany: true,
        },
      ],
    },
  ],
};
