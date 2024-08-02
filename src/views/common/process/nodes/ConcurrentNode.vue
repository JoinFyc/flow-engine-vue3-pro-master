<template>
  <div :class="{ node: true, 'node-error-state': showError }">
    <div :class="{ 'node-body': true, error: showError }">
      <div class="node-body-left" @click.stop="$emit('leftMove')" v-if="level > 1">
        <el-icon><ArrowLeft/></el-icon>
      </div>
      <div class="node-body-main">
        <div class="node-body-main-header">
          <span class="title">
            <el-icon><operation/></el-icon>
            <ellipsis class="name" @click.native="enableEdit = true" hover-tip v-if="!enableEdit" :content="config.name ? config.name : '并行任务' + level"/>
            <el-input v-else autofocus v-model="config.name" @blur="enableEdit = false"/>
          </span>
          <span class="option">
            <el-tooltip effect="dark" content="复制分支" placement="top">
              <el-icon @click="$emit('copy')"><CopyDocument/></el-icon>
            </el-tooltip>
            <el-icon @click.stop="$emit('delNode')"><close/></el-icon>
          </span>
        </div>
        <div class="node-body-main-content" @click="$emit('selected')">
          <span>并行任务（同时进行）</span>
        </div>
      </div>
      <div class="node-body-right" @click.stop="$emit('rightMove')" v-if="level < size">
        <el-icon><ArrowRight/></el-icon>
      </div>
      <div class="node-error" v-if="showError">
        <el-tooltip effect="dark" :content="errorInfo" placement="top-start">
          <el-icon><warning/></el-icon>
        </el-tooltip>
      </div>
    </div>
    <div class="node-footer">
      <div class="btn">
        <insert-button @insertNode="(type) => $emit('insertNode', type)"></insert-button>
      </div>
    </div>
  </div>
</template>

<script>
import InsertButton from '@/views/common/InsertButton.vue'

export default {
  name: 'ConcurrentNode',
  components: { InsertButton },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      },
    },
    level: {
      type: Number,
      default: 1,
    },
    //条件数
    size: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      errorInfo: '',
      showError: false,
      enableEdit: false
    }
  },
  methods: {
    //校验数据配置的合法性
    validate(err) {
      try {
        this.showError =
          !this.config.children || !this.$isNotEmpty(this.config.children.id)
        if (this.showError) {
          err.push(`并行分支${this.config.name}下面无节点`)
          this.errorInfo = '请添加业务节点'
        }
        return this.showError
      } catch (e) {
        return true
      }
    },
  },
  emits: ['selected', 'leftMove', 'copy', 'delNode', 'rightMove', 'insertNode'],
}
</script>

<style lang="less" scoped>
.node-error-state {
  .node-body {
    box-shadow: 0px 0px 5px 0px #f56c6c !important;
  }
}
.node {
  padding: 30px 55px 0;
  width: 220px;
  :deep(.el-input) {
    width: 80%;
    .el-input__inner{
      padding: 0 !important;
      font-size: 12px;
      height: 20px;
    }
  }
  .node-body {
    cursor: pointer;
    min-height: 80px;
    max-height: 120px;
    position: relative;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 0px 5px 0px #d8d8d8;
    &:hover {
      .node-body-left,
      .node-body-right {
        :deep(.el-icon) {
          display: block !important;
        }
      }
      .node-body-main {
        .option {
          display: inline-block !important;
        }
      }
      box-shadow: 0px 0px 3px 0px @theme-primary;
    }
    .node-body-left,
    .node-body-right {
      display: flex;
      align-items: center;
      position: absolute;
      height: 100%;
      :deep(.el-icon) {
        display: none;
      }
      &:hover {
        background-color: #ececec;
      }
    }
    .node-body-left {
      left: 0;
    }
    .node-body-right {
      right: 0;
    }
    .node-body-main {
      position: absolute;
      width: 188px;
      left: 17px;
      display: inline-block;

      .node-body-main-header {
        padding: 5px 0px 5px;
        font-size: xx-small;
        position: relative;
        :deep(.title) {
          color: #718dff;
          width: 125px;
          padding: 5px;
          display: flex;
          .name {
            display: inline-block;
            height: 14px;
            width: 130px;
            margin-left: 2px;
          }
          .el-icon{
            font-size: 15px;
            margin-right: 5px;
          }
        }
        .option {
          position: absolute;
          right: 0;
          top: 10px;
          display: none;
          font-size: medium;
          :deep(.el-icon) {
            color: #888888;
            padding: 0 3px;
          }
        }
      }
      .node-body-main-content {
        padding: 6px;
        color: #656363;
        font-size: 14px;

        :deep(.el-icon) {
          position: absolute;
          top: 55%;
          right: 10px;
          font-size: medium;
        }
      }
    }
    .node-error {
      position: absolute;
      right: -40px;
      top: 20px;
      font-size: 25px;
      color: #f56c6c;
    }
  }

  .node-footer {
    position: relative;
    .btn {
      width: 100%;
      display: flex;
      height: 70px;
      padding: 20px 0 32px;
      justify-content: center;
    }
    :deep(.el-button) {
      height: 32px;
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #cacaca;
    }
  }
}
</style>
