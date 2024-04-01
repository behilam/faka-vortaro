/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Operator } from "payload/types";

import type { IngeNecesigiSxlosilojn } from "./utiltipoj";

export type OmitMeta<T extends Record<string, any>> = Omit<T, "id" | "createdAt" | "updatedAt">;

export type TWhere<T extends Record<string, any>> = {
  [K in IngeNecesigiSxlosilojn<T> | "or" | "and"]?: K extends "or" | "and" ? TWhere<T>[] : TWhereField<T[K]> | TWhere<T>[];
};

export type TWhereField<Value> = {
  [K in Operator]?: K extends "equals" | "not_equals"
    ? Value extends undefined
      ? Value | null
      : Value
    : K extends "in" | "not_in"
    ? Value[]
    : unknown;
};
