<template>
  <el-input v-model="modelValue.compareVal[0]" placeholder="输入比较值"></el-input>
</template>
<script>
export default {
  name: "StrArrCompare",
  components: {},
  props: {
    modelValue:{
      require: true,
      type: Object
    }
  }
}
</script>
