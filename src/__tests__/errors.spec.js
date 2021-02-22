import Errors from '../Errors'
import { defaultErrorMessages } from '../ErrorMessages'

describe('Errors', () => {
  let errors, data

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    errors = new Errors()

    data = {
      errors: {
        email: ['The email field is required.'],
      },
    }
  })

  it('can be initialized without custom error messages', () => {
    const errors = new Errors()

    expect(errors.errors).toStrictEqual({})

    expect(errors.errorMessages.errorMessages).toStrictEqual(defaultErrorMessages)

    expect(errors.errorMessages.generalErrorMessage).toEqual(
      'Error: Please refresh and try again, or contact the support team.',
    )
  })

  it('can be initialized with custom error messages', () => {
    const customMessages = {
      404: `Whoops, couldn't find that!`,
      422: 'Uh oh, some fields are missing!',
    }
    const customGeneralMessage = 'Oh no! An error occurred.'
    const errors = new Errors(customMessages, customGeneralMessage)

    expect(errors.errors).toStrictEqual({})

    expect(errors.errorMessages.errorMessages).toStrictEqual(customMessages)

    expect(errors.errorMessages.generalErrorMessage).toEqual(customGeneralMessage)
  })

  it('sets all errors', () => {
    errors.setAll(data)

    expect(errors.errors).toStrictEqual(data)
  })

  it('sets validation errors', () => {
    errors.setValidation(data)

    expect(errors.errors).toStrictEqual(data.errors)
  })

  it('parses errors -> status !== 422', () => {
    const error = {
      response: {
        status: 401,
      },
    }

    errors.setAll(error)

    const errorResponse = errors.parse()

    expect(errors.errors).toStrictEqual(error)

    expect(errorResponse).toStrictEqual({
      status: 401,
      message: defaultErrorMessages[401],
    })
  })

  it('parses errors -> status === 422', () => {
    errors.setAll({
      response: {
        status: 422,
        data: {
          errors: {
            email: ['Email is required.'],
          },
        },
      },
    })

    const errorResponse = errors.parse()

    expect(errors.errors).toStrictEqual({
      email: ['Email is required.'],
    })

    expect(errorResponse).toStrictEqual({
      status: 422,
      message: defaultErrorMessages[422],
    })
  })

  it('parses errors -> status === 500', () => {
    errors.setAll({
      status: 500,
    })

    const errorResponse = errors.parse()

    expect(errorResponse).toStrictEqual({
      status: 500,
      message: defaultErrorMessages[500],
    })
  })

  it('adds errors to the existing errors', () => {
    errors.setAll(data)

    const newError = {
      name: ['The name field is required.'],
    }

    errors.add(newError)

    expect(errors.errors).toStrictEqual({
      ...data,
      ...newError,
    })
  })

  it('checks if there are any errors', () => {
    expect(errors.any()).toBe(false)

    errors.setValidation(data)

    expect(errors.any()).toBe(true)
  })

  it('checks if validation errors exist for a given field', () => {
    errors.setValidation(data)

    expect(errors.has('email')).toBe(true)
  })

  it('gets the error messages for a given field', () => {
    errors.setValidation(data)

    expect(errors.get('email')).toStrictEqual(['The email field is required.'])
  })

  it(`returns all errors if the 'get' method isn't provided a field`, () => {
    errors.setValidation(data)

    expect(errors.get()).toStrictEqual(data.errors)
  })

  it('gets the first validation error message for the given field', () => {
    errors.setValidation(data)

    expect(errors.getFirst('email')).toEqual('The email field is required.')
  })

  it(`gets all errors for the field if its errors aren't an array`, () => {
    const error = {
      name: 'Please provide a name.',
    }

    errors.setAll(error)

    expect(errors.getFirst('name')).toStrictEqual('Please provide a name.')
  })

  it(`returns null if 'getFirst' is not provided a field`, () => {
    errors.setValidation(data)

    expect(errors.getFirst()).toBeNull()
  })

  it('clears all errors', () => {
    const validationErrors = {
      errors: {
        one: 'thing',
        two: 'things',
      },
    }

    errors.setValidation(validationErrors)

    expect(errors.errors).toStrictEqual(validationErrors.errors)

    errors.clear()

    expect(errors.errors).toStrictEqual({})
  })

  it('clears an error for a specific field', () => {
    const validationErrors = {
      errors: {
        one: 'thing',
        two: 'things',
      },
    }

    errors.setValidation(validationErrors)

    expect(errors.errors).toStrictEqual(validationErrors.errors)

    errors.clear('two')

    expect(errors.errors).toStrictEqual({
      one: 'thing',
    })
  })
})
