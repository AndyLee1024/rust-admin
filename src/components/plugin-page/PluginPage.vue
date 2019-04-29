<template>
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
            <span>插件管理</span>
          </div>

        <el-tabs v-model="activeName" @tab-click="">
          <el-tab-pane label="插件列表" name="first">
            <el-row span="24">
              <h5>已经安装的插件</h5>
              <el-table
                :data="installed_plugins"
                height="250"
                style="width: 98%">
                <el-table-column
                  prop="name"
                  label="名称"
                  class="el-col-3">
                </el-table-column>
                <el-table-column
                  prop="description"
                  label="描述"
                  class="el-col-14">
                </el-table-column>
                <el-table-column
                  prop="plugin_version"
                  label="安装版本"
                  class="el-col-2">
                </el-table-column>
                <el-table-column
                  prop="version"
                  label="最新版本"
                  class="el-col-2">
                  <template slot-scope="scope">
                    <el-badge is-dot v-if="compareVersion(scope.row.version, scope.row.plugin_version) === 1" class="item">
                      {{scope.row.version}}
                    </el-badge>
                    <span v-else>{{scope.row.version}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="operation"
                  label="操作"
                  class="el-col-3">
                  <template slot-scope="scope">
                    <el-button type="danger" @click="unInstall(scope.row.uuid)" size="small" icon="el-icon-delete">卸载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>

            <br/>
            <el-dialog
              title="安装提示"
              :visible.sync="dialogVisible"
              width="30%"
              >
              <span>请选择版本</span>
              <el-select v-model="version" placeholder="请选择">
                <el-option
                  v-for="item in versions"
                  :key="item.version"
                  :label="item.version"
                  :value="item.version">
                </el-option>
              </el-select>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false, version = null">取 消</el-button>
                <el-button type="primary" @click="handleDownload()">确 定</el-button>
              </span>
            </el-dialog>

            <el-row :span="24">
              <h5>全部插件列表</h5>

              <el-col :span="8" class="search-Box">
                <el-input placeholder="请输入关键字" @change="search" icon="search"  class="search"  v-model="searchPlugin"></el-input>
              </el-col>


              <data-tables-server :table-props="{height: 600}" :data="plugins" :total="total" :loading="loading" @query-change="loadData" :pagination-props="{ pageSizes: [20] }">
                <el-table-column prop="icon_url" with="60px" label="">
                  <template slot-scope="scope">
                    <img :src="scope.row.icon_url" style="height: 80px;width: 80px"/>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="name"
                  label="名称"
                  width="170px"
                  class-name="cell">
                </el-table-column>
                <el-table-column
                  prop="description"
                  label="描述"
                  width="806px">
                </el-table-column>
                <el-table-column
                  prop="version"
                  label="最新版本"
                  class="el-col-2">
                </el-table-column>
                <el-table-column
                  prop="created_at"
                  label="更新日期">
                </el-table-column>
                <el-table-column
                  prop="downloads"
                  label="下载次数">
                </el-table-column>
                <el-table-column
                  prop="slug"
                  label="插件主页">
                  <template slot-scope="scope">
                    <el-button @click="handleViewClick(scope.row.slug)" type="text" size="small">查看</el-button>
                  </template>

                </el-table-column>
                <el-table-column
                  prop="operation"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" v-if="scope.row.installed === true" @click="unInstall(scope.row.uuid, scope.row.name)" size="small" icon="el-icon-delete">卸载</el-button>
                    <el-button type="success" v-else @click="handleInstall(scope.row.uuid)" size="small" icon="el-icon-plus">安装</el-button>
                  </template>
                </el-table-column>
              </data-tables-server>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="插件配置" name="third">
            <el-row>
              <el-col :span="24">
                <h4>当前的插件配置文件</h4>
                <p>找不到你需要的配置？</p>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">

                <p>
                  <el-alert
                    title="目录提示"
                    type="success"
                    description="config是插件配置目录，lang是插件对应的语言目录，data是插件数据保存目录"
                    show-icon>
                  </el-alert>
                </p>

                <el-input
                  placeholder="请输入内容"
                  v-model="configFilterText">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>

                <el-tree ref="tree2" :data="configData" :props="defaultProps" @node-click="handleNodeClick" :filter-node-method="filterNode">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span v-if="data.type === 'file'"><i class="el-icon-document"></i> {{node.label}}</span>
                      <span v-else>{{node.label}}</span>
                    </span>
                </el-tree>

                <el-button type="primary" @click="refresh_plugin" :loading="this.refreshStatus" icon="el-icon-refresh" size="small">重载所有插件</el-button>


              </el-col>
              <el-col :span="17" style="margin: 0 15px;">
                <el-row>
                  <el-col v-if="file_path" :span="16">
                    <h4>编辑文件 {{file_path}}</h4>
                  </el-col>
                  <el-col v-if="file_path" :span="8" class="span-plugin-conf-btns">
                    <el-button size="medium" @click="delete_file" type="danger" icon="el-icon-delete" id="delete-plugin-conf-btn">删除</el-button>
                    <el-button size="medium" @click="save_file" type="primary"  icon="el-icon-check" id="save-plugin-conf-btn">保存</el-button>

                  </el-col>
                  <el-col :span="24">
                    <codemirror v-if="code" v-model="code" :options="cmOption"></codemirror>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade"/>
          </el-tab-pane>
          <el-tab-pane label="服务器管理" name="fourth">
            <el-row>
              <el-col :span="10">
                <el-button-group>
                  <el-button type="danger" @click="command('restart')" icon="el-icon-refresh">重启服务器</el-button>
                  <el-button type="warning" @click="command('update')" icon="el-icon-download">升级服务器</el-button>
                </el-button-group>

                <el-button-group>
                  <el-tooltip class="item" effect="dark" content="服务器清档将会重置服务器为初始化状态，玩家和游戏内创建的建筑物将会被删除" placement="top-start">
                  <el-button type="primary" @click="command('wipe_server')" icon="el-icon-delete">服务器清档</el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="蓝图清档将会 删除玩家数据，背包和仓库物品" placement="top-start">
                    <el-button type="primary" @click="command('wipe_bp')" icon="el-icon-delete">蓝图清档</el-button>
                  </el-tooltip>
                </el-button-group>

              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="修复Oxide" name="four">
            <el-alert
              title="操作提示"
              type="success"
              description="当服务器更新后，如果遇到插件都失效的情况，请点击下面按钮修复Oxide"
              show-icon>
            </el-alert>
            <br/>
            <el-row>
              <el-button type="primary" @click="reInstallOxide" icon="el-icon-refresh">修复Oxide</el-button>
            </el-row>
          </el-tab-pane>
        </el-tabs>

        </el-card></el-main></el-container>


</template>

<script>
  import http from '../../services/Http'
  import global from '../common/Common'
  import axios from 'axios'
  import OxideService from '../../services/OxideService'
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/theme/monokai.css'
  import 'codemirror/addon/selection/active-line.js'
  import BackToTop from '../topbar/BackToTop'
  import compareVersions from 'compare-versions'

  export default {
    name: 'PluginPage',
    data () {
      return {
        refreshStatus: false,
        total: 0,
        code: '',
        cmOption: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          mode: 'application/ld+json',
          lineWrapping: true,
          theme: 'monokai'
        },
        file_path: '',
        dialogVisible: false,
        versions: [],
        current_path: '',
        installed_plugins: [],
        version: null,
        version_url: null,
        loading: true,
        plugin: '',
        page: 0,
        searchPlugin: '',
        plugins: [],
        activeName: 'first',
        configData: [],
        configFilterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        myBackToTopStyle: {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          borderRadius: '4px',
          lineHeight: '45px', // 请保持与高度一致以垂直居中
          background: '#e7eaf1'// 按钮的背景颜色
        }
      }
    },
    methods: {
      reInstallOxide () {
        const loading = this.$loading({
          lock: true,
          text: '正在修复Oxide 请不要刷新页面',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        axios.get(`${global.address()}/install_oxide`).then(() => {
          this.$message({
            message: '修复Oxide成功，服务器正在重启',
            type: 'success'
          })
          loading.close()
        }).catch(() => {
          this.$message.error('请求失败, 请重试')
          loading.close()
        })
      },
      async command (cmd) {
        try {
          const result = await axios.get(`${global.address()}/run/${cmd}`)
          this.$message({
            message: result.data.message,
            type: 'success'
          })
        } catch (e) {
          this.$message.error('请求失败')
        }
      },
      search () {
        this.loading = true
        axios.get(`${global.queryAddress()}/plugins/search?keyword=${this.searchPlugin}`).then(response => {
          if (response.status === 200) {
            this.plugins = response.data.rows
            this.total = response.data.total
            this.loading = false
            return true
          }
          this.loading = false
          this.$message.error('查询失败')
        })
      },
      compareVersion (latest, installed) {
        return compareVersions(latest, installed)
      },
      async loadData (queryInfo) {
        this.page = queryInfo.page
        await this.listPlugins(queryInfo.page)
      },

      async refresh_plugin () {
        this.refreshStatus = true
        setTimeout(() => {
          OxideService.reload('*')
          this.refreshStatus = false
          this.$message({
            message: '重载所有插件成功',
            type: 'success'
          })
        }, 1000)
      },
      save_file () {
        axios.post(`${global.address()}/save/${this.current_path}`, {content: this.code}).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
        })
      },
      delete_file () {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(`${global.address()}/content/${this.current_path}?action=remove`).then(response => {
            if (response.data.status === 'error') {
              this.$message.error(response.data.message)
              return false
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.listDirs()
            this.current_path = ''
          })
        }).catch(() => {
          console.log('取消删除')
        })
      },
      getInstalledPlugins () {
        axios.get(`${global.address()}/installed`).then(response => {
          if (response.status === 200) {
            this.installed_plugins = response.data
          }
        })
      },
      listPlugins (page = 0) {
        axios.get(`${global.queryAddress()}/plugins?page=${page}`).then(response => {
          this.plugins = response.data.rows
          this.total = response.data.total
          this.loading = false
        })
      },
      unInstall (hashid) {
        axios.get(`${global.address()}/uninstall?hashid=${hashid}`).then(response => {
          if (response.status === 200) {
            this.$message({
              message: '插件卸载成功',
              type: 'success'
            })
            this.getInstalledPlugins()
            this.listPlugins(this.page)
          }
        })
      },
      handleViewClick (tab) {
        window.open(`https://umod.org/plugins/${tab}`, '_blank')
      },
      handleNodeClick (data, node) {
        if (data.type === 'file') {
          let path = ''
          if (node.parent.parent.data.label !== undefined) {
            path = `${node.parent.parent.data.label}~~${node.parent.data.label}~~${data.label}`
          } else {
            path = `${node.parent.data.label}~~${data.label}`
          }
          axios.get(`${global.address()}/content/${path}`).then(response => {
            this.code = response.data.content
          }).catch(err => {
            this.$message.error('请求失败' + err.message)
          })

          this.current_path = path
          this.file_path = path.replace(new RegExp('~~', 'g'), '/')
        }
      },
      async handleDownload () {
        if (!this.plugin || !this.version) {
          this.$message.error('请选择mod和对应安装的版本.')
          return false
        }

        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const element = this.versions.filter(element => {
          if (element.version === this.version) {
            return element
          }
        })
        const fileName = element[0].download_url.substring(element[0].download_url.lastIndexOf('/') + 1)
        const reqUrl = `${global.address()}/download?version=${this.version}&hashid=${this.plugin}&url=${encodeURIComponent(element[0].download_url)}`
        try {
          const result = await axios.get(reqUrl)
          if (result.data.status === 'success') {
            this.$message({
              message: '安装成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.plugin = null
            this.versions = null
            this.version = null
            OxideService.load(fileName.split('.')[0])
            this.getInstalledPlugins()
            this.listPlugins(this.page)
            loading.close()
          }
        } catch (err) {
          loading.close()
          this.$message.error(err)
        }
      },
      handleInstall (slug) {
        this.loading = true
        this.plugin = slug
        http(`${global.queryAddress()}/plugins/${slug}/download`).then(response => {
          this.loading = false
          this.versions = response.entity
          this.dialogVisible = true
          setTimeout(() => {
            http(`${global.queryAddress()}/plugins`).then(response => {
              this.plugins = response.entity
              this.loading = false
            })
          }, 3000)
        })
      },
      listDirs () {
        axios.get('http://127.0.0.1:38022/dirs').then(response => {
          this.configData = response.data
        })
      },
      filterNode (value, configData) {
        console.log(value, configData)
        if (!value) return true
        return configData.label.indexOf(value) !== -1
      }

    },
    watch: {
      configFilterText (val) {
        this.$refs.tree2.filter(val)
      }
    },
    components: {
      codemirror,
      BackToTop
    },

    mounted () {
      this.listPlugins()
      this.getInstalledPlugins()
      this.listDirs()
    }
  }
</script>
<style>
  .CodeMirror {
    height: auto !important;
  }
  .page {
    margin: 10px 40px;
  }
  .available-oxide {
    margin: 10px 0;
  }
  #save-plugin-conf-btn {
    float: right;
  }
  #delete-plugin-conf-btn {
    margin: 0 15px;
    float: right;
  }
</style>
