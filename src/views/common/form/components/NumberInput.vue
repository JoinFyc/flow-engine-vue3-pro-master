<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-input disabled :placeholder="placeholder" type="number"/>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-input v-model="_value" @blur="cover" clearable :placeholder="placeholder" type="number"/>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <field v-model="_value" type="number" :placeholder="placeholder" />
    </div>
    <div v-else>
      {{ _value }}
    </div>
    <!--    <div v-else>
        <field readonly clickable v-model="_value" type="number" @click="showKey = true" :placeholder="placeholder"></field>
        <number-keyboard v-model="_value" theme="custom" :extra-key="['-', '.']"
                         close-button-text="完成" :show="showKey" :maxlength="15" @blur="showKey = false"/>
      </div>-->
  </div>
</template>

<script>
import { Field, NumberKeyboard } from 'vant'
import 'vant/lib/field/style'
import componentMinxins from '../ComponentMinxins'

export default {
  mixins: [componentMinxins],
  name: 'NumberInput',
  components: { Field, NumberKeyboard },
  props: {
    modelValue: {
      type: Number,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: '请输入数值',
    },
    precision: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    _value: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
  },
  data() {
    return {
      showKey: false,
    }
  },
  methods: {
    cover(){
      this._value = this.parseNumber(this._value)
    },
    parseNumber(val) {
      if (typeof val === 'string') {
        return this.precision > 0
          ? parseFloat(parseFloat(val).toFixed(this.precision))
          : parseInt(val)
      }
      return val
    },
    isNaN(value) {
      return typeof value === 'number' && isNaN(value)
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style scoped></style>
