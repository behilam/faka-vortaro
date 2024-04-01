import type { CollectionConfig } from "payload/types";

import { Kol } from "../nomoj";
import { administrantoj } from "../alireblo/ajn";
import { Rolo, Uzanto } from "../../../tipoj/payload-asertitaj-tipoj";

export const Uzantoj: CollectionConfig = {
  slug: Kol.Uzantoj,
  typescript: {
    interface: "Uzanto",
  },
  admin: {
    useAsTitle: "nomo" satisfies keyof Uzanto<0>,
    defaultColumns: ["nomo", "email"] satisfies (keyof Uzanto<0>)[],
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
      defaultValue: ["ulo"] satisfies Rolo[],
      options: ["admin", "ulo"],
      access: {
        read: administrantoj,
      },
    },
  ],
  timestamps: true,
};
