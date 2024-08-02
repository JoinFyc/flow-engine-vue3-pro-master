<script>

import CodeEditor from "@/components/common/CodeEditor.vue";
import HttpReq from "@/components/common/HttpReq.vue";

export default{
  name: "ActionConfig",
  components: {HttpReq, CodeEditor},
  props:{
    modelValue:{
      type: Object
    }
  },
  computed:{
    _value: {
      get(){
        return this.modelValue
      },
      set(val){
        this.$emit('update:modelValue', val)
      }
    }
  },
  data() {
    return {}
  },
  emits:['update:modelValue']
}
</script>

<template>
  <div>
    <el-radio-group v-model="_value.actionType">
      <el-radio label="NONE">无动作</el-radio>
      <el-radio label="JAVA">调用Java</el-radio>
      <el-radio label="JS">调用JS</el-radio>
      <el-radio label="HTTP">发送Http请求</el-radio>
    </el-radio-group>
    <el-input v-model="_value.java" v-if="_value.actionType === 'JAVA'" placeholder="输入springEL表达式"></el-input>
    <code-editor v-model="_value.js" height="200px" v-else-if="_value.actionType === 'JS'"></code-editor>
    <http-req v-model="_value.http" v-else-if="_value.actionType === 'HTTP'"></http-req>
  </div>

</template>

<style scoped lang="less">

</style>
