import Errors from '../index'

describe('Index', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('exports the Errors class', () => {
    expect(new Errors()).toBeInstanceOf(Errors)
  })
})
