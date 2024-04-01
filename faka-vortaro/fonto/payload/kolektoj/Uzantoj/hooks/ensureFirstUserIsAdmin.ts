import type { FieldHook } from "payload/types";

import type { Uzantoj } from "../../../../tipoj/payload-asertitaj-tipoj";
import { Kol } from "../../collectionNames";

// ensure the first user created is an admin
// 1. lookup a single user on create as succinctly as possible
// 2. if there are no users found, append `admin` to the roles array
// access control is already handled by this fields `access` property
// it ensures that only admins can create and update the `roles` field
export const ensureFirstUserIsAdmin: FieldHook<Uzantoj> = async ({ req, operation, value }) => {
  if (operation === "create") {
    const users = await req.payload.find({ collection: Kol.Uzantoj, limit: 0, depth: 0 });
    if (users.totalDocs === 0) {
      // if `admin` not in array of values, add it
      if (!(value || []).includes("admin")) {
        return [...(value || []), "admin"];
      }
    }
  }

  return value;
};
