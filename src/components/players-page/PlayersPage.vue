<template>
  <div class="players-page">
    <div class="row expanded" >
      <ul class="menu">
        <li @click="change_type(1)" v-bind:class="{active : players_active}"><a>在线玩家列表</a></li>
        <li @click="change_type(2)" v-bind:class="{active : bans_active}"><a>封禁玩家列表</a></li>
        <li @click="change_type(3)" v-bind:class="{active : teleport }"><a>玩家传送</a></li>
      </ul>
    </div>
    <div class="expanded row">
      <div class="small-12 column">
        <table class="table" v-if="type==='players'">
          <thead>
          <tr>
            <th>玩家昵称</th>
            <th>Steam ID</th>
            <th>权限级别</th>
            <th>IP 地址</th>
            <th>在线时间</th>
            <th>健康值</th>
            <th>Ping</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="p in players">
            <td><router-link :to="{name: 'player', params: {id: p.SteamID}}" v-text="p.DisplayName"></router-link></td>
            <td><router-link :to="{name: 'player', params: {id: p.SteamID}}" v-text="p.SteamID"></router-link></td>
            <td v-text="p.VoiationLevel"></td>
            <td v-text="p.Address"></td>
            <td v-text="duration(p.Duration)"></td>
            <td v-text="p.Health"></td>
            <td v-text="p.Ping + ' ms'"></td>
            <td class="actions">
              <button class="button warning small" @click="beforeKick(p)"><i class="ion-alert"></i> 踢出</button>
              <button class="button alert small" @click="beforeBan(p)"><i class="ion-minus-circled"></i> 封禁</button>
            </td>
          </tr>
          </tbody>
        </table>
        <table class="table" v-if="type==='bans'">
          <thead>
          <tr>
            <th>玩家昵称</th>
            <th>Steam ID</th>
            <th>状态</th>
            <th>封禁理由</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="p in players">
            <td><router-link :to="{name: 'player', params: {id: p.steamid}}" v-text="p.username"></router-link></td>
            <td><router-link :to="{name: 'player', params: {id: p.steamid}}" v-text="p.steamid"></router-link></td>
            <td v-text="p.group"></td>
            <td v-text="p.notes"></td>
            <td class="actions">
              <button class="button success small" @click="beforeUnBan(p)"><i class="fa fa-check"></i> 解封</button>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-if="type==='teleport'" class="cell">
          <div class="grid-x grid-padding-x" style="margin-top: 10px">
            <div class="medium-2 cell">
              <label><span class="player-nickname">传送</span>
                <el-select v-model="tpu" filterable placeholder="请选择">
                  <el-option
                    v-for="item in players"
                    :key="item.SteamID"
                    :label="item.DisplayName"
                    :value="item.DisplayName">
                  </el-option>
                </el-select>
              </label>
            </div>
            <div class="medium-2 cell">
              <label><span class="player-nickname">到</span>
                <el-select v-model="tpu2" filterable placeholder="请选择">
                  <el-option
                    v-for="item in players"
                    :key="item.SteamID"
                    :label="item.DisplayName"
                    :value="item.DisplayName">
                  </el-option>
                </el-select>
              </label>
            </div>
            <div class="medium-2 cell">
              <label>
                <el-button type="success" @click="teleport_player()">传送</el-button>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
    <confirm-modal ref='confirm' v-if="kickConfirmationShown" show_reason="true" @confirm="kick" @cancel="kickConfirmationShown = false">
      <p class="text-center"><br><br>你确定要踢出玩家 {{player.DisplayName || $route.params.id}} ?</p>
    </confirm-modal>
    <confirm-modal ref='confirm' v-if="banConfirmationShown" show_reason="true" @confirm="ban" @cancel="banConfirmationShown = false">
      <p class="text-center"><br><br>你确定要封禁玩家 {{player.DisplayName || $route.params.id}} ?</p>
    </confirm-modal>
    <confirm-modal ref='confirm' v-if="unBanConfirmationShown" @confirm="unban" @cancel="unBanConfirmationShown = false">
      <p class="text-center"><br><br>你确定要解禁玩家 {{player.username || $route.params.id}} ?</p>
    </confirm-modal>
  </div>
</template>

<script type="text/babel">
  import PlayersService from '../../services/PlayersService.js'
  import Utils from '../../services/Utils'
  import ConfirmModal from '../confirm-modal/ConfirmModal.vue'
  import './players-page.scss'
  export default {
    data () {
      return {
        type: 'players',
        players_active: 'is_active',
        bans_active: null,
        players: [],
        players2: [],
        tpu: null,
        tpu2: null,
        teleport: '',
        player: null,
        kickConfirmationShown: false,
        banConfirmationShown: false,
        unBanConfirmationShown: false
      }
    },
    mounted () {
      this.update()
        .then(() => {
          this.interval = setInterval(this.update, 500)
        })
    },
    methods: {
      teleport_player () {
        if (!this.tpu || !this.tpu2) {
          this.$message.error('传送的玩家不可为空!')
          return false
        }
        return PlayersService.teleport(this.tpu, this.tpu2).then(res => {
          this.$message({
            message: '传送成功',
            type: 'success'
          })
          return false
        })
      },
      change_type (type) {
        this.players = []
        if (type === 1) {
          this.type = 'players'
          this.bans_active = null
          this.players_active = 'is_active'
          this.teleport = null
        }
        if (type === 2) {
          this.type = 'bans'
          this.players_active = null
          this.bans_active = 'is_active'
          this.teleport = null
        }
        if (type === 3) {
          this.type = 'teleport'
          this.players_active = null
          this.teleport = 'is_active'
          this.bans_active = null
        }
      },
      duration (time) {
        return Utils.formatDuration(time)
      },
      update () {
        if (this.type === 'players' || this.type === 'teleport') {
          return PlayersService.list()
            .then((res) => {
              this.players = res.map((p) => {
                p.Duration = p.ConnectedSeconds
                p.Health = Math.round(p.Health)
                return p
              })
            })
        }
        if (this.type === 'bans') {
          return PlayersService.bans().then(res => {
            this.players = res.map((p) => {
              return p
            })
          })
        }
      },
      beforeKick (p) {
        this.player = p
        this.kickConfirmationShown = true
      },
      beforeBan (p) {
        this.player = p
        this.banConfirmationShown = true
      },
      beforeUnBan (p) {
        this.player = p
        this.unBanConfirmationShown = true
      },
      kick () {
        const reason = this.$refs.confirm.reason
        PlayersService.kick(this.player.SteamID, reason)
          .then(() => {
            this.kickConfirmationShown = false
            this.player = null
          })
      },
      unban () {
        console.log(this.player.steamid)
        PlayersService.unban(this.player.steamid)
          .then(() => {
            this.unBanConfirmationShown = false
            this.player = null
          }).catch(err => {
            console.log(err)
          })
      },
      ban () {
        const reason = this.$refs.confirm.reason
        PlayersService.ban(this.player.SteamID, reason)
          .then(() => {
            this.banConfirmationShown = false
            this.player = null
          })
      }
    },
    beforeDestroy () {
      clearInterval(this.interval)
    },
    components: {
      ConfirmModal
    }
  }
</script>
