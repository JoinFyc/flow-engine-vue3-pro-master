<template>
  <div class="data-list">
    <div
      class="m-process-item"
      v-for="(item, i) in datas"
      :key="i"
      @click="$emit('click', item)"
    >
      <w-avatar
        style="width: 27%"
        :size="35"
        :name="(item.staterUser || item.owner || {}).name"
        :src="(item.staterUser || item.owner || {}).avatar"
      />
      <div>
        <span class="process-item-title">提交的 {{ item.processDefName }}</span>
        <div class="process-item-time">
          {{ item.startTime || item.createTime }}
        </div>
      </div>
      <process-status
        v-if="type !== 'UNDO'"
        :is-task="type === 'DONE'"
        size="small"
        :instance="item"
        class="process-item-status"
      />
    </div>
  </div>
</template>

<script>
import ProcessStatus from '@/components/common/ProcessStatus.vue'
export default {
  name: 'MProcessItem',
  components: { ProcessStatus },
  props: {
    datas: {
      type: Array,
      default: () => {
        return []
      },
    },
    type: {
      type: String,
    },
  },
  data() {
    return {}
  },
  methods: {},
  emits: ['click'],
}
</script>

<style lang="less" scoped>
.data-list {
  min-height: 80vh;
  background: #f7f7f9;
}
.m-process-item {
  padding: 0.4rem 1rem;
  background: white;
  border-bottom: 1px solid #f3f3f3;
  position: relative;
  .process-item-title {
    position: absolute;
    top: 5px;
    left: 120px;
    font-size: 14px;
  }
  .process-item-status {
    position: absolute;
    right: 20px;
    top: 13px;
  }
  .process-item-time {
    font-size: small;
    color: #858484;
    position: absolute;
    bottom: 5px;
    left: 120px;
  }
}
</style>
