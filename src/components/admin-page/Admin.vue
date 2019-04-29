<template>
  <div class="players-page">

    <div class="grid-container">
      <el-container>
        <el-main>
          <el-card class="box-card">
            <el-alert
              title="此功能仅支持V2PG用户，如需使用，请前往v2pg.taobao.com购买服务器"
              type="info"
              show-icon>
            </el-alert>
            <br/>
            <div slot="header" class="clearfix">
              <span>管理员列表</span>
              <el-button style="float: right;" @click="dialogFormVisible = true" icon="el-icon-plus" type="success">添加管理员</el-button>
              <a target="_lank" href="https://steamid.facheme.com" style="margin-left: 10px"  type="success">SteamID64查询</a>

            </div>
            <el-table
              :data="admins"
              height="250"
              style="width: 100%">
              <el-table-column
                prop="type"
                label="类型"
                width="180">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 'owner'">总管理员</span>
                  <span v-else >服主</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="steamid"
                label="steamid"
                width="180">
              </el-table-column>
              <el-table-column
                prop="name"
                label="昵称">
              </el-table-column>
              <el-table-column
                prop="reason"
                label="理由">
              </el-table-column>
              <el-table-column
                prop="operation"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="danger" @click="removeAdmin(scope.row.steamid, scope.row.type)" size="small" icon="el-icon-delete">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-main>

        <el-dialog title="添加管理员"   width="30%"
                    :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="管理员类型" :label-width="formLabelWidth">
              <el-select v-model="form.type" placeholder="请选择管理员类型">
                <el-option label="总管理员" value="owner"></el-option>
                <el-option label="服主" value="moderator"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="SteamID64" :label-width="formLabelWidth">
              <el-input v-model="form.steamid" placeholder="请输入要加入的管理员Steam64" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="昵称" :label-width="formLabelWidth">
              <el-input v-model="form.name" placeholder="请输入昵称，非必填项目" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="理由" :label-width="formLabelWidth">
              <el-input v-model="form.reason" placeholder="请输入理由，非必填项目" autocomplete="off"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addAdmin()">确 定</el-button>
          </div>
        </el-dialog>

      </el-container>
    </div>
  </div>




</template>

<script type="text/babel">
  import axios from 'axios'
  import global from '../common/Common'
  import PlayService from '../../services/PlayersService'

  export default {
    name: 'Admin',
    data () {
      return {
        formLabelWidth: '120px',
        admins: [],
        dialogFormVisible: false,
        form: {
          type: '',
          steamid: '',
          name: '',
          reason: ''
        }
      }
    },
    mounted () {
      this.listAdmin()
    },
    methods: {
      addAdmin () {
        PlayService.addAdmin(this.form.steamid, this.form.type, this.form.name, this.form.reason).then(() => {
          this.$message({
            showClose: true,
            message: '添加管理员成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.listAdmin()
        }).catch(() => {
          this.$message.error('请求失败')
        })
      },
      removeAdmin (steamid, type) {
        PlayService.removeAdmin(steamid, type).then(() => {
          this.$message({
            showClose: true,
            message: '移除管理员成功',
            type: 'success'
          })
          this.listAdmin()
        }).catch(() => {
          this.$message.error('请求失败')
        })
      },
      listAdmin () {
        axios.get(`${global.address()}/admin`).then(res => {
          this.admins = res.data
        }).catch(() => {
          this.$message.error('获取管理员失败, 请确认您是否为v2pg用户'.err.message)
        })
      }
    },
    beforeDestroy () {
      clearInterval(this.interval)
    },
    components: {
    }
  }
</script>
