import type { CollectionConfig } from "payload/types";

import { Kol, KolGrupo } from "../nomoj";
import kreintoKajModifinto from "../../kampoj/kreintoKajModifinto";
import kreitaKajModifita from "../../kampoj/kreitaKajModifita";
import { Noto } from "../../../tipoj/payload-asertitaj-tipoj";

export const Notoj: CollectionConfig = {
  slug: Kol.Notoj,
  admin: {
    useAsTitle: "simbolo" satisfies keyof Noto<0>,
    defaultColumns: ["simbolo", "signifo", "createdAt", "updatedAt"] satisfies (keyof Noto<0>)[],
    group: KolGrupo.Vortaro,
  },
  labels: {
    plural: "Notoj",
    singular: "Noto",
  },
  typescript: {
    interface: "Noto",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "simbolo",
      type: "text",
      required: true,
    },
    {
      name: "signifo",
      type: "textarea",
    },

    ...kreintoKajModifinto,
    ...kreitaKajModifita,
  ],
};
