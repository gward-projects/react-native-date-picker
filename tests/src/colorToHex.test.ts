import assert from 'node:assert/strict'
import {describe, it} from 'node:test'

import {colorToHex} from '../../src/colorToHex'

describe('colorToHex', () => {
    it('should not change 6 digit hex string ', () => {
        assert.equal(colorToHex('#ff00ff'), '#ff00ff')
    })

    it('should extend 3 digit hex string to 6 digit ', () => {
        assert.equal(colorToHex('#f0f'), '#ff00ff')
    })

    it('should transform rgb string to hex', () => {
        assert.equal(colorToHex('rgb(255,0,255)'), '#ff00ff')
    })

    it('should transform rgba string to hex and ignore alpha part', () => {
        assert.equal(colorToHex('rgba(255,0,255,0.5)'), '#ff00ff')
    })

    it('should handle rgba string with spaces within', () => {
        assert.equal(colorToHex('rgba(255,0 , 255 ,0.5)'), '#ff00ff')
    })

    it('should support color names', () => {
        assert.equal(colorToHex('green'), '#008000')
    })

    it('should throw when empty color', () => {
        assert.throws(() => colorToHex(''), Error)
    })

    it('should throw when invalid color', () => {
        assert.throws(() => colorToHex('#xxx'), Error)
    })

    it('should throw when null', () => {
        // @ts-expect-error
        assert.throws(() => colorToHex(null), Error)
    })

    it('return undefined when undefined', () => {
        assert.equal(colorToHex(undefined), undefined)
    })

    it('should transform hsl to hex', () => {
        assert.equal(colorToHex('hsl(0, 0%, 0%)'), '#000000')
        assert.equal(colorToHex('hsl(0, 0%, 100%)'), '#ffffff')
        assert.equal(colorToHex('hsl(0, 0%, 50%)'), '#808080')
        assert.equal(colorToHex('hsl(34, 87%, 50%)'), '#ee8e11')
        assert.equal(colorToHex('hsl(137, 83%, 71%)'), '#78f29a')
        assert.equal(colorToHex('hsl(360 100% 100%)'), '#ffffff')
        assert.equal(colorToHex('hsla(137, 83%, 71%, 0.5)'), '#78f29a')
        assert.equal(colorToHex('hsla(360 100% 100% / 1.0)'), '#ffffff')
    })
})
