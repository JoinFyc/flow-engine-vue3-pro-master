<template>
  <div v-loading="loading">
    <instance-search v-model="params" :show-finished="false" :show-keyword="false"/>
    <el-table :data="dataList" :header-cell-style="{ background: '#e8e8e8' }" style="width: 100%; margin: 20px 0"
              @row-click="showProcess">
      <el-table-column fixed prop="processDefName" label="审批类型" show-overflow-tooltip>
        <template v-slot="scope">
          <el-tag size="small" type="success" v-if="scope.row.superInstanceId !== scope.row.instanceId">子</el-tag>
          <span style="margin-left: 5px">{{ scope.row.processDefName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="formAbstracts" show-overflow-tooltip label="摘要信息" min-width="110px">
        <template v-slot="scope">
          <form-abstracts :value="scope.row.formAbstracts"/>
        </template>
      </el-table-column>
      <el-table-column prop="staterUser" show-overflow-tooltip label="发起人" min-width="100px">
        <template v-slot="scope">
          <w-avatar :size="35" :name="scope.row.staterUser.name" :src="scope.row.staterUser.avatar"/>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="startTime" label="提交时间" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="finishTime" label="结束时间" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="taskName" label="当前节点">
      </el-table-column>
      <el-table-column prop="status" label="审批状态">
        <template v-slot="scope">
          <el-tag :type="getProcTag(scope.row.result)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="duration" label="已耗时" min-width="120px">
        <template v-slot="scope">{{ getDuration(scope.row) }}</template>
      </el-table-column>
    </el-table>
    <div style="text-align: right">
      <el-pagination hide-on-single-page background layout="prev, pager, next" :total="total"
                     :page-size="params.pageSize" v-model:current-page="params.pageNo"></el-pagination>
    </div>
    <el-drawer :size="isMobile ? '100%' : '500px'" direction="rtl" title="审批详情" v-model="processVisible">
      <instance-preview v-if="processVisible" :node-id="selectInstance.nodeId"
                        :instance-id="selectInstance.instanceId"></instance-preview>
    </el-drawer>
  </div>
</template>

<script>
import taskApi from '@/api/modelGroup'
import moment from 'moment'
import InstancePreview from '../approval/ProcessInstancePreview.vue'
import {getProcTag} from "@/utils/ProcessUtil.js";
import FormAbstracts from "./FormAbstracts.vue";
import InstanceSearch from "../../common/InstanceSearch.vue";

export default {
  name: 'CcMe',
  components: {InstancePreview, FormAbstracts, InstanceSearch},
  data() {
    return {
      total: 0,
      params: {
        pageSize: 10,
        pageNo: 1,
        finished: null,
        code: '',
        startTimes: []
      },
      selectInstance: {},
      loading: false,
      processVisible: false,
      formList: [],
      dataList: [],
    }
  },
  computed: {
    isMobile() {
      return window.screen.width < 450
    },
  },
  mounted() {
    this.getCcMeList()
  },
  methods: {
    getProcTag,
    getCcMeList() {
      this.loading = true
      const params = Object.assign({}, this.params)
      params.startTimes = String(params.startTimes)
      taskApi.getCcMeList(params).then((rsp) => {
        this.loading = false
        this.total = rsp.data.total
        this.dataList = rsp.data.records
      }).catch((e) => {
        this.loading = false
      })
    },
    showProcess(row) {
      this.processVisible = true
      this.selectInstance = row
    },
    getDuration(row) {
      let end = this.$isNotEmpty(row.finishTime)
        ? row.finishTime
        : moment().format('YYYY-MM-DD HH:mm:ss')
      return this.$timeCoverStr(row.startTime, end)
    },
  },
  watch: {
    params: {
      deep: true,
      handler() {
        this.getCcMeList()
      },
    },
  },
}
</script>

<style scoped></style>
