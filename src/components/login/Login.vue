<template>
  <div class="login-form">
    <el-alert
      title="赞助商广告"
      type="success"
      description="Rust服务器租用/无限人数/低延迟/低价格 v2pg.taobao.com"
      show-icon>
    </el-alert>
    <br/>
    <form @submit.prevent="login" class="text-center">
      <div class="input-group">
        <span class="input-group-label"><i class="fa fa-server" aria-hidden="true"></i></span>
        <input v-model="address" type="text" class="input-group-field" name="address" placeholder="服务器地址" v-if="!hostForced">
      </div>

      <div class="input-group">
        <span class="input-group-label"> <i class="fa fa-cogs" aria-hidden="true"></i></span>
        <input v-model="port" class="input-group-field" type="text" name="port" placeholder="服务器端口" v-if="!hostForced">
      </div>

      <div class="input-group">
        <span class="input-group-label">       <i class="fa fa-key" aria-hidden="true"></i></span>
        <input v-model="password" class="input-group-field" type="password" name="address" placeholder="服务器密码">
      </div>

      <button class="button" type="submit">登录</button>
    </form>
    <div v-if="error" class="errors">
      <div class="callout alert">
        <h5>登录失败</h5>
        <p>连接服务器失败. 请确认服务器地址或者密码是否正确!</p>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import './login.scss'
  import EnvService from '../../services/EnvService'
  export default {
    props: {
      error: {
        type: Boolean,
        default: () => false
      }
    },
    data () {
      return {
        address: '',
        password: '',
        port: '',
        hostForced: false,
        fetched: false
      }
    },
    mounted () {
      EnvService.get()
        .then(res => {
          if (res.RA_FORCE_HOST) {
            this.hostForced = true
            this.address = res.RA_FORCE_HOST
            this.fetched = true
          }
        })
        .catch(err => {
          console.log('Something went wrong: ', err)
          this.fetched = true
        })
    },
    methods: {
      login () {
        this.$emit('login', {address: `${this.address}:${this.port}`, password: this.password})
      }
    }
  }
</script>
