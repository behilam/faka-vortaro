import type { AfterChangeHook } from "payload/dist/collections/config/types";
import { Kol } from "../../collectionNames";

export const loginAfterCreate: AfterChangeHook = async ({
  doc,
  req,
  req: { payload, body = {}, res },
  operation,
}) => {
  if (operation === "create" && !req.user) {
    const { email, password } = body;

    if (email && password) {
      const { user, token } = await payload.login({
        collection: Kol.Uzantoj,
        data: { email, password },
        req,
        res,
      });

      return {
        ...doc,
        token,
        user,
      };
    }
  }

  return doc;
};
