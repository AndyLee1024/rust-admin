import RconService from './RconService'

/**
 * Players service
 */
class PlayersService {
  /**
   * List the connected players
   * @returns {Promise.<TResult>}
   */
  list () {
    return RconService.request('playerlist')
      .then((res) => {
        return res.Message
      })
  }

  addAdmin (steamid, type, name = '', reason = '') {
    return Promise.all([
      RconService.request(`${type}id ${steamid} ${name} ${reason}`),
      RconService.request('writecfg')
    ])
  }

  removeAdmin (steamid, type) {
    return Promise.all([
      RconService.request(`remove${type} ${steamid}`),
      RconService.request('writecfg')
    ])
  }

  listWithPosition () {
    return Promise.all([
      this.list(),
      this.inGame()
    ])
  }

  /**
   * Get a player form its SteamId
   * @param id SteamID
   */
  get (id) {
    return this.list()
      .then(res => {
        console.log('res ', res)
        let player = res.find(p => p.SteamID === id)
        if (!player) {
          throw new Error('Player is not connected')
        }
        return player
      })
  }

  /**
   * Kick a player
   * @param id SteamID
   * @param reason a reason
   * @returns {Promise.<TResult>}
   */
  kick (id, reason) {
    reason = reason || ''
    return RconService.request(`global.kick "${id}" "${reason}"`)
      .then(res => {
        return res.Message
      })
  }

  /**
   * Ban a player
   * @param id SteamID
   * @param reason a reason
   * @returns {Promise.<TResult>}
   */
  ban (id, reason) {
    reason = reason || ''
    return RconService.request(`global.ban "${id}" "${reason}"`)
      .then(res => {
        return res.Message
      })
  }

  /**
   * Get all baned user
   * @returns {Promise<any>}
   */
  bans () {
    return RconService.request('global.bans').then(res => {
      return res.Message
    })
  }
  teleport (p1, p2) {
    return RconService.request(`teleport ${p1} ${p2}`).then(res => {
      return res.Message
    })
  }
  /**
   * Give item to player
   * @param steamId
   * @param shortName
   * @param amount
   * @param type
   * @returns {Promise<any>}
   */
  giveItem (steamId = '', shortName, amount = 1, type) {
    let command
    if (type === 'player') {
      command = `inventory.giveto ${steamId} ${shortName} ${amount}`
    } else {
      command = `inventory.giveall ${shortName} ${amount}`
    }
    return RconService.request(command).then(res => {
      return res.Message
    })
  }

  unban (id) {
    return RconService.request(`global.unban ${id}`).then(res => {
      return res.Message
    })
  }

  inGame () {
    return RconService.request('players')
      .then(res => {
        return res.Message
          .split('\n')
          .slice(1)
      })
      .then(res => {
        return res
      })
  }
}

export default new PlayersService()
