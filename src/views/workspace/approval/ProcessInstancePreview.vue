<template>
  <div v-loading="loading" class="preview">
    <div v-if="instanceData.instanceId">
      <div class="title">
        <div v-if="instanceData.staterUser">
          <w-avatar showY :name="instanceData.staterUser.name" :src="instanceData.staterUser.avatar"/>
        </div>
        <div class="title-info">
          <div class="name">
            <span style="margin-right: 15px; color:#000;">{{ instanceData.processDefName }}</span>
            <el-tag :type="status.type">{{ status.text }}</el-tag>
          </div>
          <div class="code">
            <span style="color:#6c6c6c;">编号：</span>
            <span class="id">{{ instanceData.instanceId }}</span>
          </div>
          <img v-if="status.img" :src="status.img" :style="isMobile ? 'right: -20px':''">
          <!--          <div style="font-size: 13px; color: rgb(142 141 141)" v-if="instanceData.staterUser">
                        由 {{instanceData.staterUser.name}} 在{{instanceData.startTime}}发起
                      </div>-->
        </div>
        <div class="extend-options" v-if="!isMobile">
          <el-tooltip class="item" effect="dark" content="打印" placement="top-start">
            <el-icon @click="print" class="icon"><Printer/></el-icon>
          </el-tooltip>
        </div>
      </div>
      <div class="form">
        <form-render class="process-form" :config="instanceData.formConfig" :mode="isMobile ? 'MOBILE' : 'PC'" ref="form"
                     :instance-id="instanceData.instanceId" :forms="instanceData.formItems" v-model="instanceData.formData"/>
      </div>
      <div class="process">
        <process-progress :result="instanceData.result" :status="instanceData.status" :progress="instanceData.progress"/>
      </div>
    </div>
    <div class="actions" v-if="instanceData.result === 'RUNNING'">
      <div style="position: relative; width: 100%">
        <div class="comment" @click="comment">
          <el-icon class="icon"><ChatLineRound/></el-icon>
          <div>评论</div>
        </div>
        <template v-if="instanceData.operationPerm">
          <div v-if="activeTasks.length > 0 && showMore" class="action-more">
            <el-dropdown>
              <el-button type="primary" link>
                更多<el-icon><ArrowDown/></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="opPerms?.transfer?.show" @click="handler('transfer')">
                    <iconify icon="fluent:people-swap-20-filled" style="font-size: 18px; margin-right: 5px"/>
                    {{opPerms?.transfer?.alisa}}
                  </el-dropdown-item>
                  <el-dropdown-item v-if="opPerms?.recall?.show" @click="handler('recall')">
                    <iconify icon="material-symbols:assignment-return" style="font-size: 18px; margin-right: 5px"/>
                    {{opPerms?.recall?.alisa}}
                  </el-dropdown-item>
                  <el-dropdown-item v-if="opPerms?.afterAdd?.show" @click="handler('afterAdd')">
                    <iconify icon="material-symbols:person-add" style="font-size: 18px; margin-right: 5px"/>
                    {{opPerms?.afterAdd?.alisa}}
                  </el-dropdown-item>
                  <el-dropdown-item v-if="enableCancel" @click.native="handler('cancel')">
                    <iconify icon="eva:undo-fill" style="font-size: 18px; margin-right: 5px"/>
                    撤销
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-if="activeTasks.length > 0" class="ok-refuse">
            <el-button type="danger" v-if="opPerms?.refuse?.show" round plain @click="handler('refuse')">{{opPerms?.refuse?.alisa}}</el-button>
            <el-button type="primary" v-if="opPerms?.agree?.show" round @click="handler('agree')">{{opPerms?.agree?.alisa}}</el-button>
            <el-button type="primary" v-else-if="opPerms?.complete?.show" round @click="handler('complete')">{{opPerms?.complete?.alisa}}</el-button>
          </div>
        </template>
        <div class="cancel" v-else-if="enableCancel">
          <el-button type="primary" link @click="handler('cancel')">
            <el-icon><RefreshLeft/></el-icon>
            撤销
          </el-button>
        </div>

      </div>
    </div>
    <w-dialog v-model="printVisible" width="700px" title="打印预览" okText="打 印" @ok="doPrint">
      <template #title>
        <div>
          <span>打印预览</span>
          <el-radio-group style="margin: 0 30px" v-model="printCheck" @change="renderPrint" v-if="printTemplateConfig.customPrint">
            <el-radio :label="false">默认模板</el-radio>
            <el-radio :label="true">自定义模板</el-radio>
          </el-radio-group>
        </div>
      </template>
      <div v-if="printCheck" id="printDom" ref="print" v-html="printTemplateConfig.printTemplate"></div>
      <default-printer v-else ref="print" :status="status" :instance="instanceData"/>
    </w-dialog>
    <w-dialog v-model="actionVisible" :width="isMobile ? '100%' : '500px'" :title="actionDesc.title" okText="提 交" @ok="doAction">
      <process-action ref="action" @success="handlerOk" @fail="actionLoading = false" :form-data="formData" v-if="actionVisible"
        :active-tasks="activeTasks" :instance="instanceData" :action="actionType" :action-desc="actionDesc" show-sign/>
    </w-dialog>
  </div>
