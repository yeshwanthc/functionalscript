import { entries, fold } from '../../types/list/module.f.ts'
import { reset, fgGreen, fgRed, bold } from '../../text/sgr/module.f.ts'
import type * as Result from '../../types/result/module.f.ts'
import type { Io, Performance } from '../../io/module.f.ts'
import { env, loadModuleMap } from '../module.f.ts'
type DependencyMap = {
   readonly[k in string]?: Module
}

type Module = {
   readonly default?: unknown
}

type ModuleMap = {
   readonly[k in string]: Module
}

type Log<T> = (v: string) => (state: T) => T

type Measure<T> = <R>(f: () => R) => (state: T) => readonly[R, number, T]

type Input<T> = {
    readonly moduleMap: ModuleMap,
    readonly log: Log<T>,
    readonly error: Log<T>,
    readonly measure: Measure<T>,
    readonly state: T,
    readonly tryCatch: <R>(f: () => R) => Result.Result<R, unknown>,
    readonly env: (n: string) => string|undefined
 }

const isTest = (s: string) => s.endsWith('test.f.mjs') || s.endsWith('test.f.js') || s.endsWith('test.f.ts')

type TestState = {
    readonly time: number,
    readonly pass: number,
    readonly fail: number,
 }

const addPass = (delta: number) => (ts: TestState): TestState =>
    ({ ...ts, time: ts.time + delta, pass: ts.pass + 1 })

const addFail = (delta: number) => (ts: TestState): TestState =>
    ({ ...ts, time: ts.time + delta, fail: ts.fail + 1 })

type FullState<T> = readonly[TestState, T]

const timeFormat = (a: number) => {
    const y = Math.round(a * 10_000).toString()
    const yl = 5 - y.length
    const x = '0'.repeat(yl > 0 ? yl : 0) + y
    const s = x.length - 4
    const b = x.substring(0, s)
    const e = x.substring(s)
    return `${b}.${e} ms`
}

export const test = <T>(input: Input<T>): readonly[number, T] => {
    let { moduleMap, log, error, measure, tryCatch, env, state } = input
    const isGitHub = env('GITHUB_ACTION') !== void 0
    const f
        : (k: readonly[string, Module]) => (fs: FullState<T>) => FullState<T>
        = ([k, v]) => {
        const test
            : (i: string) => (v: unknown) => (fs: FullState<T>) => FullState<T>
            = i => v => ([ts, state]) => {
            const next = test(`${i}| `)
            switch (typeof v) {
                case 'function': {
                    if (v.length === 0) {
                        const [[s, r], delta, state0] = measure(() => tryCatch(v as () => unknown))(state)
                        state = state0
                        // Usual tests throw on error, but if the function name is 'throw', then the test passes if it throws.
                        if ((s === 'error') === (v.name !== 'throw')) {
                            ts = addFail(delta)(ts)
                            if (isGitHub) {
                                // https://docs.github.com/en/actions/learn-github-actions/workflow-commands-for-github-actions
                                // https://github.com/OndraM/ci-detector/blob/main/src/Ci/GitHubActions.php
                                state = error(`::error file=${k},line=1,title=[3]['a']()::${r}`)(state)
                            } else {
                                state = error(`${i}() ${fgRed}error${reset}, ${timeFormat(delta)}`)(state)
                                state = error(`${fgRed}${r}${reset}`)(state)
                            }
                        } else {
                            ts = addPass(delta)(ts)
                            state = log(`${i}() ${fgGreen}ok${reset}, ${timeFormat(delta)}`)(state)
                        }
                        [ts, state] = next(r)([ts, state])
                    }
                    break
                }
                case 'object': {
                    if (v !== null) {
                        const f
                            : (k: readonly[string|number, unknown]) => (fs: FullState<T>) => FullState<T>
                            = ([k, v]) => ([time, state]) => {
                            state = log(`${i}${k}:`)(state);
                            [time, state] = next(v)([time, state])
                            return [time, state]
                        }
                        [ts, state] = fold
                            (f)
                            ([ts, state])
                            (v instanceof Array ? entries(v) : Object.entries(v))
                    }
                    break
                }
            }
            return [ts, state]
        }
        return ([ts, state]) => {
            if (isTest(k)) {
                state = log(`testing ${k}`)(state);
                [ts, state] = test('| ')(v.default)([ts, state])
            }
            return [ts, state]
        }
    }
    let ts
        : TestState
        = { time: 0, pass: 0, fail: 0 };
    [ts, state] = fold(f)([ts, state])(Object.entries(moduleMap))
    const fgFail = ts.fail === 0 ? fgGreen : fgRed
    state = log(`${bold}Number of tests: pass: ${fgGreen}${ts.pass}${reset}${bold}, fail: ${fgFail}${ts.fail}${reset}${bold}, total: ${ts.pass + ts.fail}${reset}`)(state)
    state = log(`${bold}Time: ${timeFormat(ts.time)}${reset}`)(state);
    return [ts.fail !== 0 ? 1 : 0, state]
}

export const anyLog = (f: (s: string) => void) => (s: string) => <T>(state: T): T => {
    f(s)
    return state
}

export const measure = (p: Performance) => <R>(f: () => R) => <T>(state: T): readonly[R, number, T] => {
    const b = p.now()
    const r = f()
    const e = p.now()
    return [r, e - b, state]
}

export const main = async(io: Io): Promise<number> => test({
        moduleMap: await loadModuleMap(io),
        log: anyLog(io.console.log),
        error: anyLog(io.console.error),
        measure: measure(io.performance),
        tryCatch: io.tryCatch,
        env: env(io),
        state: void 0,
    })[0]
