<template>
  <div class="top-bar">
    <div class="top-bar-left">
      <ul class="dropdown menu" data-dropdown-menu>
        <li class="menu-text"><span v-text="name"></span></li>
      </ul>
    </div>
    <div class="top-bar-right">
      <ul class="menu">
        <li class="online_users"><span>{{players}} <i class="ion ion-person-stalker"></i></span></li>
        <li><button type="button" @click="logout" class="button">退出登录</button></li>
      </ul>
    </div>
  </div>
</template>
<style>
  .online_users {
    margin-top: 8px;
  }
</style>
<script type="text/babel">
  import LoginService from '../../services/LoginService'
  import ServerInfoService from '../../services/ServerInfosService'
  import './topbar.scss'
  export default {
    data () {
      return {
        name: 'ok',
        players: 0
      }
    },
    methods: {
      logout () {
        LoginService.logout()
      },
      handleInfo (info) {
        this.name = info.Hostname
        this.players = info.Players
      }
    },
    mounted () {
      ServerInfoService.on(this.handleInfo)
    }
  }
</script>

