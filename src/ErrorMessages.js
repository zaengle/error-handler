export const defaultErrorMessages = {
  401: `Not Authenticated: Sorry, you have to be logged in to access this!`,
  403: `Not Authorized: Sorry, you can't access this!`,
  404: `Not Found: We couldn't find what you're looking for. Please refresh and try again, or contact the support team.`,
  422: 'Validation Error',
  500: 'Server Error: Please contact the support team.',
}

export const defaultGeneralErrorMessage = 'Error: Please refresh and try again, or contact the support team.'

export default class ErrorMessages {
  constructor(errorMessages, generalErrorMessage) {
    this.errorMessages = errorMessages || defaultErrorMessages
    this.generalErrorMessage = generalErrorMessage || defaultGeneralErrorMessage
  }

  /**
   * Retrieve the error message for a particular status code.
   *
   * @param {number} errorStatus
   * @return {string} errorMessage
   */
  getErrorMessage(errorStatus) {
    if (errorStatus && this.errorMessages[errorStatus]) {
      return this.errorMessages[errorStatus]
    }

    return this.generalErrorMessage
  }
}
