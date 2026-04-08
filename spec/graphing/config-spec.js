const {
  getScale,
  getGraphSize,
  getScaledQuadrantWidth,
  getScaledQuadrantHeightWithGap,
  uiConfig,
  isValidConfig,
} = require('../../src/graphing/config')
describe('Graphing Config', () => {
  afterEach(() => {
    uiConfig.forceFixedInnerWidth = true
    uiConfig.fixedInnerWidth = 453
  })

  it('should get the scale size for different window size', () => {
    uiConfig.forceFixedInnerWidth = false
    window.innerWidth = 1440
    expect(getScale()).toStrictEqual(1.25)

    window.innerWidth = 1880
    expect(getScale()).toStrictEqual(1.5)
  })

  it('should get the graph size', () => {
    expect(getGraphSize()).toStrictEqual(1056)
  })

  it('should get the scaled quadrant width', () => {
    expect(getScaledQuadrantWidth(1.25)).toStrictEqual(640)
  })

  it('should get the scaled quadrant height with gap', () => {
    expect(getScaledQuadrantHeightWithGap(1.25)).toStrictEqual(680)
  })

  it('should validate the configs for quadrants and rings', () => {
    const oldEnv = process.env
    expect(isValidConfig()).toBeTruthy()

    process.env.QUADRANTS = '["radar"]'
    expect(isValidConfig()).toBeFalsy()

    process.env.QUADRANTS = '["radar", "r", "ra", "rad", "rada"]'
    expect(isValidConfig()).toBeFalsy()

    process.env.RINGS = '[]'
    expect(isValidConfig()).toBeFalsy()

    process.env.RINGS = '["radar", "r", "ra", "rad", "rada"]'
    expect(isValidConfig()).toBeFalsy()

    process.env = oldEnv
  })
})
