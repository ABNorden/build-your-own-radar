const quadrantSize = 512
const quadrantGap = 32

const getQuadrants = () => {
  return JSON.parse(process.env.QUADRANTS || null) || ['Branche', 'Produktion', 'Technologie', 'Mitarbeitende']
}

const getRings = () => {
  return JSON.parse(process.env.RINGS || null) || ['0-5 Jahre', '5-10 Jahre', '10-15 Jahre']
}

const isBetween = (number, startNumber, endNumber) => {
  return startNumber <= number && number <= endNumber
}
const isValidConfig = () => {
  return getQuadrants().length === 4 && isBetween(getRings().length, 1, 4)
}

const graphConfig = {
  effectiveQuadrantHeight: quadrantSize + quadrantGap / 2,
  effectiveQuadrantWidth: quadrantSize + quadrantGap / 2,
  quadrantHeight: quadrantSize,
  quadrantWidth: quadrantSize,
  quadrantsGap: quadrantGap,
  minBlipWidth: 12,
  blipWidth: 22,
  groupBlipHeight: 24,
  newGroupBlipWidth: 88,
  existingGroupBlipWidth: 124,
  rings: getRings(),
  quadrants: getQuadrants(),
  groupBlipAngles: [30, 35, 60, 80],
  maxBlipsInRings: [13, 22, 17, 18],
}

const uiConfig = {
  subnavHeight: 60,
  bannerHeight: 200,
  tabletBannerHeight: 300,
  headerHeight: 80,
  legendsHeight: 42,  
  forceDesktopView: true,
  fixedInnerWidth: 453,
  tabletViewWidth: 1280,
  mobileViewWidth: 768,
}

function getInnerWidth() {
  return uiConfig.forceFixedInnerWidth ? uiConfig.fixedInnerWidth : window.innerWidth
}

function isTabletView() {
  return getInnerWidth() < uiConfig.tabletViewWidth
}

function isDesktopView() {
  return !isTabletView()
}
function getScale() {
  return getInnerWidth() < 1800 ? 1.25 : 1.5
}

function getGraphSize() {
  return graphConfig.effectiveQuadrantHeight + graphConfig.effectiveQuadrantWidth
}

function getScaledQuadrantWidth(scale) {
  return graphConfig.quadrantWidth * scale
}

function getScaledQuadrantHeightWithGap(scale) {
  return (graphConfig.quadrantHeight + graphConfig.quadrantsGap) * scale
}

module.exports = {
  graphConfig,
  uiConfig,
  getScale,
  getGraphSize,
  getScaledQuadrantWidth,
  getScaledQuadrantHeightWithGap,
  getInnerWidth,
  isTabletView,
  isDesktopView,
  isValidConfig,
}
