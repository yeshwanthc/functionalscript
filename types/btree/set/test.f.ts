import * as _ from './module.f.ts'
import type { TNode } from '../types/module.f.ts'
import { cmp } from '../../string/module.f.ts'
import * as json from '../../../json/module.f.ts'
import { sort } from '../../object/module.f.ts'

const set = (node: TNode<string>) => (value: string): TNode<string> =>
    _.set(cmp(value))(() => value)(node)

const jsonStr = json.stringify(sort)

const test = [
    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 10; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !== '[[["1","100"],"16",["25","36"]],"4",[["49"],"64",["81","9"]]]') { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 11; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !== '[[["1"],"100",["121"],"16",["25","36"]],"4",[["49"],"64",["81","9"]]]') { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 12; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !== '[[["1"],"100",["121","144"],"16",["25","36"]],"4",[["49"],"64",["81","9"]]]') { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 13; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !== '[[["1"],"100",["121","144"]],"16",[["169"],"25",["36"]],"4",[["49"],"64",["81","9"]]]') { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 14; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !== '[[["1"],"100",["121","144"]],"16",[["169","196"],"25",["36"]],"4",[["49"],"64",["81","9"]]]') { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 15; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !== '[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"],"25",["36"]],"4",[["49"],"64",["81","9"]]]') { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 16; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !== '[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"],"25",["256","36"]],"4",[["49"],"64",["81","9"]]]') { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 17; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !== '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],"25",[[["256"],"289",["36"]],"4",[["49"],"64",["81","9"]]]]') { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 18; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],"25",[[["256"],"289",["324","36"]],"4",[["49"],"64",["81","9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 19; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],"25",[[["256"],"289",["324"],"36",["361"]],"4",[["49"],"64",["81","9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 20; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400","49"],"64",["81","9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 21; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["49"],"64",["81","9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 22; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484","49"],"64",["81","9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 23; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]],"49",[["529"],"64",["81","9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 24; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]],"49",[["529","576"],"64",["81","9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 25; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]],"49",[["529"],"576",["625"],"64",["81","9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 26; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"81",["9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 27; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676","729"],"81",["9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 28; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"],"81",["9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 29; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"],"81",["841","9"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 30; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"]],"81",[["841"],"9",["900"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 31; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["121","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"]],"81",[["841"],"9",["900","961"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 32; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["1024"],"121",["144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"]],"81",[["841"],"9",["900","961"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 33; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["1024","1089"],"121",["144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"]],"81",[["841"],"9",["900","961"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 34; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["1024"]],"1089",[["1156"],"121",["144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"]],"81",[["841"],"9",["900","961"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 35; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["1024"]],"1089",[["1156"],"121",["1225","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"]],"81",[["841"],"9",["900","961"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 36; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["1024"]],"1089",[["1156"],"121",["1225"],"1296",["144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"]],"81",[["841"],"9",["900","961"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 37; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[["1"],"100",["1024"]],"1089",[["1156"],"121",["1225"],"1296",["1369","144"]],"16",[["169"],"196",["225"]]],' +
            '"25",' +
            '[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"]],"81",[["841"],"9",["900","961"]]]]'
        ) { throw r }
    },

    () => {
        let _map: TNode<string> = ['1']
        for (let i = 2; i <= 38; i++)
            _map = set(_map)((i * i).toString())
        const r = jsonStr(_map)
        if (r !==
            '[[[[["1"],"100",["1024"]],"1089",[["1156"],"121",["1225"]]],' +
            '"1296",' +
            '[[["1369"],"144",["1444"]],"16",[["169"],"196",["225"]]]],' +
            '"25",' +
            '[[[["256"],"289",["324"],"36",["361"]],"4",[["400"],"441",["484"]]],' +
            '"49",' +
            '[[["529"],"576",["625"]],"64",[["676"],"729",["784"]],"81",[["841"],"9",["900","961"]]]]]'
        ) { throw r }
    }
]

export default test
