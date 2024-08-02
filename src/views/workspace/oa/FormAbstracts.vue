<script>

export default {
  name: "FormAbstracts",
  methods: {
    getTextVal(obj){
      switch (obj.type) {
        case 'DeptPicker':
        case 'UserPicker':
        case 'FileUpload':
        case 'ImageUpload':
          return (obj.value || []).map(v => v.name).join('、');
        case 'TimeRangePicker':
        case 'DateTimeRange':
        case 'SelectPlus':
        case 'MultipleSelect':
          return (obj.value || []).join('、');
        case 'ProcessIndex':
          return (obj.value || []).map(v => v.startUser.name + '-' + v.name).join('、');
        default:
          return obj.value;
      }
    }
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
}
</script>

<template>
<div>
  <div v-for="val in value" class="w-field">
    <span>{{val.name}}：</span>
    <span>{{getTextVal(val)}}</span>
  </div>
  <span v-if="value.length === 0">无</span>
</div>
</template>

<style scoped lang="less">
.w-field {
  height: 16px;
  line-height: 16px;
  font-size: 13px;
  & > span:first-child{
    color: #9b9595;
  }
}
</style>
