<template>
  <div class="grid-container">
    <div class="grid-x grid-padding-x" style="margin-top: 10px">
      <div class="medium-3 cell">
        <label><span class="player-nickname">玩家1</span>
          <el-select v-model="player" filterable placeholder="请选择">
            <el-option
              v-for="item in players"
              :key="item.SteamID"
              :label="item.DisplayName"
              :value="item.SteamID">
            </el-option>
          </el-select>
        </label>
      </div>
      <div class="medium-3 cell">
        <label><span class="player-nickname">玩家2</span>
          <el-select v-model="player2" filterable placeholder="请选择">
            <el-option
              v-for="item in players"
              :key="item.SteamID"
              :label="item.DisplayName"
              :value="item.SteamID">
            </el-option>
          </el-select>
        </label>
      </div>
    </div>
    <div class="grid-x">
      <el-row>
        <label><span class="player-nickname">发放数量 （最大不能超过500)</span>
          <el-input
            placeholder="请输入数量,最大不能超过500"
            v-model="amount"
            clearable>
          </el-input>
        </label>
        <el-col :span="24" style="width: 300px">
          <el-input v-model="filters[0].value" placeholder="输入物品名称进行搜索..">
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="grid-x">
      <data-tables :data="game_items" :filters="filters" :pagination-props="{ pageSizes: [50, 10, 15] }">
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
            <button type="button" @click="give(scope.row.shortName, 1, 'player')" class="success button tiny"><i class="fa fa-user fa-fw"></i> 发给玩家1</button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <button type="button" @click="give(scope.row.shortName, 2, 'player')" class="info button tiny"><i class="fa fa-user fa-fw"></i> 发给玩家2</button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <button type="button" @click="give(scope.row.shortName)" class="alert button tiny"><i class="fa fa-users fa-fw"></i>发给全部玩家</button>
          </template>
        </el-table-column>
      </data-tables>
    </div>
  </div>
</template>

<script>
  import Config from '../../config'
  import PlayersService from '../../services/PlayersService.js'
  export default {
    data () {
      return {
        amount: 1,
        player: '',
        player2: '',
        players: [],
        game_items: [],
        items: {},
        filters: [{
          value: '',
          prop: 'itemName'
        }]
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
