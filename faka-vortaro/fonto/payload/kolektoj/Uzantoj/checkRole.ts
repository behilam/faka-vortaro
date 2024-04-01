import { Rolo } from "../../../tipoj/payload-asertitaj-tipoj";
import type { Uzanto } from "../../../tipoj/payload-tipoj";

export const checkRole = (allRoles: Uzanto["roloj"] = [], user?: Uzanto): boolean => {
  if (user) {
    if (
      allRoles?.some(role => {
        return user?.roloj?.some((uzantRolo: Rolo) => {
          return uzantRolo === role;
        });
      })
    )
      return true;
  }

  return false;
};
