import RconService from './RconService'

/**
 * OxideService
 */
class OxideService {
  load (name) {
    return RconService.request(`oxide.load ${name}`).then(res => {
      return res.message
    })
  }

  unload (name) {
    return RconService.request(`oxide.unload ${name}`).then(res => {
      return res.message
    })
  }

  reload (name) {
    return RconService.request(`oxide.reload ${name}`).then(res => {
      return res.message
    })
  }
}

export default new OxideService()
