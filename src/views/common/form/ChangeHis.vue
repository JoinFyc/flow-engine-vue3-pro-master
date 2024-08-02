<script>
import {getFormFieldHis} from "@/api/process";
import DefaultPrintItem from "../../workspace/approval/DefaultPrintFormItem.vue";

export default {
  name: "ChangeHis",
  components: {DefaultPrintItem},
  props: {
    instanceId: String,
    conf: Object,
  },
  data() {
    return {
      fieldHis: []
    }
  },
  methods: {
    showFieldHis() {
      getFormFieldHis(this.instanceId, this.conf.id).then(res => {
        this.fieldHis = res.data.map(v => {
         try {
            v.oldValue = JSON.parse(v.oldValue)
          } catch (e) {}
          try {
            v.newValue = JSON.parse(v.newValue)
          } catch (e) {}
          return v
        })
      }).catch(err => {
        this.$err(err, '获取字段历史记录失败')
      })
    }
  }
}
</script>

<template>
  <el-popover placement="right" title="变更记录" width="350" trigger="click">
    <template #reference>
      <span style="cursor: pointer" @click="showFieldHis">{{ conf.title }}</span>
    </template>
    <el-timeline :reverse="false" v-if="fieldHis.length > 0">
      <el-timeline-item v-for="(his, index) in fieldHis" :key="index" :timestamp="his.createTime">
        <div class="w-his-title">
          <avatar :src="his.updateBy.avatar" :name="his.updateBy.name" :size="25"/>
          <span> 修改了值</span>
        </div>
        <div class="w-his-content">
          <default-print-item :data="his.oldValue" :config="conf"/>
          <span style="color: #9b9595; font-size: small"> 改为 </span>
          <default-print-item :data="his.newValue" :config="conf"/>
        </div>
      </el-timeline-item>
    </el-timeline>
    <div v-else style="color: #9b9595; font-size: small; text-align: center">暂无修改记录</div>
  </el-popover>
</template>

<style scoped lang="less">
.w-his-title {
  display: flex;
  align-items: center;
  span {
    margin-left: 5px;
  }
}

.w-his-content {
  background: #f3f3f3;
  padding: 2px 5px;
  border-radius: 5px;
}
</style>
