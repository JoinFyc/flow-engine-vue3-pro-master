<template>
  <div v-if="!(selectNode.type === 'ROOT' && isSubProc)">
    <el-tabs v-model="active" v-if="name">
      <el-tab-pane :label="name" name="properties">
        <component :is="(selectNode.type || '').toLowerCase()" :config="selectNode.props"/>
      </el-tab-pane>
      <el-tab-pane label="表单权限设置" name="permissions" v-if="!isSubProc">
        <form-authority-config />
      </el-tab-pane>
      <el-tab-pane label="操作权限" name="operatePerm"
                   v-if="selectNode.type === 'APPROVAL'
                   || selectNode.type === 'ROOT'
                   || selectNode.type === 'TASK'">
        <task-operation-config/>
      </el-tab-pane>
      <el-tab-pane label="监听器" name="listener"
                   v-if="selectNode.type === 'APPROVAL'
                   || selectNode.type === 'ROOT'
                   || selectNode.type === 'TASK'">
        <task-listener-config/>
      </el-tab-pane>
    </el-tabs>
    <component :is="(selectNode.type || '').toLowerCase()" v-else :config="selectNode.props"/>
  </div>
</template>

<script>
import Approval from './ApprovalNodeConfig.vue'
import Condition from './ConditionNodeConfig.vue'
import Task from './TaskNodeConfig.vue'
import Delay from './DelayNodeConfig.vue'
import Cc from './CcNodeConfig.vue'
import Trigger from './TriggerNodeConfig.vue'
import Inclusive from './InclusiveNodeConfig.vue'
import TaskOperationConfig from './TaskOperationConfig.vue'
import FormAuthorityConfig from './FormAuthorityConfig.vue'
import Subproc from './SubProcNodeConfig.vue'
import Root from './RootNodeConfig.vue'
import TaskListenerConfig from "./TaskListenerConfig.vue";

export default {
  name: 'NodeConfig',
  components: {
    Approval,
    Condition,
    Inclusive,
    Trigger,
    Subproc,
    Delay,
    Root,
    Task,
    Cc,
    TaskListenerConfig,
    FormAuthorityConfig,
    TaskOperationConfig
  },
  data() {
    return {
      active: 'properties',
    }
  },
  computed: {
    selectNode() {
      return this.$store.state.selectedNode
    },
    formConfig() {
      return this.$store.state.design.formItems
    },
    isSubProc(){
      return this.$store.state.design.isSubProc || false;
    },
    name() {
      switch (this.selectNode.type) {
        case 'ROOT':
          return '设置发起人'
        case 'APPROVAL':
          return '设置审批人'
        case 'TASK':
          return '设置办理人';
        case 'SUBPROC':
          return '设置子流程';
        case 'CC':
          return '设置抄送人'
        default:
          return null
      }
    },
  },
  methods: {},
}
</script>

<style lang="less" scoped></style>
