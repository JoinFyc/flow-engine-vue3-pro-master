<template>
  <el-container v-loading="loading">
    <div style="width: 100%" v-if="isMobilePreview">
      <mobile-preview/>
    </div>
    <div v-else style="width: 100%" :class="{ 'process-design': activeSelect === 'processDesign' }">
      <el-header style="background: white; position: fixed; width: 100%; z-index: 99">
        <layout-header v-model="activeSelect" @publish="publishProcess" @save="save"></layout-header>
      </el-header>
      <div class="layout-body">
        <form-base-setting ref="baseSetting" v-show="activeSelect === 'baseSetting'"/>
        <form-design v-if="!isSubProcess" ref="formSetting" v-show="activeSelect === 'formSetting'"/>
        <process-design ref="processDesign" v-show="activeSelect === 'processDesign'"/>
        <form-pro-setting v-if="!isSubProcess" ref="proSetting" v-show="activeSelect === 'proSetting'"/>
      </div>
      <w-dialog :showFooter="false" v-model="validVisible" title="设置项检查">
        <el-steps align-center :active="validStep" finish-status="success">
          <el-step v-for="(step, i) in validOptions" :title="step.title" :key="i" :icon="step.icon" :status="step.status" :description="step.description"/>
        </el-steps>
        <el-result :icon="validIcon" :title="errTitle" :subTitle="validResult.desc">
          <template #icon>
            <el-icon style="font-size: 30px" v-if="!validResult.finished"><Loading/></el-icon>
          </template>
          <template #sub-title>
            <div class="err-info" v-if="validResult.errs.length > 0">
              <ellipsis hover-tip v-for="(err, i) in validResult.errs" :key="i + '_err'" :content="err">
                <template #pre>
                  <el-icon><Warning/></el-icon>
                </template>
              </ellipsis>
            </div>
          </template>
          <template #extra>
            <el-button type="primary" v-if="validResult.finished" @click="doAfter">
              {{ validResult.action }}
            </el-button>
          </template>
        </el-result>
      </w-dialog>
    </div>
  </el-container>
</template>

<script>
import LayoutHeader from './LayoutHeader.vue'
import {saveProcess, deployProcess, getNewVerProcess} from '@/api/process'
import FormBaseSetting from '@/views/admin/layout/FormBaseSetting.vue'
import FormDesign from '@/views/admin/layout/FormDesign.vue'
import ProcessDesign from '@/views/admin/layout/ProcessDesign.vue'
import FormProSetting from '@/views/admin/layout/FormProSetting.vue'
import MobilePreview from './layout/FormDesignMobilePreview.vue'
import {ROOT_PROPS} from "@/views/admin/layout/process/DefaultNodeProps.js";

