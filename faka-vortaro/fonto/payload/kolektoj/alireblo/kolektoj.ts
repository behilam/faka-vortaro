import { Access } from "payload/config";

export const administrantoj: Access = ({ req }) => {
  return req.user.roloj.includes("admin");
};
