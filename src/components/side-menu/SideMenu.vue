<template>
  <ul class="side-menu menu vertical">
    <li class="main-nav">
      <span>功能导航</span>
    </li>
    <router-link :to="{name: 'home'}" tag="li" class="menu-item" exact>
      <a><i class="fa fa-tachometer fa-fw" aria-hidden="true"></i> 仪表盘</a>
    </router-link>
    <router-link :to="{name: 'players'}" tag="li" class="menu-item">
      <a><i class="fa fa-users fa-fw" aria-hidden="true"></i> 玩家管理</a>
    </router-link>
    <router-link :to="{name: 'chat'}" tag="li" class="menu-item">
      <a><i class="fa fa-comments fa-fw" aria-hidden="true"></i> 聊天监控</a>
    </router-link>
    <router-link :to="{name: 'console'}" tag="li" class="menu-item">
      <a><i class="fa fa-desktop fa-fw" aria-hidden="true"></i> 控制台</a>
    </router-link>

    <router-link :to="{name: 'server'}" tag="li" class="menu-item">
      <a><i class="fa fa-server fa-fw" aria-hidden="true"></i> 参数设置</a>
    </router-link>

    <router-link :to="{name: 'tools'}" tag="li" class="menu-item">
      <a><i class="fa fa-wrench fa-fw" aria-hidden="true"></i> 游戏工具</a>
    </router-link>
  </ul>
</template>
<script type="text/babel">
  import './side-menu.scss'
  export default {
  }
</script>

