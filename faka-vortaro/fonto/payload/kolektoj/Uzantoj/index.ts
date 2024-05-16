import type { CollectionConfig } from "payload/types";

import { Kol, KolGrupo } from "../nomoj";
import { administrantoj } from "../alireblo/ajn";
import { Rolo, Uzanto } from "../../../tipoj/payload-asertitaj-tipoj";
import kreintoKajGxisdatiginto from "../../kampoj/kreintoKajModifinto";
import kreitaKajGxisdatigita from "../../kampoj/kreitaKajModifita";

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
      "gxisdatiginto",
      "updatedAt",
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

    ...kreintoKajGxisdatiginto,
    ...kreitaKajGxisdatigita,
  ],
};
