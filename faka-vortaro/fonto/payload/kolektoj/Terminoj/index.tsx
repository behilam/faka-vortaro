import React from "react";
import type {
  RowLabelArgs,
  RowLabelComponent,
} from "payload/dist/admin/components/forms/RowLabel/types";
import type { ArrayField, CollectionConfig, Option } from "payload/types";

import {
  Signifo,
  SignifoEkzemplo,
  SignifoSinonimo,
  Termino,
  Tradukoj,
} from "../../../tipoj/payload-asertitaj-tipoj";
import kreintoKajModifinto from "../../kampoj/kreintoKajModifinto";
import { Kol, KolGrupo } from "../nomoj";
import LingvojCxelo from "./eroj/cxeloj/lingvoj";
import kreitaKajModifita from "../../kampoj/kreitaKajModifita";

interface TRowLabelArgs<T extends RowLabelArgs["data"]> extends RowLabelArgs {
  data: T;
}

const lingvoj = [
  { value: "de", label: "Germana - DE" },
  { value: "en", label: "Angla - EN" },
  { value: "es", label: "Hispana - ES" },
  { value: "fr", label: "Franca - FR" },
  { value: "ja", label: "Japana - JA" },
  { value: "pt", label: "Portugala - PT" },
  { value: "zh", label: "Ĉina - ZH" },
] as const satisfies Option[];

export const Terminoj: CollectionConfig = {
  slug: Kol.Terminoj,
  admin: {
    useAsTitle: "termino" satisfies keyof Termino<0>,
    defaultColumns: ["termino", "signifoj", "lingvoj", "createdAt"] satisfies (keyof Termino<0>)[],
    group: KolGrupo.Vortaro,
  },
  labels: {
    plural: "Terminoj",
    singular: "Termino",
  },
  typescript: {
    interface: "Termino",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "termino",
      label: "Termino",
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
          Cell: ({ cellData }: { cellData: Signifo[] }) => {
            return <div>{cellData.length}</div>;
          },
          RowLabel: (({ data, index }) => {
            const { signifo } = data as Partial<Signifo>;
            return (
              <p className="absolute w-11/12 truncate">
                {index ?? 0} - {signifo}
              </p>
            );
          }) satisfies RowLabelComponent,
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
            initCollapsed: true,
            components: {
              RowLabel: (({ data, index }) => {
                const { ekzemplo } = data as Partial<SignifoEkzemplo>;
                return (
                  <p className="absolute w-11/12 truncate">
                    {index ?? 0} - {ekzemplo}
                  </p>
                );
              }) satisfies RowLabelComponent,
            },
          },
          fields: [
            {
              name: "ekzemplo",
              type: "text",
              label: false,
            },
          ],
        },
        {
          name: "sinonimoj",
          type: "array",
          labels: {
            plural: "Sinonimoj",
            singular: "Sinonimo",
          },
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: (({ data, index }) => {
                const { sinonimo } = data as Partial<SignifoSinonimo>;
                return (
                  <p className="absolute w-11/12 truncate">
                    {index ?? 0} - {sinonimo}
                  </p>
                );
              }) satisfies RowLabelComponent,
            },
          },
          fields: [
            {
              name: "sinonimo",
              type: "text",
              label: false,
            },
          ],
        },
      ],
    },
    {
      name: "notoj",
      type: "relationship",
      relationTo: Kol.Notoj,
      hasMany: true,
    },
    {
      name: "lingvoj",
      type: "group",
      admin: {
        components: {
          Cell: LingvojCxelo,
        },
      },
      fields: lingvoj.map(
        ({ value, label }): ArrayField => ({
          name: value,
          type: "array",
          label,
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: (({ data, index }) => {
                const { traduko } = data as NonNullable<
                  Partial<Tradukoj>[(typeof lingvoj)[number]["value"]]
                >[number];
                return (
                  <p className="absolute w-11/12 truncate">
                    {index ?? 0} - {traduko}
                  </p>
                );
              }) satisfies RowLabelComponent,
            },
          },
          fields: [
            {
              name: "traduko",
              type: "text",
              required: true,
              admin: {
                components: {
                  Label: () => {
                    return <></>;
                  },
                },
              },
            },
          ],
        })
      ),
    },

    ...kreintoKajModifinto,
    ...kreitaKajModifita,
  ],
};
