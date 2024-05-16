import { Field } from "payload/types";

import { Kol } from "../kolektoj/nomoj";

const kreintoKajModifinto: Field[] = [
  {
    name: "kreinto",
    type: "relationship",
    relationTo: Kol.Uzantoj,
    access: {
      create: () => false,
      update: () => false,
    },
    admin: {
      hidden: true,
      disableBulkEdit: true,
    },
    hooks: {
      beforeChange: [
        ({ req, value, operation }) => {
          return operation === "create" ? req.user?.id : value;
        },
      ],
    },
  },
  {
    name: "gxisdatiginto",
    label: "Lasta Ĝisdatiginto",
    type: "relationship",
    relationTo: Kol.Uzantoj,
    access: {
      create: () => false,
      update: () => false,
    },
    admin: {
      hidden: true,
      disableBulkEdit: true,
    },
    hooks: {
      beforeChange: [
        ({ req, value, operation }) => {
          switch (operation) {
            case "create":
            case "update": {
              return req.user?.id;
            }
            default:
              return value;
          }
        },
      ],
    },
  },
];

export default kreintoKajModifinto;
