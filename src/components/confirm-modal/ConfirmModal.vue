<template>
  <div class="reveal-overlay" style="display: block">
    <div class="reveal" style="display: block">
      <slot></slot>
      <button class="close-button" type="button" @click="cancel">
        X
      </button>
      <div class="control text-center grid-x" v-if="show_reason">
           <div class="medium-8 cell medium-offset-2">
            <label>
              <el-input v-model="reason" placeholder="请输入理由（可为空)"></el-input>
            </label>
          </div>
       </div>
      <div class="control text-center">
        <el-button type="success" @click="confirm" size="small">确定</el-button>
        <el-button type="info" @click="cancel" size="small">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  export default {
    data () {
      return {
        reason: ''
      }
    },
    props: {
      show_reason: false,
      payload: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    methods: {
      confirm () {
        this.$emit('confirm', this.payload)
      },
      cancel () {
        this.$emit('cancel', this.payload)
      }
    }
  }
</script>
