import type {
  RowLabelArgs,
  RowLabelFunction,
} from "payload/dist/admin/components/forms/RowLabel/types";
import type { CollectionConfig, Option } from "payload/types";

import { AliajLingvoj, Vorto } from "../../../tipoj/payload-asertitaj-tipoj";
import { Kol } from "../nomoj";

interface TRowLabelArgs<T extends RowLabelArgs["data"]> extends RowLabelArgs {
  data: T;
}

const lingvoj = [
  { value: "en", label: "Angla - en" },
  { value: "es", label: "Hispana - es" },
  { value: "zh", label: "Ĉina - zh" },
] satisfies readonly Option[] as unknown as Option[];

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
      admin: {
        components: {
          RowLabel: (props => {
            const data = (props as TRowLabelArgs<Vorto<0>["signifoj"][number]>).data;
            return data.signifo;
          }) satisfies RowLabelFunction,
        },
      },
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
      admin: {
        components: {
          RowLabel: (props => {
            const data = (props as TRowLabelArgs<AliajLingvoj>).data;
            return `${data.lingvo}: ${data.tradukoj?.join(", ") ?? ""}`;
          }) satisfies RowLabelFunction,
        },
      },
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
