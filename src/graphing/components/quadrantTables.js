const d3 = require('d3')
const { uiConfig } = require('../config')
const { stickQuadrantOnScroll } = require('./quadrants')
const { removeAllSpaces } = require('../../util/stringUtil')

function fadeOutAllBlips() {
  d3.selectAll('g > a.blip-link').attr('opacity', 0.3)
}

function fadeInSelectedBlip(selectedBlipOnGraph) {
  selectedBlipOnGraph.attr('opacity', 1.0)
}

function highlightBlipInTable(selectedBlip) {
  selectedBlip.classed('highlight', true)
}

function highlightBlipInGraph(blipIdToFocus) {
  fadeOutAllBlips()
  const selectedBlipOnGraph = d3.select(`g > a.blip-link[data-blip-id='${blipIdToFocus}'`)
  fadeInSelectedBlip(selectedBlipOnGraph)
}

function resolveBlipContent(blip, fieldNames) {
  for (const fieldName of fieldNames) {
    const fieldValue = blip[fieldName]
    const value = typeof fieldValue === 'function' ? fieldValue.call(blip) : fieldValue

    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

function appendHtmlContent(container, html, doc = document) {
  const wrapper = doc.createElement('div')
  wrapper.innerHTML = html

  Array.from(wrapper.childNodes).forEach((node) => {
    container.appendChild(node)
  })
}

function createBlipDescriptionFragment(blip, doc = document) {
  const description = resolveBlipContent(blip, ['description'])
  const meaning = resolveBlipContent(blip, ['meaning', 'bedeutung', 'Bedeutung'])
  const fragment = doc.createDocumentFragment()
  
  if (description) {
        const descriptionCopy = doc.createElement('div')
    descriptionCopy.className = 'blip-list__item-container__description-copy'
    appendHtmlContent(descriptionCopy, description, doc)
    fragment.appendChild(descriptionCopy)
  }

  if (meaning) {
       const meaningSection = doc.createElement('section')
    meaningSection.className = 'blip-list__item-container__meaning'

    const meaningHeadline = doc.createElement('h3')
    meaningHeadline.textContent = 'Bedeutung für D+H'

    const meaningCopy = doc.createElement('div')
    meaningCopy.className = 'blip-list__item-container__meaning-copy'
    appendHtmlContent(meaningCopy, meaning, doc)

    meaningSection.appendChild(meaningHeadline)
    meaningSection.appendChild(meaningCopy)
    fragment.appendChild(meaningSection)
  }

  return fragment
}

function buildBlipDescriptionContent(blip, doc = document) {
  const container = doc.createElement('div')
  container.appendChild(createBlipDescriptionFragment(blip, doc))

  return container.innerHTML
}

function appendBlipDescriptionContent(blipDescriptionContainer, blip, doc = document) {
  const containerNode = blipDescriptionContainer.node()

  containerNode.replaceChildren(createBlipDescriptionFragment(blip, doc))
}

function renderBlipDescription(blip, ring, quadrant, tip, groupBlipTooltipText) {
  let blipTableItem = d3.select(`.quadrant-table.${quadrant.order} ul[data-ring-order='${ring.order()}']`)
  if (!groupBlipTooltipText) {
    blipTableItem = blipTableItem.append('li').classed('blip-list__item', true).attr('data-status', blip.status())
    const blipItemDiv = blipTableItem
      .append('div')
      .classed('blip-list__item-container', true)
      .attr('data-blip-id', blip.id())

    if (blip.groupIdInGraph()) {
      blipItemDiv.attr('data-group-id', blip.groupIdInGraph())
    }

    const blipItemContainer = blipItemDiv
      .append('button')
      .classed('blip-list__item-container__name', true)
      .attr('aria-expanded', 'false')
      .attr('aria-controls', `blip-description-${blip.id()}`)
      .attr('aria-hidden', 'true')
      .attr('tabindex', -1)
      .on('click search-result-click', function (e) {
        e.stopPropagation()

        const expandFlag = d3.select(e.target.parentElement).classed('expand')

        d3.selectAll('.blip-list__item-container.expand').classed('expand', false)
        d3.select(e.target.parentElement).classed('expand', !expandFlag)

        d3.selectAll('.blip-list__item-container__name').attr('aria-expanded', 'false')
        d3.select('.blip-list__item-container.expand .blip-list__item-container__name').attr('aria-expanded', 'true')

        if (window.innerWidth >= uiConfig.tabletViewWidth) {
          stickQuadrantOnScroll()
        }
      })

    blipItemContainer
      .append('span')
      .classed('blip-list__item-container__name-value', true)
      .text(`${blip.blipText()}. ${blip.name()}`)
    blipItemContainer.append('span').classed('blip-list__item-container__name-arrow', true)

    const blipDescriptionContainer = blipItemDiv
      .append('div')
      .classed('blip-list__item-container__description', true)
      .attr('id', `blip-description-${blip.id()}`)
    
    appendBlipDescriptionContent(blipDescriptionContainer, blip)
  }
  const blipGraphItem = d3.select(`g a#blip-link-${removeAllSpaces(blip.id())}`)
  const mouseOver = function (e) {
    const targetElement = e.target.classList.contains('blip-link') ? e.target : e.target.parentElement
    const isGroupIdInGraph = !targetElement.classList.contains('blip-link') ? true : false
    const blipWrapper = d3.select(targetElement)
    const blipIdToFocus = blip.groupIdInGraph() ? blipWrapper.attr('data-group-id') : blipWrapper.attr('data-blip-id')
    const selectedBlipOnGraph = d3.select(`g > a.blip-link[data-blip-id='${blipIdToFocus}'`)
    highlightBlipInGraph(blipIdToFocus)
    highlightBlipInTable(blipTableItem)

    const isQuadrantView = d3.select('svg#radar-plot').classed('quadrant-view')
    const displayToolTip = blip.isGroup() ? !isQuadrantView : !blip.groupIdInGraph()
    const toolTipText = blip.isGroup() ? groupBlipTooltipText : blip.name()

    if (displayToolTip && !isGroupIdInGraph) {
      tip.show(toolTipText, selectedBlipOnGraph.node())

      const selectedBlipCoords = selectedBlipOnGraph.node().getBoundingClientRect()

      const tipElement = d3.select('div.d3-tip')
      const tipElementCoords = tipElement.node().getBoundingClientRect()

      tipElement
        .style(
          'left',
          `${parseInt(
            selectedBlipCoords.left + window.scrollX - tipElementCoords.width / 2 + selectedBlipCoords.width / 2,
          )}px`,
        )
        .style('top', `${parseInt(selectedBlipCoords.top + window.scrollY - tipElementCoords.height)}px`)
    }
  }

  const mouseOut = function () {
    d3.selectAll('g > a.blip-link').attr('opacity', 1.0)
    blipTableItem.classed('highlight', false)
    tip.hide().style('left', 0).style('top', 0)
  }

  const blipClick = function (e) {
    const isQuadrantView = d3.select('svg#radar-plot').classed('quadrant-view')
    const targetElement = e.target.classList.contains('blip-link') ? e.target : e.target.parentElement
    if (isQuadrantView) {
      e.stopPropagation()
    }

    const blipId = d3.select(targetElement).attr('data-blip-id')
    highlightBlipInGraph(blipId)

    d3.selectAll('.blip-list__item-container.expand').classed('expand', false)
  
    let selectedBlipContainer = d3.select(`.blip-list__item-container[data-blip-id="${blipId}"`)
  
    selectedBlipContainer.classed('expand', true)

    setTimeout(
      () => {
        if (window.innerWidth >= uiConfig.tabletViewWidth) {
          stickQuadrantOnScroll()
        }

        const isGroupBlip = isNaN(parseInt(blipId))
        if (isGroupBlip) {
          selectedBlipContainer = d3.select(`.blip-list__item-container[data-group-id="${blipId}"`)
        }
        const elementToFocus = selectedBlipContainer.select('button.blip-list__item-container__name')
        elementToFocus.node()?.scrollIntoView({
          behavior: 'smooth',
        })
      },
      isQuadrantView ? 0 : 1500,
    )
  }

  !groupBlipTooltipText &&
    blipTableItem.on('mouseover', mouseOver).on('mouseout', mouseOut).on('focusin', mouseOver).on('focusout', mouseOut)
  blipGraphItem
    .on('mouseover', mouseOver)
    .on('mouseout', mouseOut)
    .on('focusin', mouseOver)
    .on('focusout', mouseOut)
    .on('click', blipClick)
}

function renderQuadrantTables(quadrants, rings) {
  const radarContainer = d3.select('#radar')
 
  const quadrantTablesContainer = radarContainer.append('div').classed('quadrant-table__container', true)
  quadrants.forEach(function (quadrant) {
        const quadrantContainer = quadrantTablesContainer
      .append('div')
      .classed('quadrant-table', true)
      .classed(quadrant.order, true)

    const ringNames = Array.from(
      new Set(
        quadrant.quadrant
          .blips()
          .map((blip) => blip.ring())
          .sort((firstRing, secondRing) => firstRing.order() - secondRing.order())
          .map((ring) => ring.name()),
      ),
    )
    ringNames.forEach(function (ringName) {
      quadrantContainer
        .append('h2')
        .classed('quadrant-table__ring-name', true)
        .attr('data-ring-name', ringName)
        .text(ringName)
      quadrantContainer
        .append('ul')
        .classed('blip-list', true)
        .attr('data-ring-order', rings.filter((ring) => ring.name() === ringName)[0].order())
    })
  })
}

module.exports = {
  renderQuadrantTables,
  renderBlipDescription,
  appendBlipDescriptionContent,
  buildBlipDescriptionContent,
  createBlipDescriptionFragment,
}
