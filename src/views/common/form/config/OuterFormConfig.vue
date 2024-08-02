<template>
  <div>
    <el-form-item label="表单形式">
      <el-radio-group v-model="modelValue.isCodeForm">
        <el-radio :label="true">Vue表单</el-radio>
        <el-radio :label="false">Url表单</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="表单路径">
      <el-input :placeholder="modelValue.isCodeForm ? '表单Vue组件名称':'表单URL地址'"
                v-model="modelValue.path"></el-input>
      <span v-if="modelValue.isCodeForm">组件名称不要加文件后缀</span>
      <span v-else>输入表单url访问路径</span>
    </el-form-item>
    <el-form-item label="显示高度" v-if="!modelValue.isCodeForm">
      <el-input placeholder="例如：600px / 80%" v-model="modelValue.height"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import ConfigMinxins from '../ConfigMinxins.js'

export default {
  name: "OuterFormConfig",
  mixins: [ConfigMinxins],
  components: {},
  props:{
    value:{
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>

</style>
