const { todo } = require('../lib')
const lib = require('../lib')
const iter = require('../lib/iterable')

/**
 * @typedef {{
 *  packages: Packages
 *  file: (_: string) => string|undefined
 * }} Package
 */

/** @typedef {(_: string) => undefined|Package|Packages} Packages */

/** @type {lib.Reduce<string, undefined|string[]>} */
const pathNormReduce = {
    merge: path => item =>
        path === undefined ?
            undefined :
        ['', '.'].includes(item) ?
            path :
        item === '..' ?
            (path.length === 0 ? undefined : path.slice(0, -1)) :
            [...path, item],
    init: []
}

/** @type {(_: string[]) => boolean} */
const isRelative = localId => ['.', '..'].includes(localId[0])

const pathNorm = iter.reduce(pathNormReduce)

/** @type {(_: Package) => (_: string[]) => string|undefined} */
const internal = pack => path => {
    const a = pathNorm(path)
    /** @type {(_: string) => string|undefined} */
    const norm = n => {
        return n === '' ? 
                pack.file('index.js') : 
            ['.', '..', ''].includes(lib.last(path)) ? 
                pack.file(n + '/index.js') : 
                (pack.file(n + '.js') ?? pack.file(n) ?? pack.file(n + '/index.js'))
    }
    return a === undefined ? undefined : norm(a.join('/'))
}

/** @type {(_: Package|Packages|undefined) => (_: string[]) => string|undefined} */
const externalOrInternal = p => 
    p === undefined ? () => undefined : (typeof p === 'function' ? external(p) : internal(p))

/** @type {(_: Packages) => (_: string[]) => string|undefined} */
const external = packages => path => 
    path.length === 0 ? undefined : externalOrInternal(packages(path[0]))(path.slice(1))

/** @type {(_: Package) => (_: string[]) => string|undefined} */
const getModule = pack => path => (isRelative(path) ? internal(pack) : external(pack.packages))(path)

module.exports = {
    isRelative,
    pathNorm,
    getModule,
}