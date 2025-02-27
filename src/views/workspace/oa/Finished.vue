<template>
  <div v-loading="loading">
    <instance-search v-model="params" :show-finished="false" :show-keyword="false" :show-start-times="false"/>
    <el-table :data="dataList" :header-cell-style="{ background: '#e8e8e8' }" style="width: 100%; margin: 20px 0" @row-click="showProcess">
      <el-table-column fixed prop="processDefName" label="审批类型" show-overflow-tooltip>
        <template v-slot="scope">
          <el-tag size="small" type="success" v-if="scope.row.superInstanceId !== scope.row.instanceId">子</el-tag>
          <span style="margin-left: 5px">{{scope.row.processDefName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="formAbstracts" show-overflow-tooltip label="摘要信息" min-width="110px">
        <template v-slot="scope">
          <form-abstracts :value="scope.row.formAbstracts"/>
        </template>
      </el-table-column>
      <el-table-column prop="owner" show-overflow-tooltip label="发起人" min-width="100px">
        <template v-slot="scope">
          <w-avatar :size="35" :name="scope.row.owner.name" :src="scope.row.owner.avatar"/>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="taskName" label="任务节点名"/>
      <el-table-column show-overflow-tooltip prop="taskCreateTime" label="任务开始时间" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="taskEndTime" label="处理完成时间" min-width="120px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="duration" label="处理耗时" min-width="120px">
        <template v-slot="scope">
          {{ getDuration(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="处理结果">
        <template v-slot="scope">
          <el-tag :type="getTaskResult({result: scope.row.taskResult, finishTime: scope.row.taskEndTime}).type">
            {{getTaskResult({result: scope.row.taskResult, finishTime: scope.row.taskEndTime}).text}}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right">
      <el-pagination hide-on-single-page background layout="prev, pager, next" :total="total" :page-size="params.pageSize" v-model:current-page="params.pageNo"></el-pagination>
    </div>
    <el-drawer :size="isMobile ? '100%' : '500px'" direction="rtl" title="审批详情" v-model="processVisible">
      <instance-preview v-if="processVisible" :instance-id="selectInstance.instanceId" @handler-after="handlerAfter"></instance-preview>
    </el-drawer>

    <w-dialog v-if="!isMobile" :title="`发起 - ${selectInstance.processDefName}`" closeFree
              width="1000px" v-model="openItemDl" okText="提 交"
              @cancel="openItemDl = false" @ok="submitForm">
      <initiate-process ref="processForm" :node-id="selectInstance.nodeId"
                        :instance-id="selectInstance.instanceId" :code="selectInstance.formId"
                        v-if="openItemDl" @ok="openItemDl = false"></initiate-process>
    </w-dialog>
  </div>
</template>

<script>
import taskApi from '@/api/processTask'
import moment from 'moment'
import InstancePreview from '../approval/ProcessInstancePreview.vue'
import InitiateProcess from '../InitiateProcess.vue'
import {getTaskResult} from "@/utils/ProcessUtil.js";
import FormAbstracts from "./FormAbstracts.vue";
import InstanceSearch from "../../common/InstanceSearch.vue";

export default {
  name: 'Finished',
  components: { InstancePreview, InitiateProcess, FormAbstracts, InstanceSearch },
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
      openItemDl: false,
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
    this.getIdoList()
  },
  methods: {
    getTaskResult,
    getIdoList() {
      this.loading = true
      taskApi
        .getIdoList(this.params)
        .then((rsp) => {
          this.loading = false
          this.total = rsp.data.total
          this.dataList = rsp.data.records
        })
        .catch((e) => {
          this.loading = false
        })
    },
    reSubmit(row) {
      this.selectInstance = row
      this.openItemDl = true
      if (this.isMobile) {
        this.$router.push(
          `/mbinitiate?code=${row.formId}&instanceId=${row.instanceId}`
        )
      }
    },
    submitForm() {
      this.$refs.processForm.validate((validForm, validProcess) => {
        if (!this.isMobile){
          if (validForm && validProcess) {
            this.$refs.processForm.submit()
          } else {
            this.$message.warning("请完善表单/流程选项😥")
          }
        }
      })
    },
    showProcess(row) {
      this.processVisible = true
      this.selectInstance = row
    },
    getDuration(row) {
      let end = this.$isNotEmpty(row.taskEndTime)
        ? row.taskEndTime
        : moment().format('YYYY-MM-DD HH:mm:ss')
      return this.$timeCoverStr(row.createTime, end)
    },
    handlerAfter() {
      this.processVisible = false
      this.getIdoList()
    },
  },
  watch: {
    params: {
      deep: true,
      handler() {
        this.getIdoList()
      },
    },
  },
}
</script>

<style scoped></style>
