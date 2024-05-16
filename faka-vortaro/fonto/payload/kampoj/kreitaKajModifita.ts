import { Field } from "payload/types";
import Dato from "../eroj/cxeloj/Dato";

const kreitaKajModifita: Field[] = [
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
];

export default kreitaKajModifita;
