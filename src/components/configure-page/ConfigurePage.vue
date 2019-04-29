<template>
  <div class="grid-container">
    <el-container>
      <el-main>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>服务器状态</span>
          </div>

          <el-form ref="form" :model="form" label-width="100px">
            <el-row>
              <el-col :spam="12">
                <el-alert
                  title="操作提示"
                  type="warning"
                  description="修改 服务器密码/服务器Seed 功能仅适用于在v2pg.taobao.com处购买的服务器用户"
                  show-icon>
                </el-alert>
              </el-col>
            </el-row>
            <br/>
            <el-tooltip content="用于显示在游戏服务器列表中。请不要超过25个字符长度" placement="top-start">
              <el-form-item label="服务器名称" >
                <el-col :span="11">
                  <el-input v-model="form.name" placeholder="请不要超过25个字符长度"></el-input>
                </el-col>
              </el-form-item>
            </el-tooltip>
            <el-tooltip content="服务器密码仅支持字母数字组合，不要使用特殊字符，长度不超过10" placement="top-start">
              <el-form-item label="服务器密码" >
                <el-col :span="11">
                  <el-input v-model="form.rcon_password" placeholder="请输入服务器密码"></el-input>
                </el-col>
              </el-form-item>
            </el-tooltip>

              <el-form-item label="人数设置">
                <el-col :span="24">
                  <el-slider :min="10" show-input :step="10" :max="500" v-model="form.slots"></el-slider>
                </el-col>
              </el-form-item>

            <el-form-item label="地图尺寸">
              <el-col :span="24">
                <el-slider :min="1000" show-input :step="100" :max="6000" v-model="form.worldsize"></el-slider>
              </el-col>
            </el-form-item>


            <el-form-item label="服务器Seed">
              <el-col :span="24">
                <el-slider :min="1000" show-input :step="1000" :max="1861268846" v-model="form.serverSeed"></el-slider>
              </el-col>
            </el-form-item>

            <el-tooltip content="用于显示在游戏服务器详情中，请不要超过100个字符" placement="top-start">
              <el-form-item label="服务器描述">
                <el-input type="textarea" v-model="form.desc"></el-input>
              </el-form-item>
            </el-tooltip>

            <el-tooltip  content="用于显示在游戏服务器详情中的图片，请输入图片的外链地址。如果没有请联系客服" placement="top-start">
              <el-form-item label="服务器图片">
                <el-input v-model="form.image"></el-input>
              </el-form-item>
            </el-tooltip>

            <el-form-item v-if="form.image" label="图片预览">
              <el-col :span="6">
                <img :src="form.image" alt="server image">
              </el-col>
            </el-form-item>


            <el-tooltip content="服务器详情中点击view webpage的跳转地址，建议设置成QQqun的加群方式" placement="top-start">
              <el-form-item label="服务器网址">
                <el-col :span="11">
                  <el-input v-model="form.url"></el-input>

                </el-col>
              </el-form-item>
            </el-tooltip>

            <el-form-item>
              <el-button type="primary" @click="saveConfigure">保存</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import ServerInfoService from '../../services/ServerInfosService'
  import RconService from '../../services/RconService'
  import Utils from '../../services/Utils.js'
  import axios from 'axios'
  import global from '../common/Common'

  export default {
    data () {
      return {
        form: {
          name: '',
          slots: '',
          desc: '',
          rcon_password: '',
          image: '',
          url: '',
          worldsize: 3000,
          serverSeed: 1000
        }
      }
    },
    methods: {
      updateSlot (data) {
        this.form.slots = data
      },
      handleInfo () {
        ServerInfoService.infos().then(info => {
          this.form.name = info.Hostname
          this.players = info.Players
          this.form.slots = info.MaxPlayers
        })
        ServerInfoService.descr().then(descr => {
          this.form.desc = descr
        })
        ServerInfoService.headimage().then(image => {
          this.form.image = image
        })
        ServerInfoService.url().then(url => {
          this.form.url = url
        })
        axios.get(`${global.address()}/config`).then(resposne => {
          if (resposne.status === 200) {
            const result = JSON.parse(resposne.data.config)
            this.form.rcon_password = result['rcon.password']
            this.form.serverSeed = result['server.seed']
            this.form.worldsize = result['server.worldsize']
          }
        })
      },
      async saveConfigure () {
        if (!Utils.isURL(this.form.url)) {
          this.$alert('输入的网址格式不正确!', '警告', {
            confirmButtonText: '确定'
          })
          return false
        }
        await RconService.request(`server.maxplayers ${this.form.slots}`)
        await RconService.request(`server.hostname ${this.form.name}`)
        await RconService.request(`server.description ${this.form.desc}`)
        await RconService.request(`server.headerimage ${this.form.image}`)
        await RconService.request(`server.url ${this.form.url}`)
        await RconService.request(`server.seed ${this.form.serverSeed}`)
        await RconService.request(`server.worldsize ${this.form.serverSeed}`)

        axios.post(`${global.address()}/config/save`, this.form).then(response => {
          if (response.status === 200 && response.data.status !== 'success') {
            this.$message.error(response.data.message)
            return false
          }
        })
        this.$notify({
          title: '提示',
          message: '更新服务器信息成功',
          duration: 2000
        })
      }
    },
    mounted () {
      this.handleInfo()
    }
  }
</script>

<style scoped>

</style>
