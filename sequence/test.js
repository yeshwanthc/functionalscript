const seq = require('.')
const { sum } = require('./operator')
const op = require('./operator')
const array = require('./array')

/** @type {<T>(input: seq.Sequence<T>) => void} */
const print = input => {
    let i = input
    while (true) {
        const result = seq.next(i)
        if (result === undefined) { return }
        console.log(result[0])
        i = result[1]
    }
}

{
    const big = seq.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 42, 60)
    const list0 = seq.list(0, 1, 2, 3)
    const list1 = seq.flatMap(x => seq.list(x, x * 2, x * 3))(list0)
    const list2 = seq.concat(list0, list0)
    const list3 = seq.exclusiveScan(sum)(list0)
    const r = seq.find(x => x === 42)(big)
    if (seq.every(x => x > 0)(big) !== true) { throw 'x'}
    if (seq.every(x => x < 20)(big) !== false) { throw 'x' }
    if (seq.some(x => x > 100)(big) !== false) { throw 'x' }
    if (seq.some(x => x > 50)(big) !== true) { throw 'x' }
    if (seq.first(seq.drop(16)(big)) !== 42) { throw 'drop'}
    {
        const a = seq.toArray(seq.generate(1_000_000))
        let x = seq.concat(array.toSequence(a), big)
        const r = seq.next(x)
        // print(x)
    }
    {
        const a = seq.map(seq.generate)(seq.generate(100_000))
        const array = seq.toArray(a)
        const x = seq.concat(...array)
        const r = seq.next(x)
        // print(x)
    }
    {
        let x = big
        for (let i = 0; i < 1_000_000; ++i) {
            x = seq.concat(seq.empty, x)
        }
        const r = seq.next(x)
        // print(x)
    } 
    {
        let x = big
        for (let i = 0; i < 1_000_000; ++i) {
            x = seq.concat(x, seq.list(i))
        }
        const r = seq.next(x)
        // print(x)
    }
}

{
    const x = seq.join(':')(seq.list("1", "2", "3", "4", "5", "6"))
    if (x !== "1:2:3:4:5:6") { throw x }
}
