<template>
  <div>
    <el-alert title="当节点状态变化时，您可以在此处配置监听器做一些事情" type="success" close-text="知道了"/>
    <el-form label-width="130px" label-position="top">
      <el-form-item>
        <template #label>
          <span class="w-f-title">当流程进入本节点时</span>
          <el-button type="primary" link size="small" @click="addSetup('enter')"> + 添加动作</el-button>
        </template>
        <div class="action-item" v-for="(setup, i) in (listeners.enter || [])" :key="'start' + i">
          <action-config v-model="listeners.enter[i]"/>
          <el-icon @click="listeners.enter.splice(i, 1)"><delete/></el-icon>
        </div>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span class="w-f-title">当流程离开本节点时</span>
          <el-button type="primary" link size="small" @click="addSetup('leave')"> + 添加动作</el-button>
        </template>
        <div class="action-item" v-for="(setup, i) in listeners.leave || []" :key="'start' + i">
          <action-config v-model="listeners.leave[i]"/>
          <el-icon @click="listeners.leave.splice(i, 1)"><delete/></el-icon>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import ActionConfig from "../../../admin/layout/action/ActionConfig.vue";

export default {
  name: "TaskNodeConfig",
  components: {ActionConfig},
  data() {
    return {
      active: 'properties',
    }
  },
  computed: {
    selectedNode() {
      return this.$store.state.selectedNode
    },
    listeners() {
      let listeners = this.selectedNode.props.listeners
      if (!listeners || listeners instanceof Array){
        this.selectedNode.props.listeners = {}
        listeners = this.selectedNode.props.listeners
      }
      return listeners
    }
  },
  methods:{
    addSetup(type){
      if (!this.listeners[type]){
        this.listeners[type] = []
      }
      this.listeners[type].push({
        actionType: "NONE",
        java: '',
        js: '',
        http: {
          url: '',
          method: 'GET',
          headers: [],
          contentType: 'JSON',
          params: [],
          data: '',
          preHandler: null,
          aftHandler: null
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.listener-group {
  padding: 20px;
  border-radius: 5px;
  border: 1px dashed @theme-desc-color;
}

.w-f-title{
  margin-right: 10px;
}

.action-item{
  width: 100%;
  position: relative;
  background: #F5F6F6;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
  &>.el-icon {
    top: -8px;
    right: -5px;
    background: #F5F6F6;
    position: absolute;
    color: @theme-danger;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
  }
}
</style>
