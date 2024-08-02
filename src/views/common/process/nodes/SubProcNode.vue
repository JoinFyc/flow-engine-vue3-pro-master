<template>
  <node v-model:title="config.name" :show-error="showError" :content="content" :error-info="errorInfo"
        @selected="$emit('selected')" @delNode="$emit('delNode')" @insertNode="type => $emit('insertNode', type)"
        placeholder="请选择子流程" header-bgc="#9274E7" header-icon="money"/>
</template>

<script>
import Node from './Node.vue'
import {getGroupModels} from "@/api/modelGroup";
const modelMap = {}
getGroupModels({}, true).then(rsp => {
  rsp.data.forEach(group => {
    group.items.forEach(v => modelMap[v.procCode] = v.procName)
  })
})
export default {
  name: "SubProcNode",
  components: {Node},
  props:{
    config:{
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      modelMap,
      showError: false,
      errorInfo: '',
    }
  },
  computed:{
    nodeMap(){
      return this.$store.state.nodeMap
    },
    content(){
      const subProcCode = this.config.props.subProcCode
      return ('已选择：' + (modelMap[subProcCode] || '？')) //config.subProcCode || ''
    }
  },
  methods: {
    //校验数据配置的合法性
    validate(err){
      try {
        this.showError = false
        const config = this.config.props
        if ((config.subProcCode || '').trim().length === 0){
          this.showError = true
          this.errorInfo = '请选择子流程'
          err.push(`子流程节点 ${this.config.name} 未选择目标子流程`)
        } else if (config.staterUser.type === 'FORM' && !config.staterUser.value){
          this.showError = true
          this.errorInfo = '请指定子流程发起人表单字段'
          err.push(`子流程节点 ${this.config.name} 未指定子流程发起人表单字段`)
        } else if (config.staterUser.type === 'SELECT' && !config.staterUser.value){
          this.showError = true
          this.errorInfo = '请选择子流程发起人'
          err.push(`子流程节点 ${this.config.name} 未指定子流程的具体发起人`)
        }
        return this.showError
      } catch (e) {
        return true;
      }
    }
  },
  emits: ['selected', 'delNode', 'insertNode']
}
</script>

<style scoped>

</style>
