<template>
  <div class="grid-container">
      <el-container>
        <el-main>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>物品发放</span>
            </div>
            <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade"/>
            <div class="grid-x grid-padding-x" style="margin-top: 10px">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="玩家1">
                  <el-select v-model="player1" placeholder="请选择玩家">
                    <el-option  v-for="item in players" :key="item.SteamID" :label="item.DisplayName" :value="item.SteamID"></el-option>
                  </el-select>                </el-form-item>
                <el-form-item label="玩家2">
                  <el-select v-model="player2" placeholder="请选择玩家">
                    <el-option  v-for="item in players" :key="item.SteamID" :label="item.DisplayName" :value="item.SteamID"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发放数量">
                  <el-input-number v-model="amount" :min="1" :max="500" label="请输入数量,最大不能超过500"></el-input-number>
                </el-form-item>
              </el-form>

            </div>
            <div class="grid-x">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="中文名搜索">
                  <el-input v-model="filters[1].value" placeholder="输入中文名称搜索.."></el-input>
                </el-form-item>
                <el-form-item label="英文名搜索">
                  <el-input v-model="filters[0].value" placeholder="输入英文名称搜索..">
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="grid-x">
              <data-tables :table-props="{height: 800}" :data="game_items" :filters="filters" :pagination-props="{ pageSizes: [30] }">
                <el-table-column prop="id" width="50" label="#">
                </el-table-column>
                <el-table-column prop="image" width="100" label="图片">
                  <template slot-scope="scope">
                    <img :src="scope.row.image"/>
                  </template>
                </el-table-column>
                <el-table-column prop="itemName" width="200" label="物品名称">
                </el-table-column>
                <el-table-column prop="chineseName" width="200" label="中文名称">
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-goods" @click="give (scope.row.shortName, 1, 'player')" size="small">发给玩家1</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="success" icon="el-icon-goods" @click="give (scope.row.shortName, 2, 'player')" size="small">发给玩家2</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-goods" @click="give (scope.row.shortName)" size="small">发给全部玩家</el-button>
                  </template>
                </el-table-column>
              </data-tables>
            </div>
          </el-card>
        </el-main>
      </el-container>
  </div>

</template>

<script>
  import Config from '../../config'
  import PlayersService from '../../services/PlayersService.js'
  import BackToTop from '../topbar/BackToTop'

  export default {
    components: {BackToTop},
    data () {
      return {
        myBackToTopStyle: {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          borderRadius: '4px',
          lineHeight: '45px', // 请保持与高度一致以垂直居中
          background: '#e7eaf1'// 按钮的背景颜色
        },
        amount: 1,
        player: '',
        player2: '',
        players: [],
        game_items: [],
        items: {},
        filters: [
          {
            value: '',
            prop: 'itemName'
          },
          {
            value: '',
            prop: 'chineseName'
          }
        ]
      }
    },
    mounted () {
      this.update()
      this.getPlayers()
      this.$notify({
        title: '系统提示',
        message: '小窍门: 选择框输入玩家昵称进行搜索哦.',
        duration: 5000
      })
    },
    methods: {
      getPlayers () {
        return PlayersService.list()
          .then((res) => {
            this.players = res.map((p) => {
              return p
            })
          })
      },
      give (shortName, playerId = null, type = 'players') {
        if (this.amount <= 0 || this.amount > 500) {
          this.$message.error('发放数量不能小于等于0，不能大于500')
          return false
        }
        if (type === 'players') {
          return PlayersService.giveItem('', shortName, this.amount).then(res => {
            this.$message({
              message: '发送物品成功',
              type: 'success'
            })
          })
        } else {
          let p = playerId === 1 ? this.player : this.player2
          if (!p) {
            this.$message.error(`发放物品之前请先设置 玩家${playerId}`)
            return false
          }
          return PlayersService.giveItem(p, shortName, this.amount, 'player').then(res => {
            this.$message({
              message: '发送物品成功',
              type: 'success'
            })
          })
        }
      },
      update () {
        const items = Config.items
        this.items = items
        items.forEach((item, index) => {
          let itemInfo = {
            id: index,
            image: item['image'],
            itemName: item['name'],
            shortName: item['short_id'],
            chineseName: item['chinese_name']
          }
          this.game_items.push(itemInfo)
        })
      }
    }
  }
</script>

<style scoped>
  .player-nickname {
    font-weight: 700;
    text-align: left;
  }

  .item-img {
    width: 40px;
    height: 48px;
  }

  .player-selected {
    width: 80%;
  }
</style>
