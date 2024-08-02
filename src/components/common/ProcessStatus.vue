<template>
  <div v-if="!isTask">
    <el-tag type="primary" :size="size" v-if="instance.result === 'RUNNING'">{{instance.status}}</el-tag>
    <el-tag type="danger" :size="size" v-else-if="instance.result === 'REFUSE'">{{instance.status}}</el-tag>
    <el-tag type="info" :size="size" v-else-if="instance.result === 'CANCEL'">{{instance.status}}</el-tag>
    <el-tag type="success" :size="size" v-else>审批通过</el-tag>
  </div>
  <el-tag v-else :type="(taskStatus[instance.taskResult] || {}).type">
    {{ (taskStatus[instance.taskResult] || {}).text }}
  </el-tag>
</template>

<script>
export default {
  name: 'ProcessStatus',
  components: {},
  props: {
    instance: {
      type: Object,
      default: () => {
        return {}
      },
    },
    size: {
      type: String,
      default: 'medium',
    },
    isTask: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      taskStatus: {
        agree: { type: 'success', text: '已同意' },
        complete: {type: 'success', text: '已办理'},
        refuse: { type: 'danger', text: '已拒绝' },
        recall: { type: 'warning', text: '已退回' },
        transfer: { type: 'primary', text: '已转交' },
      },
    }
  },
  methods: {},
}
</script>

<style scoped></style>
