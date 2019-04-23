<template>
  <div class="player-info">
    <div v-if="player || true">
      <div class="grid-x">
        <div class="small-12" v-if="!isConnected">
          <p>当前用户未连接</p>
        </div>
        <div v-if="isConnected" class="cell username large-8 large-offset-2">
          <h3>{{player.DisplayName}}</h3>
          <div class="steam-btns">
            <a class="button steam" target="_blank" :href="'http://www.steamcommunity.com/profiles/' + player.SteamID"><i class="ion-steam"></i><span>玩家Steam信息</span></a>
            <a v-if="player.OwnerSteamID !== '0'" class="button steam" target="_blank" :href="'http://www.steamcommunity.com/profiles/' + player.OwnerSteamID"><i class="ion-steam"></i><span>所有者</span></a>
          </div>
        </div>
      </div>
      <div class="tiles grid-x">
        <div class="cell small-6 large-3 large-offset-2">
          <stats-tile v-if="isConnected" class="aqua" name="违规等级" :value="player.VoiationLevel" icon="ion-alert-circled"></stats-tile>
        </div>
        <div class="cell small-6 large-3">
          <stats-tile v-if="isConnected" class="green" name="IP 地址" :value="ip(player.Address)" icon="ion-wifi"></stats-tile>
        </div>
        <div class="cell small-6 large-3">
          <stats-tile v-if="isConnected" class="red" name="在线时间" :value="duration(player.ConnectedSeconds)" icon="ion-clock"></stats-tile>
        </div>
        <div class="cell small-6 large-3 large-offset-2">
          <stats-tile v-if="isConnected" class="orange" name="健康值" :value="player.Health" icon="ion-heart"></stats-tile>
        </div>
        <div class="cell small-6 large-3">
          <stats-tile v-if="isConnected" class="aqua" name="Ping" :value="player.Ping" icon="ion-connection-bars"></stats-tile>
        </div>
        <div class="cell small-6 large-3">
          <stats-tile v-if="isConnected" class="green" name="等级" :value="player.CurrentLevel" icon="ion-arrow-up-a"></stats-tile>
        </div>
        <div class="cell small-6 large-3 large-offset-2">
          <stats-tile v-if="isConnected" class="red" name="经验" :value="player.UnspentXp" icon="ion-plus-round"></stats-tile>
        </div>
      </div>

      <div class="actions">
        <div class="grid-x">
          <div class="cell large-8 large-offset-2">
            <h4>操作</h4>
            <button class="button warning" @click="beforeKick"><i class="ion-alert"></i> 踢出</button>
            <button class="button alert" @click="beforeBan"><i class="ion-minus-circled"></i> 封禁</button>
          </div>
        </div>
      </div>
      <div class="logs">
        <div class="grid-x">
          <div class="cell small-12 large-8 large-offset-2">
            <h4>相关记录</h4>
            <console :logs="logs" :read-only="true"></console>
          </div>
        </div>
      </div>
    </div>
    <confirm-modal v-if="kickConfirmationShown" @confirm="kick" @cancel="kickConfirmationShown = false">
      <p class="text-center"><br><br>你确定要踢出玩家 {{player.DisplayName || $route.params.id}} ?</p>
    </confirm-modal>
    <confirm-modal v-if="banConfirmationShown" @confirm="ban" @cancel="banConfirmationShown = false">
      <p class="text-center"><br><br>你确定要封禁玩家 {{player.DisplayName || $route.params.id}} ?</p>
    </confirm-modal>
  </div>
</template>

<script type="text/babel">
  import ConfirmModal from '../confirm-modal/ConfirmModal.vue'
  import PlayersService from '../../services/PlayersService'
  import StatsTile from '../stats-tile/StatsTile.vue'
  import Console from '../console/Console.vue'
  import ConsoleService from '../../services/ConsoleService'
  import Utils from '../../services/Utils'
  import './player-page.scss'
  export default {
    data () {
      return {
        player: {
          SteamID: null,
          VoiationLevel: null,
          Address: null,
          ConnectedSeconds: null,
          Health: null,
          Ping: null
        },
        logs: [],
        error: null,
        kickConfirmationShown: false,
        banConfirmationShown: false,
        isConnected: false
      }
    },
    mounted () {
      console.log('route', this.$route.params.id)
      PlayersService.get(this.$route.params.id)
        .then(p => {
          console.log('player', p)
          this.player = p
          this.isConnected = true
        })
        .catch(err => {
          this.isConnected = false
          console.error(err)
          this.error = err.message
        })
      ConsoleService.filterBySteamID(this.$route.params.id)
        .then(res => {
          this.logs = res
        })
    },
    methods: {
      beforeKick () {
        this.kickConfirmationShown = true
      },
      beforeBan () {
        this.banConfirmationShown = true
      },
      kick () {
        PlayersService.kick(this.$route.params.id)
          .then(() => {
            this.kickConfirmationShown = false
          })
      },
      ban () {
        PlayersService.ban(this.$route.params.id)
          .then(() => {
            this.banConfirmationShown = false
          })
      },
      duration (time) {
        return Utils.formatDuration(time)
      },
      ip (addr) {
        return addr.split(':')[0]
      }
    },
    components: {
      StatsTile,
      Console,
      ConfirmModal
    }
  }
</script>
