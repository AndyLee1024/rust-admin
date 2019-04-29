// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// Promise polyfill
import Promise from 'promise-polyfill'
if (!window.Promise) {
  window.Promise = Promise
}

import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import HomePage from 'components/home-page/HomePage.vue'
import ConsolePage from 'components/console-page/ConsolePage.vue'
import PlayersPage from 'components/players-page/PlayersPage.vue'
import ChatPage from 'components/chat-page/ChatPage.vue'
import MapPage from 'components/map-page/MapPage.vue'
import PlayerPage from 'components/player-page/PlayerPage.vue'
import ToolsPage from 'components/tools-page/ToolsPage'
import PluginPage from 'components/plugin-page/PluginPage'
import ConfigurePage from 'components/configure-page/ConfigurePage'
import AdminPage from 'components/admin-page/Admin'
import VTooltip from 'v-tooltip'
import ElementUI from 'element-ui'
import VCharts from 'v-charts'
import 'element-ui/lib/theme-chalk/index.css'
import VueDataTables from 'vue-data-tables'

Vue.use(ElementUI)
Vue.use(VueDataTables)
Vue.use(VCharts)
Vue.use(VTooltip)
Vue.use(VueRouter)

const routes = [
  {
    name: 'home',
    path: '',
    component: HomePage
  },
  {
    name: 'chat',
    path: '/chat',
    component: ChatPage
  },
  {
    name: 'map',
    path: '/map',
    component: MapPage
  },
  {
    name: 'admin',
    path: '/admin',
    component: AdminPage
  },
  {
    name: 'players',
    path: '/players',
    component: PlayersPage
  },
  {
    name: 'player',
    path: '/players/:id',
    component: PlayerPage
  },
  {
    name: 'console',
    path: '/console',
    component: ConsolePage
  },
  {
    name: 'server',
    path: '/server',
    component: ConfigurePage
  },
  {
    name: 'tools',
    path: '/tools',
    component: ToolsPage
  },
  {
    name: 'plugins',
    path: '/plugins',
    component: PluginPage
  }
]

const router = new VueRouter({
  routes
})
/* eslint-disable no-new */
new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
