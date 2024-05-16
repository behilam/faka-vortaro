import type { CollectionConfig } from "payload/types";

import { Kol, KolGrupo } from "../nomoj";
import { administrantoj } from "../alireblo/ajn";
import { Rolo, Uzanto } from "../../../tipoj/payload-asertitaj-tipoj";
import Dato from "../../eroj/cxeloj/Dato";

export const Uzantoj: CollectionConfig = {
  slug: Kol.Uzantoj,
  typescript: {
    interface: "Uzanto",
  },
  admin: {
    useAsTitle: "nomo" satisfies keyof Uzanto<0>,
    defaultColumns: [
      "nomo",
      "email",
      "roloj",
      "updatedAt",
      "createdAt",
    ] satisfies (keyof Uzanto<0>)[],
    group: KolGrupo.Homoj,
  },
  labels: {
    singular: "Uzanto",
    plural: "Uzantoj",
  },
  access: {
    create: administrantoj,
    update: administrantoj,
    delete: administrantoj,
  },
  auth: true,
  fields: [
    {
      name: "nomo",
      type: "text",
    },
    {
      name: "email",
      label: "Retpoŝto",
      type: "email",
      required: true,
    },
    {
      name: "roloj",
      type: "select",
      hasMany: true,
      defaultValue: ["vortaristo"] satisfies Rolo[],
      options: ["admin", "vortaristo"],
      access: {
        read: administrantoj,
      },
    },
    {
      name: "createdAt",
      type: "date",
      label: "Kreita je",
      admin: {
        hidden: true,
        components: {
          Cell: Dato,
        },
      },
    },
    {
      name: "updatedAt",
      type: "date",
      label: "Ĝisdatigita je",
      admin: {
        hidden: true,
        components: {
          Cell: Dato,
        },
      },
    },
  ],
};
