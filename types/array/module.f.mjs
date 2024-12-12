// @ts-self-types="./module.f.d.mts"
import * as option from '../nullable/module.f.mjs'
const { map } = option

/**
 * @template T
 * @typedef {readonly[T]} Array1
 */

/** @typedef {0} Index1 */

/**
 * @template T
 * @typedef {readonly[T, T]} Array2
 */

/**
 * @template T0
 * @template T1
 * @typedef {readonly[T0, T1]} Tuple2
 */

/** @typedef {0|1} Index2 */

/**
 * @template T
 * @typedef {readonly[T, T, T]} Array3
 */

/**
 * @template T0
 * @template T1
 * @template T2
 * @typedef {readonly[T0, T1, T2]} Tuple3
 */

/** @typedef {0|1|2} Index3 */

/**
 * @template T
 * @typedef {readonly[T, T, T, T]} Array4
 */

/** @typedef {0|1|2|3} Index4 */

/**
 * @template T
 * @typedef {readonly[T, T, T, T, T]} Array5
 */

/**
 * @template T
 * @typedef {readonly[T, T, T, T, T, T, T, T]} Array8
 */

/**
 * @template T
 * @typedef {readonly[T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]} Array16
 */

/** @typedef {0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15} Index16 */

/**
 * @template T
 * @typedef {Array1<T>| Array2<T> | Array3<T> | Array4<T> | Array5<T>} Array1_5
 */

/** @typedef {0|1|2|3|4} Index5 */

/**
 * @template T
 * @typedef {T extends Array1<infer _> ? Index1 :
 *  T extends Array2<infer _> ? Index2 :
 *  T extends Array3<infer _> ? Index3 :
 *  T extends Array4<infer _> ? Index4 :
 *  T extends Array5<infer _> ? Index5 :
 *  T extends readonly (infer _)[] ? number :
 *  never
 * } KeyOf
 */

/** @type {<T>(_: readonly T[]) => readonly T[]} */
const uncheckTail = a => a.slice(1)

/** @type {<T>(_: readonly T[]) => readonly T[]} */
const uncheckHead = a => a.slice(0, -1)

/** @type {(index: number) => <T>(a: readonly T[]) => T|null} */
export const at = i => a => {
    const r = a[i]
    return r === void 0 ? null : r
}

/** @type {<T>(_: readonly T[]) => T|null} */
export const first = at(0)

/** @type {<T>(_: readonly T[]) => T|null} */
export const last = a => at(a.length - 1)(a)

/** @type {<T>(_: readonly T[]) => readonly T[] | null} */
export const tail = a => a.length === 0 ? null : uncheckTail(a)

/** @type {<T>(_: readonly T[]) => readonly[T, readonly T[]]|null} */
export const splitFirst = a => {
    /** @typedef {typeof a[0]} T*/
    /** @type {(_: T) => readonly[T, readonly T[]]} */
    const split = first => [first, uncheckTail(a)]
    return map(split)(first(a))
}

/** @type {<T>(_: readonly T[]) => readonly T[]|null} */
export const head = a => a.length === 0 ? null : uncheckHead(a)

/** @type {<T>(_: readonly T[]) => readonly[readonly T[], T]|null} */
export const splitLast = a => {
    const lastA = last(a)
    if (lastA === null) { return null }
    return [uncheckHead(a), lastA]
}
