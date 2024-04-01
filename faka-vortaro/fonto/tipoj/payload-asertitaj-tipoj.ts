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
    vortoj: Vorto;
    uzantoj: Uzanto;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
};
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "vortoj".
 */
export interface Vorto<Profundo extends number = 2> {
  id: string;
  nomo: string;
  signifoj: {
    signifo: string;
    transitivo?: ('tr' | 'ntr' | 'x') | null;
    id?: string | null;
  }[];
  aliajLingvoj?:
    | {
        lingvo: 'en' | 'es' | 'zh';
        tradukoj?: string[] | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
};
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "uzantoj".
 */
export interface Uzanto<Profundo extends number = 2> {
  id: string;
  nomo?: string | null;
  roloj?: ('admin' | 'ulo')[] | null;
  updatedAt: string;
  createdAt: string;
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
