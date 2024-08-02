<template>
  <el-popover placement="bottom-start" title="添加流程节点" width="424" trigger="click">
    <div class="node-select">
      <div @click="addApprovalNode">
        <el-icon style="color: rgb(255, 148, 62)"><stamp/></el-icon>
        <span>审批人</span>
      </div>
      <div @click="addTaskNode">
        <el-icon style="color:#E6B039;"><checked/></el-icon>
        <span>办理人</span>
      </div>
      <div @click="addCcNode">
        <el-icon style="color: rgb(50, 150, 250)"><promotion/></el-icon>
        <span>抄送人</span>
      </div>
      <div @click="addConditionsNode">
        <el-icon style="color: rgb(21, 188, 131)"><share/></el-icon>
        <span>条件分支</span>
      </div>
      <div @click="addConcurrentsNode">
        <el-icon style="color: #718dff"><operation/></el-icon>
        <span>并行分支</span>
      </div>
      <div @click="addInclusivesNode">
        <el-icon style="color:#345DA2;"><connection/></el-icon>
        <span>包容分支</span>
      </div>
      <div @click="addSubProcNode" v-if="!isSubProc">
        <el-icon style="color:#9274E7;"><money/></el-icon>
        <span>子流程</span>
      </div>
      <div @click="addDelayNode">
        <el-icon style="color: #f25643"><clock/></el-icon>
        <span>延迟等待</span>
      </div>
      <div @click="addTriggerNode">
        <el-icon style="color: #15bc83"><SetUp/></el-icon>
        <span>触发器</span>
      </div>
    </div>
    <template #reference>
      <el-button icon="plus" type="primary" size="default" circle></el-button>
    </template>
  </el-popover>
</template>

<script>
export default {
  name: 'InsertButton',
  components: {},
  data() {
    return {}
  },
  computed: {
    selectedNode() {
      this.$store.state.selectedNode
    },
    isSubProc(){
      return this.$store.state.design.isSubProc || false;
    }
  },
  methods: {
    addApprovalNode() {
      this.$emit('insertNode', 'APPROVAL')
    },
    addCcNode() {
      this.$emit('insertNode', 'CC')
    },
    addDelayNode() {
      this.$emit('insertNode', 'DELAY')
    },
    addConditionsNode() {
      this.$emit('insertNode', 'CONDITIONS')
    },
    addInclusivesNode(){
      this.$emit('insertNode', "INCLUSIVES")
    },
    addTaskNode(){
      this.$emit('insertNode', "TASK")
    },
    addConcurrentsNode() {
      this.$emit('insertNode', 'CONCURRENTS')
    },
    addTriggerNode() {
      this.$emit('insertNode', 'TRIGGER')
    },
    addSubProcNode(){
      this.$emit('insertNode', "SUBPROC")
    }
  },
  emits: ['insertNode'],
}
</script>

<style lang="less" scoped>
.node-select {
  display: flex;
  flex-wrap: wrap;
  div {
    display: flex;
    align-items: center;
    margin: 5px 5px;
    cursor: pointer;
    padding: 6px 10px;
    border: 1px solid #f8f9f9;
    background-color: #f8f9f9;
    border-radius: 10px;
    width: 100px;
    position: relative;
    span{
      margin-left: 5px;
    }
    &:hover {
      background-color: #fff;
      box-shadow: 0 0 8px 2px #d6d6d6;
      transition: box-shadow 0.3s;
    }
    :deep(.el-icon) {
      font-size: 23px;
      padding: 5px;
      border: 1px solid #dedfdf;
      border-radius: 14px;
    }
  }
}
</style>
