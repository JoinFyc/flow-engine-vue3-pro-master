<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-rate :max="max" disabled></el-rate>
      <span class="score-tip">{{ placeholder }}</span>
    </div>
    <div v-else-if="mode === 'PC' && !readonly" style="display: flex">
      <el-rate :show-score="showScore" :allow-half="enableHalf" v-model="_value" :max="max"></el-rate>
      <span v-if="!$isNotEmpty(_value) || _value === 0" class="score-tip">{{ placeholder }}</span>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <div class="w-rate">
        <rate :allow-half="enableHalf" v-model="_value" :count="max" />
        <span style="margin-left: 10px" v-show="showScore">{{ _value }}</span>
      </div>
      <span v-if="!$isNotEmpty(_value) && _value === 0" class="score-tip">{{ placeholder }}</span>
    </div>
    <div v-else>
      <el-rate :allow-half="enableHalf" :show-score="showScore" disabled v-model="_value" :max="max"></el-rate>
    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'
import { Rate } from 'vant'

export default {
  mixins: [componentMinxins],
  name: 'TextInput',
  components: { Rate },
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    placeholder: {
      type: String,
      default: '请打分',
    },
    max: {
      type: Number,
      default: 5,
    },
    enableHalf: {
      type: Boolean,
      default: false,
    },
    showScore: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  methods: {},
  emits: ['update:modelValue'],
}
</script>

<style lang="less" scoped>
.score-tip{
  margin-left: 20px;
}

:deep(.w-rate){
  .van-rate__icon--half {
    position: absolute;
  }
}
</style>
