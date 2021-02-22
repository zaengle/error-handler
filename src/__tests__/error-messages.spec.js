import ErrorMessages, { defaultErrorMessages, defaultGeneralErrorMessage } from '../ErrorMessages'

describe('ErrorMessages', () => {
  let errorMessages

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    errorMessages = new ErrorMessages()
  })

  it('can be initialized without custom error messages', () => {
    const errorMessages = new ErrorMessages()

    expect(errorMessages.errorMessages).toStrictEqual(defaultErrorMessages)

    expect(errorMessages.generalErrorMessage).toEqual(defaultGeneralErrorMessage)
  })

  it('can be initialized with custom error messages', () => {
    const customMessages = {
      404: `Whoops, couldn't find that!`,
      422: 'Uh oh, some fields are missing!',
    }
    const customGeneralMessage = 'Oh no! An error occurred.'
    const errorMessages = new ErrorMessages(customMessages, customGeneralMessage)

    expect(errorMessages.errorMessages).toStrictEqual(customMessages)

    expect(errorMessages.generalErrorMessage).toEqual(customGeneralMessage)
  })

  it('retrieves the error message for a status code -> status provided, status message exists', () => {
    const message = errorMessages.getErrorMessage(401)

    expect(message).toEqual(defaultErrorMessages[401])
  })

  it(`returns the general error message if the status message doesn't exist`, () => {
    const message = errorMessages.getErrorMessage(413)

    expect(message).toEqual(defaultGeneralErrorMessage)
  })

  it('returns the general error message if no status is passed', () => {
    const message = errorMessages.getErrorMessage()

    expect(message).toEqual(defaultGeneralErrorMessage)
  })
})
