<template>
  <div class="grid-container">

  <div class="server-info">
    <div class="tiles grid-x">
      <div class="cell small-6 large-3">
        <stats-tile class="aqua" name="玩家数" :value="players" icon="ion-person-stalker"></stats-tile>
      </div>
      <div class="cell small-6 large-3">
        <stats-tile class="green" name="加入中" :value="joining" icon="ion-person-stalker"></stats-tile>
      </div>
      <div class="cell small-6 large-3">
        <stats-tile class="orange" name="排队中" :value="queued" icon="ion-person-stalker"></stats-tile>
      </div>
      <div class="cell small-6 large-3">
        <stats-tile class="red" name="物资数量" :value="entityCount" icon="ion-trash-b"></stats-tile>
      </div>
      <div class="cell small-6 large-3 ">
        <stats-tile class="aqua" name="游戏内时间" :value="gameTime" icon="ion-clock"></stats-tile>
      </div>
      <div class="cell small-6 large-3">
        <stats-tile class="green" name="地图" :value="map" icon="ion-map"></stats-tile>
      </div>
      <div class="cell small-6 large-3">
        <stats-tile class="orange" name="FPS值" :value="framerate" icon="ion-arrow-graph-up-right"></stats-tile>
      </div>
      <div class="cell small-6 large-3">
        <stats-tile class="red" name="开机时间" :value="upTime" icon="ion-clock"></stats-tile>
      </div>
      <div class="cell small-6 large-3">
        <stats-tile class="aqua" name="内存占用" :value="memory" icon="ion-arrow-graph-up-right"></stats-tile>
      </div>
    </div>
  </div>
    <div class="tiles grid-x">
      <div class="cell">
        <ve-line :data="chartData"></ve-line>
      </div>
    </div>
    </div>
</template>

<script type="text/babel">
  import ServerInfosService from '../../services/ServerInfosService'
  import StatsTile from '../stats-tile/StatsTile.vue'
  import moment from 'moment'
  import Utils from '../../services/Utils'
  import './server-info.scss'

  export default {
    data () {
      return {
        chartData: {
          columns: ['sort', '流入', '流出'],
          rows: []
        },
        players: '',
        queued: '',
        joining: null,
        entityCount: null,
        gameTime: null,
        upTime: null,
        map: null,
        framerate: null,
        memory: null,
        hostname: '',
        sort: 0
      }
    },
    mounted () {
      this.$notify({
        title: '赞助商广告',
        message: '<a href="https://v2pg.taobao.com" target="_blank">Rust服务器出租 <br/>' +
          '不限人数/低延迟/低价格 <br/>' +
        '插件管理/控制面板 <br/>' +
        'https://v2pg.taobao.com</a>',
        position: 'bottom-right',
        type: 'success',
        dangerouslyUseHTMLString: true,
        duration: 4000
      })
      ServerInfosService.on(this.handleInfo)
    },
    methods: {
      handleInfo (data) {
        console.log(data)
        this.hostname = data.Hostname
        this.players = `${data.Players} / ${data.MaxPlayers}`
        this.queued = data.Queued
        this.joining = data.Joining
        this.entityCount = data.EntityCount
        this.upTime = Utils.formatDuration(data.Uptime)
        this.gameTime = moment(data.GameTime).format('HH:mm:ss')
        this.map = data.Map
        this.framerate = data.Framerate
        this.memory = `${data.Memory} MB`
        this.networking = `${data.networkIn} in / ${data.networkIn} out`
        this.sort++
        var netWorkingData = {'sort': this.sort, '流入': data.NetworkIn, '流出': data.NetworkOut}
        this.chartData.rows.push(netWorkingData)
        console.log(data.NetworkIn, data.NetworkOut, netWorkingData)
      }
    },
    beforeDestroy () {
      ServerInfosService.off(this.handleInfo)
    },
    components: {
      StatsTile
    }
  }
</script>
