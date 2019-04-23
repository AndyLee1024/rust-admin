import EventHub from './EventHub'
import RconService from './RconService'
/**
 * Server info service.
 * Provide server info and throw an event regulary with the infos
 * @event serverinfo Server info data
 */

const EVENT_NAME = 'server-info'
const INTERVAL = 500
class ServerInfosService {
  constructor () {
    setInterval(() => {
      this.infos()
        .then((res) => {
          EventHub.$emit(EVENT_NAME, res)
        })
    }, INTERVAL)
  }

  /**
   * Get the server info
   * @returns {Promise.<TResult>}
   */
  infos () {
    if (!RconService.isConnected()) {
      return Promise.resolve({})
    }
    return RconService.request('serverinfo')
      .then((res) => {
        return res.Message
      })
  }
  descr () {
    if (!RconService.isConnected()) {
      return Promise.resolve({})
    }
    return RconService.request('server.description')
      .then((res) => {
        const raw = res.Message
        return raw.match(/server.description: "(.+?)"$/)[1]
      })
  }
  url () {
    if (!RconService.isConnected()) {
      return Promise.resolve({})
    }
    return RconService.request('server.url')
      .then((res) => {
        const raw = res.Message
        return raw.match(/server.url: "(.+?)"$/)[1]
      })
  }
  headimage () {
    if (!RconService.isConnected()) {
      return Promise.resolve({})
    }
    return RconService.request('server.headerimage')
      .then((res) => {
        const raw = res.Message
        return raw.match(/server.headerimage: "(.+?)"$/)[1]
      })
  }
  /**
   * Helper to register an event listener
   * @param fn
   */
  on (fn) {
    EventHub.$on(EVENT_NAME, fn)
  }

  /**
   * Helper to unregister an event listener
   * @param fn
   */
  off (fn) {
    EventHub.$off(EVENT_NAME, fn)
  }
}

export default new ServerInfosService()
