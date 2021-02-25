import ErrorMessages from './ErrorMessages'

export default class Errors {
  constructor(customMessages = null, customDefaultMessage = '') {
    this.errors = {}
    this.errorMessages = new ErrorMessages(customMessages, customDefaultMessage)
  }

  /**
   * Set all errors, regardless of type.
   *
   * @param {*} errors
   * @return {self}
   */
  setAll(errors) {
    this.errors = errors

    return this
  }

  /**
   * Set validation errors.
   *
   * @param {object} errors
   * @return void
   */
  setValidation({ errors }) {
    this.errors = errors
  }

  /**
   * Parse errors and return a payload based on error status.
   *
   * @return {object} errorResponse
   */
  parse() {
    const status = this.errors.response ? this.errors.response.status : this.errors.status
    const errors = this.errors.response ? this.errors.response.data : this.errors.data

    if (status === 422) {
      this.setValidation(errors)
    }

    return {
      status,
      message: this.errorMessages.getErrorMessage(status),
    }
  }

  /**
   * Set all errors and parse them to get an error message.
   *
   * @param {*} errors
   * @return {object} errorResponse
   */
  setAndParse(errors) {
    this.errors = errors

    return this.parse()
  }

  /**
   * Add errors to the existing errors.
   *
   * @param {object} errors
   * @return void
   */
  add(errors) {
    this.errors = Object.assign({}, this.errors, errors)
  }

  /**
   * Determine if there are any errors.
   *
   * @return {boolean}
   */
  any() {
    return Object.keys(this.errors).length > 0
  }

  /**
   * Determine if validation errors exist for a given field.
   *
   * @param {string} field
   * @return {boolean}
   */
  has(field) {
    return Object.prototype.hasOwnProperty.call(this.errors, field)
  }

  /**
   * Get the validation errors for the given field.
   *
   * @param {string | null} field
   * @return {string[] | object}
   */
  get(field = null) {
    if (field && this.has(field)) {
      return this.errors[field]
    }

    return this.errors
  }

  /**
   * Get the first validation error message for the given field.
   *
   * @param {string | null} field
   * @return {string | string[] | null}
   */
  getFirst(field = null) {
    if (field) {
      if (Array.isArray(this.errors[field])) {
        return this.errors[field][0]
      } else {
        return this.errors[field]
      }
    }

    return null
  }

  /**
   * Clear one or all error fields.
   *
   * @param {string | null} field
   * @return void
   */
  clear(field = null) {
    if (field) {
      delete this.errors[field]

      return
    }

    this.errors = {}
  }
}