</template>

<script>
import FormRender from '@/views/common/form/FormRender.vue'
import ProcessProgress from './ProcessProgress.vue'
import ProcessAction from './ProcessAction.vue'
import { getFormAndProcessProgress } from '@/api/processTask'
import { getCustomPrintConfig } from '@/api/process'
import moment from 'moment'
import {showFailToast} from 'vant'
import Print, { bindVar, getVal } from '@/utils/print'
import DefaultPrinter from './DefaultPrinter.vue'

export default {
  name: 'ProcessInstancePreview',
  components: { DefaultPrinter, FormRender, ProcessProgress, ProcessAction },
  props: {
    instanceId: {
      type: String,
      required: true,
    },
    nodeId: {
      type: String,
      required: false,
    },
  },
  computed: {
    loginUser() {
      return this.$store.state.loginUser
    },
    isRootUser(){
      return this.instanceData?.staterUser?.id === this.loginUser?.id
    },
    enableCancel(){
      try {
        return this.instanceData.externSetting.enableCancel
      } catch (e) {
        return false
      }
    },
    isMobile() {
      return window.screen.width < 450
    },
    opPerms(){
      const opPerms = this.instanceData.operationPerm || {}
      for(let key in opPerms){
        if (!opPerms[key]){
          opPerms[key] = {alisa: '', show: false}
        }
      }
      return opPerms
    },
    showMore(){
      return this.opPerms?.transfer?.show || this.opPerms?.recall?.show
              || this.opPerms?.afterAdd?.show || this.enableCancel
    },
    formatFormData() {
      let val = {}
      getVal(this.instanceData.formData || {}, this.instanceData.formItems || [], val)
      val.ownerDept = this.instanceData.starterDept
      val.owner = this.instanceData.staterUser.name
      val.startTime = this.instanceData.startTime
      val.finishTime = this.instanceData.finishTime
      val.code = this.instanceData.instanceId
      return val
    },
    status() {
      let status = {
        text: this.instanceData.status
      }
      switch (this.instanceData.result){
        case 'RUNNING':
        case 'COMPLETE':
          status.type = ''
          status.img = null
          break
        case 'PASS':
          status.type = 'success'
          status.img = this.$getLocalRes('agree.png')
          break
        case 'CANCEL':
          status.type = 'info'
          status.img = this.$getLocalRes('recall.png')
          break
        case 'REFUSE':
          status.type = 'danger'
          status.img = this.$getLocalRes('refuse.png')
          break
      }
      return status
    },
    activeTasks() {
      let tasks = [];
      (this.instanceData.progress || []).forEach(task => {
        if (task.users) {
          task.users.forEach(tk => {
            if (this.isMyTask(tk)) {
              tasks.push(tk)
            }
          })
        } else {
          if (this.isMyTask(task)) {
            tasks.push(task)
          }
        }
      })
      return tasks;
    },
    formData() {
      //过滤出可编辑的表单字段
      let formFields = []
      let formData = {}
      this.getEnableEditForm(this.instanceData.formItems || [], formFields)
      formFields.forEach((k) => {
        formData[k] = this.instanceData.formData[k]
      })
      return formData
    },
    actionDesc() {
      switch (this.actionType) {
        case 'agree':
          return {tip: this.isRootUser? '备注':'审批意见', title: this.isRootUser?'提交审批':'同意审批'};
        case 'refuse':
          return { tip: '驳回意见', title: '拒绝审批' }
        case 'complete':
          return { tip: '办理意见', title: '办理任务' }
        case 'comment':
          return { tip: '评论内容', title: '添加评论' }
        case 'beforeAdd':
          return { tip: '加签意见', title: '前方增加审批人' }
        case 'afterAdd':
          return { tip: '加签意见', title: '后方增加审批人' }
        case 'transfer':
          return { tip: '转交意见', title: '转交给其他人审批' }
        case 'cancel':
          return { tip: '撤销原因', title: '撤销当前流程' }
        case 'recall':
          return { tip: '退回意见', title: '退回到之前节点' }
      }
    },
  },
  data() {
    return {
      printVisible: false,
      actionVisible: false,
      printCheck: false,
      loading: false,
      actionLoading: false,
      actionType: 'agree',
      instanceData: {},
      agreeVisible: false,
      printTemplateConfig: {
        customPrint: false,
        printTemplate: '',
      },
    }
  },
  mounted() {
    this.getInstanceData()
    this.getPrintConfig()
  },
  methods: {
    isMyTask(task){
      return !task.isFuture && task.user && task.user.id === this.loginUser.id && !this.$isNotEmpty(task.finishTime)
    },
    //根据退回进行分段拆解
    splitByRecall(progress) {
      //提取分段时间点
      let points = progress
        .filter((p) => p.result === 'recall')
        .map((p) => new Date(p.startTime).getTime())
      if (points.length > 0) {
        let blocks = [] //分段流程块组
        let pointer = 0 //定点索引
        points.push(new Date().getTime())
        points.forEach((point) => {
          let block = []
          for (let i = pointer; i < progress.length; i++) {
            let startTime = new Date(progress[i].startTime).getTime()
            if (startTime <= point) {
              block.push(progress[i])
            } else {
              pointer = i
              break
            }
          }
          //存段
          blocks.push(block)
        })
        //按段处理
        let processNodes = []
        blocks.forEach((block) => processNodes.push(...this.mergeTask(block)))
        return processNodes
      }
      return this.mergeTask(progress)
    },
    isMergeNode(n, pg){
      //节点合并条件，满足以下条件就合并节点，目前规则是如果节点ID相同，且时间相差在2S内，则认为该俩节点
      return n.nodeId === pg.nodeId && Math.abs(moment(n.startTime).diff(moment(pg.startTime))) <= 2000
    },
    //合并活动节点，此处执行一段合并算法用来处理退回导致节点重合的问题
    mergeTask(progress) {
      let merge = []
      progress.forEach((pg) => {
        let i = merge.findIndex((n) => this.isMergeNode(n, pg))
        if (i > -1) {
          //存在则合并到对象
          if (merge[i].users) {
            //已经合并过了
            merge[i].finishTime = pg.finishTime
            merge[i].users.push(pg)
            merge[i].result = this.getApprovalResult(
              merge[i],
              pg,
              pg.approvalMode
            )
            merge[i].comment = merge[i].comment.concat(pg.comment)
          } else {
            //没有就合并
            merge[i] = {
              agree: null,
              name: pg.name,
              isFuture: pg.isFuture,
              nodeType: pg.nodeType,
              approvalMode: pg.approvalMode,
              nodeId: pg.nodeId,
              result: this.getApprovalResult(merge[i], pg, pg.approvalMode),
              startTime: merge[i].startTime,
              finishTime: pg.finishTime,
              comment: merge[i].comment.concat(pg.comment),
              users: [merge[i], pg],
            }
            merge[i].comment = merge[i].comment.sort(
              (a, b) => moment(a.createTime) - moment(b.createTime)
            )
          }
        } else {
          merge.push(pg)
        }
      })
      return merge
    },
    getInstanceData() {
      this.loading = true
      getFormAndProcessProgress(this.instanceId, this.nodeId)
        .then((rsp) => {
          this.loading = false
          this.instanceData = rsp.data
          this.instanceData.progress = this.splitByRecall(rsp.data.progress)
        })
        .catch((err) => {
          this.loading = false
          this.$err(err, '获取审批实例数据失败')
        })
    },
    getApprovalResult(oldVal, newVal, mode) {
      if (mode === 'OR') {
        return newVal.result ? newVal.result : oldVal.result
      } else if (mode === 'AND') {
        let rs = oldVal.result || newVal.result
        return rs === 'recall' ? 'recall' : rs
      } else {
        return newVal.result
      }
    },
    comment() {
      this.actionType = 'comment'
      this.actionVisible = true
    },
    handler(action) {
      this.actionType = action
      this.actionVisible = true
    },
    doAction() {
      //只有审批同意或者提交才做表单校验
      if (this.actionType === 'agree' || this.actionType === 'complete') {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$refs.action.submitAction()
          } else {
            this.actionVisible = false
            if (this.isMobile) {
              showFailToast('请完善表单')
            } else {
              this.$message.warning('请完善表单')
            }
          }
        })
      } else {
        this.$refs.action.submitAction()
      }
    },
    print() {
      this.printVisible = true
    },
    doPrint() {
      Print(this.printCheck ? this.$refs.print : this.$refs.print.$el)
    },
    scanQr() {
      this.$message.warning('敬请期待')
    },
    handlerOk() {
      console.log('处理---handlerOk')
      this.actionVisible = false
      this.$emit('handler-after')
    },
    getEnableEditForm(forms, fields) {
      forms.forEach((f) => {
        if (f.name === 'SpanLayout') {
          this.getEnableEditForm(f.props.items, fields)
        } else if (f.name === 'TableList'){
          fields.push(f.id)
        } else if (f.perm === 'E') {
          fields.push(f.id)
        }
      })
    },
    getPrintConfig() {
      getCustomPrintConfig(this.instanceId)
        .then((rsp) => {
          this.printTemplateConfig = rsp.data
        })
        .catch((err) => {
          this.$err(err, '获取打印模板配置失败')
        })
    },
    renderPrint(val) {
      if (val) {
        this.$nextTick(() => {
          bindVar(
            this.printTemplateConfig.printTemplate,
            this.formatFormData,
            'printDom'
          )
        })
      }
    },
  },
  emits: ['handler-after'],
}
</script>