export default {
  name: 'FormProcessDesign',
  components: {
    LayoutHeader,
    FormBaseSetting,
    FormDesign,
    ProcessDesign,
    FormProSetting,
    MobilePreview,
  },
  data() {
    return {
      isNew: true,
      validStep: 0,
      timer: null,
      loading: false,
      activeSelect: 'baseSetting',
      validVisible: false,
      isSave: false,
      validResult: {},
      validOptions: [
        {title: '基础信息', description: '', icon: '', status: ''},
        {title: '审批表单', description: '', icon: '', status: ''},
        {title: '审批流程', description: '', icon: '', status: ''},
        {title: '扩展设置', description: '', icon: '', status: ''},
      ],
      validComponents: [
        'baseSetting',
        'formSetting',
        'processDesign',
        'proSetting',
      ],
    }
  },
  computed: {
    setup() {
      return this.$store.state.design
    },
    isMobilePreview() {
      return this.$isNotEmpty(this.$route.query.mobilePreview)
    },
    isSubProcess(){
      const isSub = this.$route.query.isSub == 1
      this.setup.isSubProc = isSub
      return isSub
    },
    errTitle() {
      if (this.validResult.finished && !this.validResult.success) {
        return (this.validResult.title + ` (${this.validResult.errs.length}项错误) 😥`)
      }
      return this.validResult.title
    },
    validIcon() {
      if (!this.validResult.finished) {
        return 'loading'
      } else if (this.validResult.success) {
        return 'success'
      } else {
        return 'warning'
      }
    },
  },
  created() {
    this.showValiding()
    let formId = this.$route.query.code
    if (this.isSubProcess){//子流程要移除表单设置和扩展设置
      this.validOptions.splice(1, 1)
      this.validOptions.splice(2, 1)
      this.validComponents.splice(1, 1)
      this.validComponents.splice(2, 1)
    }
    //判断传参，决定是新建还是加载原始数据
    this.loadInitFrom()
    if (this.$isNotEmpty(formId)) {
      this.isNew = false
      this.loadFormInfo(formId)
    }
    let group = this.$route.query.groupId
    this.setup.groupId = this.$isNotEmpty(group) ? group : null
  },
  beforeUnmount() {
    this.stopTimer()
    window.removeEventListener('onbeforeunload', this.exitTip)
  },
  mounted() {
    window.addEventListener('onbeforeunload', this.exitTip)
  },
  methods: {
    getDfFormConfig(){
      return {
        labelPos: "top",
        ruleType: "SIMPLE",
        labelWidth: "",
        rules: [],
        ruleJs: "//formData: 表单数据  formMap: 表单字段id -> 字段json配置\r\nfunction doChange(formData, formMap){\r\n\t\r\n}"
      }
    },
    loadFormInfo(formId) {
      this.loading = true
      getNewVerProcess(formId, this.isSubProcess).then((rsp) => {
          this.loading = false
          let form = rsp.data;
          form.logo = JSON.parse(form.logo  || '{}')
          form.settings = JSON.parse(form.settings || '{}')
          form.formItems = JSON.parse(form.formItems || '[]')
          form.process = JSON.parse(form.process || '{}')
          form.processConfig = JSON.parse(form.processConfig || '{}')
          form.formConfig = form.formConfig ? JSON.parse(form.formConfig):this.getDfFormConfig()
          this.$store.commit('loadForm', form)
        }).catch((err) => {
          this.loading = false
          this.$err(err, '获取流程信息失败')
        })
    },
    loadInitFrom() {
      this.$store.commit('loadForm', {
        formId: null,
        formName: "未命名表单",
        logo: {
          icon: 'bi:people-fill',
          background: "#1e90ff"
        },
        settings: {
          commiter: [],
          admin: [],
          sign: false,
          enableCancel: true,
          reExecute: false,
          sameSkip: 'NONE',
          recallSkip: true,
          notify: {
            types: ["APP"],
            title: "消息通知标题"
          }
        },
        groupId: undefined,
        formItems: [],
        formConfig: this.getDfFormConfig(),
        processConfig: {
          listener: {
            start: [],
            pass: [],
            refuse: [],
            cancel: []
          }
        },
        process: {
          id: "root",
          parentId: null,
          type: "ROOT",
          name: "发起人",
          desc: "任何人",
          props: this.$deepCopy(ROOT_PROPS),
          children: {}
        },
        remark: "备注说明"
      })
    },
    validateDesign() {
      this.validVisible = true
      this.validStep = 0
      this.showValiding()
      this.stopTimer()
      this.timer = setInterval(() => {
        this.validResult.errs = this.$refs[this.validComponents[this.validStep]].validate()
        if (Array.isArray(this.validResult.errs) && this.validResult.errs.length === 0) {
          this.validStep++
          if (this.validStep >= this.validOptions.length) {
            this.stopTimer()
            this.showValidFinish(true)
          }
        } else {
          this.stopTimer()
          this.validOptions[this.validStep].status = 'error'
          this.showValidFinish(false, this.getDefaultValidErr())
        }
      }, 300)
    },
    getDefaultValidErr() {
      switch (this.validStep) {
        case 0:
          return '请检查基础设置项'
        case 1:
          return '请检查审批表单相关设置'
        case 2:
          return '请检查审批流程，查看对应标注节点错误信息'
        case 3:
          return '请检查扩展设置'
        default:
          return '未知错误'
      }
    },
    showValidFinish(success, err) {
      this.validResult.success = success
      this.validResult.finished = true
      this.validResult.title = success ? '校验完成 😀' : '校验失败 '
      this.validResult.desc = success ? '设置项校验成功，是否提交？' : err
      this.validResult.action = success ? '提 交' : '去修改'
    },
    showValiding() {
      this.validResult = {
        errs: [],
        finished: false,
        success: false,
        title: '检查中...',
        action: '处理',
        desc: '正在检查设置项',
      }
      this.validStep = 0
      this.validOptions.forEach((op) => {
        op.status = ''
        op.icon = ''
        op.description = ''
      })
    },
    doAfter() {
      if (this.validResult.success) {
        this.doPublish()
      } else {
        this.activeSelect = this.validComponents[this.validStep]
        this.validVisible = false
      }
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    save() {
      this.doSave()
    },
    publishProcess() {
      this.validateDesign()
    },
    doSave(call){
      this.valids = this.$refs.baseSetting.validate()
      if (Array.isArray(this.valids) && this.valids.length === 0) {
        let modelData = this.getDataFromStore()
        this.loading = true
        saveProcess(modelData, this.isSubProcess).then(rsp => {
          this.loading = false
          this.isSave = true
          this.$message.success("保存成功")
          if (call){
            this.loading = true
            call(modelData.groupId, rsp.data)
            this.loading = false
          }
          this.createReload(modelData.groupId, rsp.data)
        }).catch(err => {
          this.loading = false
          this.$err(err, '抄送我的')
        })
      }else {
        this.$message.warning(String(this.valids))
      }
    },
    getDataFromStore() {
      return {
        formId: this.setup.formId,
        formName: this.setup.formName,
        logo: JSON.stringify(this.setup.logo),
        settings: JSON.stringify(this.setup.settings),
        groupId: this.setup.groupId,
        formItems: JSON.stringify(this.setup.formItems),
        formConfig: JSON.stringify(this.setup.formConfig || {}),
        processConfig: JSON.stringify(this.setup.processConfig || {}),
        process: JSON.stringify(this.setup.process),
        remark: this.setup.remark,
      }
    },
    createReload(groupId, formId){
      if(!this.$isNotEmpty(this.$route.query.code)){
        window.location.replace(`${window.location.origin}/#/admin/design?groupId=${groupId}&code=${formId}${this.isSubProcess ? '&isSub=1':''}`)
        window.location.reload()
      }
    },
    doPublish() {
      this.$confirm('如果您只想临时保存请选择保存，确认发布后流程立即生效，是否继续?', '提示', {
            confirmButtonText: '发布',
            cancelButtonText: '取消',
            type: 'warning',
      }).then(() => {
        this.validVisible = false
        this.doSave((groupId, formId) => {
          this.isSave = true
          deployProcess(formId, this.isSubProcess).then(rsp => {
            this.loading = false
            this.$confirm('发布成功，您想继续留在本页还是返回表单列表呢', '操作成功', {
              confirmButtonText: '留在本页',
              cancelButtonText: '返回列表',
              type: 'success'
            }).then(() => {
              this.createReload(groupId, formId)
            }).catch(() => {
              this.$router.push(this.isSubProcess ? "/workspace/subProcess":"/workspace/formsPanel")
            })
          }).catch(err => {
            this.$err(err, '部署流程失败')
          })
        })
      })
    },
    exitTip(e) {
      if (!this.isSave) {
        e = e || window.event
        if (e) {
          e.returnValue = '数据还没保存，您确定离开吗？'
        }
        return '数据还没保存，您确定离开吗？'
      }
    },
  }
}
</script>

<style lang="less" scoped>
.layout-body {
  padding-top: 60px;
  min-width: 980px
}

:deep(.el-step) {
  .is-success {
    color: @theme-primary;
    border-color: @theme-primary;
  }
}

:deep(.el-result) {
  .icon-success {
    fill: @theme-success;
  }

  .icon-warning {
    fill: @theme-warning;
  }
}

.process-design {
  //width: unset !important;
}

.err-info{
  max-height: 180px;
  overflow-y: auto;
  & > div{
    padding: 5px;
    margin: 2px 0;
    width: 220px;
    text-align: left;
    border-radius: 3px;
    background: rgb(242 242 242);
  }
  :deep(.icon){
    margin: 0 5px;
  }
}
</style>
