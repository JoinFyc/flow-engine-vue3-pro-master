<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component }" v-if="!$route.meta.keepAlive">
      <transition name="router-fade" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </el-config-provider>
</template>

<script>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
export default {
  components: {},
  data() {
    return {
      zhCn
    }
  },
  mounted() {
  },
  methods: {},
}
</script>

<style lang="less">
:focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.el-drawer__body{
  padding: 0 !important;
}

body {
  margin: 0;
  min-width: 300px;
  background-color: #f5f6f6;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

body,
html {
  margin: 0;
  height: 100%;
}

ul {
  padding: 0;
  margin: 0;

  li {
    list-style-type: none;
  }
}

.item-desc {
  font-size: small;
  color: #5e5e5e;
}

.max-fill {
  width: 100% !important;
}

::-webkit-scrollbar {
  width: 0;
  height: 10px;
  background-color: white;
}

::-webkit-scrollbar-thumb {
  width: 0;
  height: 10px;
  border-radius: 16px;
  background-color: #d9d9d9;
}
</style>
