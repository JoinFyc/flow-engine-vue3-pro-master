<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <el-input disabled :placeholder="placeholder" />
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-input clearable v-model="_value" :placeholder="placeholder">
        <template #append v-if="enableScan">
          <el-button @click="scanCode" icon="fullScreen"></el-button>
        </template>
      </el-input>
      <scan-code pcMode v-model="visible" @ok="scanOk"></scan-code>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <field v-model="_value" clearable :placeholder="placeholder">
        <template #right-icon v-if="enableScan">
          <el-icon @click="scanCode"><FullScreen /></el-icon>
        </template>
      </field>
      <scan-code v-model="visible" @ok="scanOk"></scan-code>
    </div>
    <div v-else>
      {{ _value }}
    </div>
  </div>
</template>

<script>
import componentMinxins from '../ComponentMinxins'
import { Field } from 'vant'
import ScanCode from '@/components/common/ScanCode.vue'
export default {
  mixins: [componentMinxins],
  name: 'TextInput',
  components: { Field, ScanCode },
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    enableScan: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    scanCode() {
      this.visible = true
    },
    scanOk(code) {
      this._value = code
      showSuccessToast('扫码成功')
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style lang="less" scoped></style>
