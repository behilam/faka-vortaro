/* tslint:disable */
/* eslint-disable */
/**
 * This file is automatically generated.
 * If you need to modify these types, please modify the script that generates them,
 * And rerun the script `yarn generate:types` to regenerate this file.
 */

import { Subtrahi } from './utiltipoj';

export interface Config {
  collections: {
    uzantoj: Uzanto;
    terminoj: Termino;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
};
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "uzantoj".
 */
export interface Uzanto<Profundo extends number = 2> {
  id: string;
  nomo?: string | null;
  createdAt: string;
  updatedAt: string;
  roloj?: ('admin' | 'vortaristo')[] | null;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
};
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "terminoj".
 */
export interface Termino<Profundo extends number = 2> {
  id: string;
  termino: string;
  signifoj: {
    signifo: string;
    ekzemploj?:
      | {
          ekzemplo?: string | null;
          id?: string | null;
        }[]
      | null;
    id?: string | null;
  }[];
  lingvoj?: {
    de?:
      | {
          traduko: string;
          id?: string | null;
        }[]
      | null;
    en?:
      | {
          traduko: string;
          id?: string | null;
        }[]
      | null;
    es?:
      | {
          traduko: string;
          id?: string | null;
        }[]
      | null;
    fr?:
      | {
          traduko: string;
          id?: string | null;
        }[]
      | null;
    ja?:
      | {
          traduko: string;
          id?: string | null;
        }[]
      | null;
    pt?:
      | {
          traduko: string;
          id?: string | null;
        }[]
      | null;
    zh?:
      | {
          traduko: string;
          id?: string | null;
        }[]
      | null;
  };
  createdAt: string;
  updatedAt: string;
};
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference<Profundo extends number = 2> {
  id: string;
  user: {
    relationTo: 'uzantoj';
    value: Profundo extends 0 ? string : Uzanto<Subtrahi<Profundo>>;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
};
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration<Profundo extends number = 2> {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
};


/* Derivated types */
export type Rolo = NonNullable<Uzanto<0>["roloj"]>[number];
export type Signifo = NonNullable<Termino<0>["signifoj"]>[number];
export type SignifoEkzemplo = NonNullable<Signifo["ekzemploj"]>[number];
export type Tradukoj = NonNullable<Termino<0>["lingvoj"]>;
