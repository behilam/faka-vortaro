/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

/** Primitivaj tipoj de Typescript */
export type Primitiva = string | number | boolean | bigint | symbol | undefined | null;
export type Malvereca = null | undefined | false | 0 | -0 | 0n | "";

/** Ĝisfunde igas opciajn atributojn ankaŭ `null` */
export type NuligiOpciajn<T> = T extends Primitiva
  ? T
  : [T] extends [Array<infer U>]
  ? Array<NuligiOpciajn<U>>
  : T extends Array<infer U>
  ? Array<NuligiOpciajn<U>>
  : {
      [K in keyof T]: Extract<T[K], undefined> extends never ? NuligiOpciajn<T[K]> : NuligiOpciajn<T[K]> | null;
    };

/** Ĝisfunde igas ĉiujn ŝlosilojn de objekto necesaj */
export type GxisfundeNecesa<T> = T extends Primitiva
  ? T
  : [T] extends [Array<infer U>]
  ? Array<GxisfundeNecesa<U>>
  : T extends Array<infer U>
  ? Array<GxisfundeNecesa<U>>
  : { [K in keyof T]-?: GxisfundeNecesa<T[K]> };

/** Ĝisfund igas ĉiujn ŝlosilojn opciaj. Ne taŭga por funkcioj */
export type GxisfundeOpcia<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? Array<GxisfundeOpcia<U>>
  : T extends object
  ? { [K in keyof T]?: GxisfundeOpcia<T[K]> }
  : T | undefined;

/** Redonas `true` se ambaŭ A kaj B ekzakte samas. Ĝi ne taŭgas por kompari funkciojn */
export type CxuDatumojEgalas<A, B> = [[A], [B]] extends [[B], [A]]
  ? [[GxisfundeNecesa<A>], [GxisfundeNecesa<B>]] extends [[GxisfundeNecesa<B>], [GxisfundeNecesa<A>]]
    ? true
    : "Necesaj A kaj B ne egalas"
  : "A kaj B ne egalas";

/** Ĝi kreas Nombrilon kun longo `Longo`. Utila por komputi nombrojn en la tip-sistemo de Typescript */
export type Nombrilo<Longo extends number, Nombrujo extends any[] = []> = Nombrujo extends {
  length: Longo;
}
  ? Nombrujo
  : Nombrilo<Longo, [...Nombrujo, any]>;

/** Ĝi ricevas Nombrilo kaj redonas ĝian longon. Utila por redoni la rezulton de nombro-komputon en la tip-sistemo de Typescript */
export type NombriloAlNombro<Nombrilo extends any[]> = Nombrilo extends {
  length: infer Longo;
}
  ? Longo
  : never;

/** Ĝi redonas la diferencon inter du nombroj. La Subtrahato devas pligrandi aŭ egali Subtrahanton aŭ ĝi ĉiam redonos `never` */
export type Subtrahi<Subtrahato extends number, Subtrahanto extends number = 1> = Nombrilo<Subtrahato> extends [
  ...infer Diferenco,
  ...Nombrilo<Subtrahanto>
]
  ? NombriloAlNombro<Diferenco>
  : never;

export type IngeNecesigiSxlosilojn<Objektotipo extends object> = {
  [Sxlosilo in keyof Objektotipo & string]: Required<Objektotipo>[Sxlosilo] extends any[]
    ? `${Sxlosilo}`
    : Required<Objektotipo>[Sxlosilo] extends object
    ? `${Sxlosilo}` | `${Sxlosilo}.${IngeNecesigiSxlosilojn<Required<Objektotipo>[Sxlosilo]>}`
    : `${Sxlosilo}`;
}[keyof Objektotipo & string];

/** Opciigas la elektitajn ŝlosilojn de objekto */
export type Opciigi<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
/** Necesigas la elektitajn ŝlosilojn de objekto */
export type Necesigi<T, K extends keyof T> = Pick<Required<T>, K> & Omit<T, K>;
