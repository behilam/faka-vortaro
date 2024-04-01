import { Access, FieldAccess } from "payload/types";

export const administrantoj: Access & FieldAccess = ({ req }) => {
  return req.user.roloj.includes("admin");
};
