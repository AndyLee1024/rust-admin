<template>
    <div class="grid-container">
      <br/>
      <el-form ref="form" :model="form" label-width="100px">
        <el-tooltip content="用于显示在游戏服务器列表中。请不要超过25个字符长度" placement="top-start">
        <el-form-item label="服务器名称" >
          <el-col :span="11">
          <el-input v-model="form.name" placeholder="请不要超过25个字符长度"></el-input>
          </el-col>
        </el-form-item>
        </el-tooltip>

        <el-tooltip content="请根据您的套餐适当合理的选择人数，否则会造成卡顿" placement="top-start">
        <el-form-item label="人数设置">
          <el-col :span="6">
            <el-select v-model="form.slots" @change="updateSlot" placeholder="请根据您的套餐适当选择人数" style="width: 100%;">
              <el-option :label="`${user*10}人`" v-for="user in form.users" :value="user*10"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        </el-tooltip>
        <el-tooltip content="用于显示在游戏服务器详情中，请不要超过100个字符" placement="top-start">
        <el-form-item label="服务器描述">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        </el-tooltip>

        <el-tooltip content="用于显示在游戏服务器详情中的图片，请输入图片的外链地址。如果没有请联系客服" placement="top-start">
        <el-form-item label="服务器图片">
          <el-input v-model="form.image"></el-input>
        </el-form-item>
        </el-tooltip>

        <el-form-item label="图片预览">
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
    </div>
</template>

<script>
  import _ from 'lodash'
  import ServerInfoService from '../../services/ServerInfosService'
  import RconService from '../../services/RconService'
  import Utils from '../../services/Utils.js'

  export default {
    data () {
      return {
        form: {
          users: _.range(1, 21),
          name: '',
          slots: '',
          desc: '',
          image: '',
          url: ''
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
      },
      async saveConfigure () {
        if (!Utils.isURL(this.form.url)) {
          this.$alert('输入的网址格式不正确!', '警告', {
            confirmButtonText: '确定'
          })
          return false
        }
        await RconService.request(`server.maxplayers "${this.form.slots}"`)
        await RconService.request(`server.hostname "${this.form.name}"`)
        await RconService.request(`server.description "${this.form.desc}"`)
        await RconService.request(`server.headerimage "${this.form.image}"`)
        await RconService.request(`server.url "${this.form.url}"`)
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
