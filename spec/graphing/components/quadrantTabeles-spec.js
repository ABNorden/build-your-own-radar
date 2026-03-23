jest.mock('d3', () => ({}))

const {
  appendBlipDescriptionContent,
  buildBlipDescriptionContent,
} = require('../../../src/graphing/components/quadrantTables')

describe('quadrantTables', function () {
  it('returns the description unchanged when no Bedeutung is present', function () {
    const blip = {
      description: () => '<p>Abstract</p>',
      meaning: () => '',
    }

    expect(buildBlipDescriptionContent(blip)).toEqual(
      '<div class="blip-list__item-container__description-copy"><p>Abstract</p></div>',
    )
  })

  it('appends the Bedeutung section after the abstract when present', function () {
    const blip = {
      description: () => '<p>Abstract</p>',
      meaning: () => '<p>Important</p>',
    }

    expect(buildBlipDescriptionContent(blip)).toEqual(
      '<div class="blip-list__item-container__description-copy"><p>Abstract</p></div><section class="blip-list__item-container__meaning"><><div><p>Important</p></div></section>',
    )
  })
   
  it('renders the Bedeutung content from CSV-shaped data objects', function () {
    const blip = {
      description: '<p>Abstract</p>',
      bedeutung: '<p>Important from CSV</p>',
    }

    expect(buildBlipDescriptionContent(blip)).toEqual(
      '<div class="blip-list__item-container__description-copy"><p>Abstract</p></div><section class="blip-list__item-container__meaning"><><div><p>Important from CSV</p></div></section>',
    )
  })
  it('renders the Bedeutung section as a sibling even when description markup is not explicitly closed', function () {
    document.body.innerHTML = '<div id="description-container"></div>'

    const blip = {
      description: () => '<p>Abstract',
      meaning: () => '<p>Important</p>',
    }

    const container = {
      node: () => document.getElementById('description-container'),
    }

    appendBlipDescriptionContent(container, blip)

    expect(document.querySelector('.blip-list__item-container__description-copy')?.innerHTML).toBe('<p>Abstract</p>')
    expect(document.querySelector('.blip-list__item-container__meaning div')?.innerHTML).toBe('<p>Important</p>')
  })
})
