<template>
  <div :class="{ avatar: true, 'show-y': showY }">
    <div class="a-img">
      <template v-if="type === 'user'">
        <el-avatar v-if="src" :size="size" :src="src" />
        <div v-else :style="{ '--bgc': bgc, '--size': size + 'px' }">
          <span>{{ alisa }}</span>
        </div>
      </template>
      <el-avatar v-else-if="type === 'dept'" style="background: #f78f5f" icon="histogram" :size="size"/>
      <el-avatar v-else icon="UserFilled" style="background: #576a95" :size="size"/>
      <el-icon class="close" v-if="closeable" @click="$emit('close')"><Close/></el-icon>
      <iconify :class="['status', status]" v-show="status" :icon="statusIcon"/>
    </div>
    <div class="name" v-if="!showY && showName">{{ name }}</div>
    <ellipsis hoverTip class="name" v-show="showName" :style="{ width: size + 10 + 'px' }" :content="name" v-else/>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  install(Vue) {
    window.$vueApp.component('avatar', this)
  },
  components: {},
  props: {
    type: {
      type: String,
      default: 'user',
    },
    name: {
      type: String,
      default: '未知',
    },
    size: {
      type: Number,
      default: 40,
    },
    src: {
      type: String,
      default: undefined,
    },
    bgc: {
      type: String,
      default: '#1989fa',
    },
    square: {
      type: Boolean,
      default: false,
    },
    showY: {
      type: Boolean,
      default: false,
    },
    showName: {
      type: Boolean,
      default: true,
    },
    closeable: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
    },
  },
  computed: {
    alisa() {
      return this.name.length > 2
        ? this.name.substring(this.name.length - 2, this.name.length)
        : this.name
    },
    statusIcon() {
      switch (this.status) {
        case 'error':
          return 'solar:close-circle-bold'
        case 'pending':
          return 'mingcute:time-fill'
        case 'success':
          return 'ep:success-filled'
        case 'cc':
          return 'bxs:paper-plane'
        case 'comment':
          return 'iconamoon:comment-dots-fill'
        case 'transfer':
          return 'fluent:people-swap-20-filled'
        case 'cancel':
          return 'eva:undo-fill'
        case 'recall':
          return 'material-symbols:assignment-return'
        case 'leader':
          return 'eos-icons:admin'
        case 'waiting':
          return 'eos-icons:bubble-loading';
        default:
          return null
      }
    },
  },
  data() {
    return {}
  },
  methods: {},
  emits: ['close'],
}
</script>

<style lang="less" scoped>
.show-y {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column !important;
  .name {
    margin-left: 0 !important;
  }
}
.close {
  position: absolute;
  top: 0;
  right: -2px;
  color: #ffffff;
  cursor: pointer;
  border-radius: 50%;
  background: black;
}
.avatar {
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  .a-img {
    display: flex;
    border-radius: 50%;
    flex-direction: column;
    justify-content: center;
    background: white;
    position: relative;

    & > div {
      display: inline-block;
      text-align: center;
      background: var(--bgc);
      color: white;
      border-radius: 50%;
      width: var(--size);
      height: var(--size);
      line-height: var(--size);
      font-size: 14px;
    }
  }
  :deep(.el-avatar) {
    background: white;
  }

  .name {
    text-align: center;
    color: #19191a;
    font-size: 14px;
    margin-left: 10px;
  }
}
.status {
  position: absolute;
  bottom: -4px;
  right: -8px;
  border-radius: 50%;
  font-size: 15px;
  background: white;
  border: 2px solid white;
}
.error {
  color: @theme-danger !important;;
}
.leader {
  font-size: 12px;
  color: @theme-warning !important;;
}
.pending {
  color: @theme-warning !important;
}
.success {
  color: @theme-success !important;;
}
.transfer {
  color: white;
  background: #7a939d;
  font-size: 12px;
  padding: 1px;
}
.comment {
  color: @theme-primary !important;;
}
.cc {
  color: white;
  font-size: 12px;
  padding: 1px;
  background: @theme-primary !important;;
}
.cancel {
  color: #838383 !important;;
}
.recall {
  color: #f56c6c !important;;
}
</style>
