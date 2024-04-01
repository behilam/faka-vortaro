import type { AccessArgs } from "payload/config";

import { checkRole } from "../collections/Users/checkRole";
import type { User } from "../../tipoj/payload-tipoj";

type isAdmin = (args: AccessArgs<unknown, User>) => boolean;

export const admins: isAdmin = ({ req: { user } }) => {
  return checkRole(["admin"], user ?? undefined);
};
