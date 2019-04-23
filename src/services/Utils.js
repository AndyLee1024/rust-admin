class Utils {
  /**
   * Format seconds to human readable duration
   * @param input seconds
   * @returns {string} Formated duration
   */
  formatDuration (input) {
    let hours = Math.floor(input / 3600)
    let minutes = Math.floor((input - (hours * 3600)) / 60)
    let seconds = input - (hours * 3600) - (minutes * 60)

    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    return hours + ':' + minutes + ':' + seconds
  }

  isURL (str) {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
    return pattern.test(str)
  }
}

export default new Utils()