<style lang="less" scoped>
.preview {
  background: #eeeeee;
  position: relative;
  height: 100%;
  & > div:nth-child(1) {
    overflow-y: auto;
    height: 100%;
    //padding-bottom: 50px;
  }

  .actions {
    height: 30px;
    padding: 15px 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 99;
    background: white;
    border-top: 1px solid #dcdfe6;
    box-shadow: 0 0 15px 0px #dad8d8;

    .ok-refuse {
      position: absolute;
      right: 20px;
    }

    .action-more {
      position: absolute;
      right: 180px;
      top: 5px;
    }

    .cancel {
      position: absolute;
      right: 20px;
      top: 5px;
    }

    .comment {
      position: absolute;
      left: 20px;
      top: -5px;
      cursor: pointer;
      text-align: center;
      font-size: 12px;

      :deep(.icon) {
        font-size: 20px;
      }

      &:hover {
        color: @theme-primary;
      }
    }
  }
}
.process {
  background: white;
  padding: 20px 10px 50px 10px;
}
.title {
  background: white;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
  padding: 0 10px 10px 10px;
  & > div {
    color: #666666;
    display: inline-block;
  }

  .title-info {
    height: 50px;
    display: flex;
    padding: 0 10px;
    position: relative;
    flex-direction: column;
    justify-content: space-between;

    .name {
      font-size: 15px;
      color: #5e5e5e;
    }

    .code {
      font-size: 13px;
    }

    img {
      width: 80px;
      height: 80px;
      position: absolute;
      right: -100px;
      top: 30px;
      z-index: 9999;
    }
  }

  .extend-options {
    position: absolute;
    right: 0;

    :deep(.icon) {
      cursor: pointer;
      margin-right: 20px;

      &:hover {
        color: @theme-primary;
      }
    }
  }
}
.form {
  margin: 15px 0;
  padding: 10px 10px 1px 10px;
  background: white;
}
</style>
