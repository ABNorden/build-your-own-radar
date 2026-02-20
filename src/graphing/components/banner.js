const d3 = require('d3')

const config = require('../../config')
const { addPdfCoverTitle } = require('../pdfPage')
const featureToggles = config().featureToggles

function renderBanner(renderFullRadar) {
  if (featureToggles.UIRefresh2022) {
    const documentTitle = document.title[0].toUpperCase() + document.title.slice(1)

    document.title = documentTitle
   // d3.select('.hero-banner__wrapper').append('p').classed('hero-banner__subtitle-text', true).text(document.title)
    d3.select('.hero-banner__title-text').on('click', renderFullRadar)

        const heroBannerWrapper = d3.select('.hero-banner__wrapper')
    if (heroBannerWrapper.select('.hero-banner__logo').empty()) {
      heroBannerWrapper
        .append('a')
        .attr('class', 'hero-banner__logo')
        .attr('href', 'https://www.thoughtworks.com')
        .html('<img src="/images/logo.png" alt="Thoughtworks logo" />')
    }

    const updateLogoScale = () => {
      const zoomScale = window.visualViewport?.scale || window.devicePixelRatio || 1
      const inverseScale = 1 / zoomScale

      d3.select('.hero-banner__logo img').style('--logo-inverse-zoom-scale', inverseScale)
    }

    updateLogoScale()
    window.addEventListener('resize', updateLogoScale)
    window.visualViewport?.addEventListener('resize', updateLogoScale)

    addPdfCoverTitle(documentTitle)
  } else {
    const header = d3.select('body').insert('header', '#radar')
    header
      .append('div')
      .attr('class', 'radar-title')
      .append('div')
      .attr('class', 'radar-title__text')
      .append('h1')
      .text(document.title)
      .style('cursor', 'pointer')
      .on('click', renderFullRadar)

    header
      .select('.radar-title')
      .append('div')
      .attr('class', 'radar-title__logo')
      .html('<a href="https://www.thoughtworks.com"> <img src="/images/logo.png" /> </a>')
  }
}

module.exports = {
  renderBanner,
}
