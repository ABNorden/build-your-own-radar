jest.mock('d3', () => ({}))

const { buildBlipDescriptionContent } = require('../../../src/graphing/components/quadrantTables')

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
      '<div class="blip-list__item-container__description-copy"><p>Abstract</p></div><section class="blip-list__item-container__meaning"><h3>Bedeutung für D+H</h3><div><p>Important</p></div></section>',
    )
  })
})
