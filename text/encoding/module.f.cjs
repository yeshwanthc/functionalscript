const result = require('../../types/result/module.f.cjs')
const list = require('../../types/list/module.f.cjs')
const operator = require('../../types/function/operator/module.f.cjs')
const array = require('../../types/array/module.f.cjs')
const { contains } = require('../../types/range/module.f.cjs')
const { ok, error } = result

/** @typedef {result.Result<number,number>} ByteResult */

/** @typedef {result.Result<number,readonly number[]>} CodePointResult */

/** @typedef {number|undefined} ByteOrEof */

/** @typedef {undefined|array.Array1<number>|array.Array2<number>|array.Array3<number>} Utf8State */

/** @typedef {undefined|array.Array1<number>|array.Array2<number>|array.Array3<number>} Utf16State */

/** @type {(a:number) => boolean} */
const isBmpCodePoint = a => a >= 0x0000 && a <= 0xd7ff || a >= 0xe000 && a <= 0xffff

const isHighSurrogate = contains([0xd800, 0xdbff])

/** @type {(a:number) => boolean} */
const isLowSurrogate = contains([0xdc00, 0xdfff])

/** @type {(input:number) => list.List<ByteResult>} */
const codePointToUtf8 = input =>
{
    if (input >= 0x0000 && input <= 0x007f) { return [ok(input & 0x7f)] }
    if (input >= 0x0080 && input <= 0x07ff) { return [ok(input >> 6 | 0xc0), ok(input & 0x3f | 0x80)] }
    if (input >= 0x0800 && input <= 0xffff) { return [ok(input >> 12 | 0xe0), ok(input >> 6 & 0x3f | 0x80), ok(input & 0x3f | 0x80)] }
    if (input >= 0x10000 && input <= 0x10ffff) { return [ok(input >> 18 | 0xf0), ok(input >> 12 & 0x3f | 0x80), ok(input >> 6 & 0x3f | 0x80), ok(input & 0x3f | 0x80)] }
    return [error(input)]
}

/** @type {(input:number) => list.List<ByteResult>} */
const codePointToUtf16 = input =>
{
    if (isBmpCodePoint(input)) { return [ok(input >> 8), ok(input & 0xff)] }
    if (input >= 0x010000 && input <= 0x10ffff) {
        const high = ((input - 0x10000) >> 10) + 0xd800
        const low = ((input - 0x10000) & 0x3ff) + 0xdc00
        return [ok(high >> 8), ok(high & 0xff), ok(low >> 8), ok(low & 0xff)]
    }
    return [error(input)]
}

/** @type {(input: list.List<number>) => list.List<ByteResult>} */
const codePointListToUtf8 = list.flatMap(codePointToUtf8)

/** @type {(input: list.List<number>) => list.List<ByteResult>} */
const codePointListToUtf16 = list.flatMap(codePointToUtf16)

/** @type {operator.StateScan<number, Utf8State, list.List<CodePointResult>>} */
const utf8ByteToCodePointOp = state => byte => {
    if (byte < 0x00 || byte > 0xff) {
        return [[error([byte])], state]
    }    
    if (state == undefined) {
        if (byte < 0x80) { return [[ok(byte)], undefined] }
        if (byte >= 0xc2 && byte <= 0xf4) { return [[], [byte]] }
        return [[error([byte])], undefined]
    }
    if (byte >= 0x80 && byte < 0xc0)
    {
        switch(state.length)
        {
            case 1:
                if (state[0] < 0xe0) { return [[ok(((state[0] & 0x1f) << 6) + (byte & 0x3f))], undefined] }
                if (state[0] < 0xf8) { return [[], [state[0], byte]] }
                break         
            case 2:
                if (state[0] < 0xf0) { return [[ok(((state[0] & 0x0f) << 12) + ((state[1] & 0x3f) << 6) + (byte & 0x3f))], undefined] }
                if (state[0] < 0xf8) { return [[], [state[0], state[1], byte]] }
                break
            case 3: 
                return [[ok(((state[0] & 0x07) << 18) + ((state[1] & 0x3f) << 12) + ((state[2] & 0x3f) << 6) + (byte & 0x3f))], undefined]
        }
    }    
    return [[error(list.toArray(list.concat(state)([byte])))], undefined]
}

/** @type {(state: Utf8State) => readonly[list.List<CodePointResult>, Utf8State]} */
const utf8EofToCodePointOp = state => [state == undefined ? undefined : [error(state)],  undefined]

/** @type {operator.StateScan<ByteOrEof, Utf8State, list.List<CodePointResult>>} */
const utf8ByteOrEofToCodePointOp = state => input => input === undefined ? utf8EofToCodePointOp(state) : utf8ByteToCodePointOp(state)(input)

/** @type {(input: list.List<number>) => list.List<CodePointResult>} */
const utf8ListToCodePoint = input => list.flat(list.stateScan(utf8ByteOrEofToCodePointOp)(undefined)(list.concat(/** @type {list.List<ByteOrEof>} */(input))([undefined])))

/** @type {operator.StateScan<number, Utf16State, list.List<CodePointResult>>} */
const utf16ByteToCodePointOp = state => byte => {
    if (byte < 0x00 || byte > 0xff) {
        return [[error([byte])], state]
    }
    if (state == undefined) {
        return [[], [byte]]
    }
    switch(state.length)
    {
        case 1:
            const codeUnit = (state[0] << 8) + byte
            if (isBmpCodePoint(codeUnit)) { return [[ok(codeUnit)], undefined] }
            if (isHighSurrogate(codeUnit)) { return [[], [state[0], byte]] }
            break
        case 2:
            return [[], [state[0], state[1], byte]]
        case 3:             
            if (isLowSurrogate((state[2] << 8) + byte)) {
                const high = (state[0] << 8) + state[1] - 0xd800
                const low = (state[2] << 8) + byte - 0xdc00
                return [[ok((high << 10) + low + 0x10000)], undefined]
            } 
            break
    }
    return [[error(list.toArray(list.concat(state)([byte])))], undefined]
}

/** @type {(state: Utf8State) => readonly[list.List<CodePointResult>, Utf16State]} */
const utf16EofToCodePointOp = state => [state == undefined ? undefined : [error(state)],  undefined]

/** @type {operator.StateScan<ByteOrEof, Utf8State, list.List<CodePointResult>>} */
const utf16ByteOrEofToCodePointOp = state => input => input === undefined ? utf16EofToCodePointOp(state) : utf16ByteToCodePointOp(state)(input)

/** @type {(input: list.List<number>) => list.List<CodePointResult>} */
const utf16ListToCodePoint = input => list.flat(list.stateScan(utf16ByteOrEofToCodePointOp)(undefined)(list.concat(/** @type {list.List<ByteOrEof>} */(input))([undefined])))

module.exports = {
    /** @readonly */
    codePointListToUtf8,
    /** @readonly */
    codePointListToUtf16,
    /** @readonly */
    utf8ListToCodePoint,
    /** @readonly */
    utf16ListToCodePoint
}
