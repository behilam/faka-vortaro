import type {
  RowLabelArgs,
  RowLabelFunction,
} from "payload/dist/admin/components/forms/RowLabel/types";
import type { CollectionConfig, Option } from "payload/types";

import {
  AliaLingvo,
  Signifo,
  SignifoEkzemplo,
  Vorto,
} from "../../../tipoj/payload-asertitaj-tipoj";
import { Kol, KolGrupo } from "../nomoj";

interface TRowLabelArgs<T extends RowLabelArgs["data"]> extends RowLabelArgs {
  data: T;
}

const lingvoj = [
  { value: "en", label: "Angla - en" },
  { value: "es", label: "Hispana - es" },
  { value: "zh", label: "Ĉina - zh" },
] as const satisfies Option[];

export const Vortoj: CollectionConfig = {
  slug: Kol.Vortoj,
  admin: {
    useAsTitle: "nomo" satisfies keyof Vorto<0>,
    defaultColumns: ["nomo", "signifoj", "aliajLingvoj", "createdAt"] satisfies (keyof Vorto<0>)[],
    group: KolGrupo.Vortaro,
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
      label: "Nomo de la vorto",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "signifoj",
      type: "array",
      labels: {
        plural: "Signifoj",
        singular: "Signifo",
      },
      required: true,
      defaultValue: [{ signifo: "" }] satisfies Signifo[],
      admin: {
        components: {
          RowLabel: (props => {
            const { signifo } = (props as TRowLabelArgs<Partial<Signifo>>).data;
            return signifo ?? "";
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
          name: "ekzemploj",
          type: "array",
          labels: {
            plural: "Ekzemploj",
            singular: "Ekzemplo",
          },
          admin: {
            components: {
              RowLabel: (props => {
                const { ekzemplo } = (props as TRowLabelArgs<Partial<SignifoEkzemplo>>).data;
                return ekzemplo ?? "";
              }) satisfies RowLabelFunction,
            },
          },
          fields: [
            {
              name: "ekzemplo",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      name: "aliajLingvoj",
      type: "array",
      labels: {
        plural: "Aliaj lingvoj",
        singular: "Alia lingvo",
      },
      admin: {
        components: {
          RowLabel: (props => {
            const { lingvo, tradukoj } = (props as TRowLabelArgs<Partial<AliaLingvo>>).data;
            return `${lingvo ?? ""}: ${tradukoj?.join(", ") ?? ""}`;
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
    {
      name: "createdAt",
      type: "date",
      label: "Kreita je",
      admin: {
        hidden: true,
      },
    },
    {
      name: "updatedAt",
      type: "date",
      label: "Ĝisdatigita je",
      admin: {
        hidden: true,
      },
    },
  ],
};
