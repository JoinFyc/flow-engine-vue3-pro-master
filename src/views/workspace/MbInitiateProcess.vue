<template>
  <div v-loading="loading">
    <!--    <nav-bar fixed :title="`发起-${form.formName}`" left-text="取消" right-text="提交" left-arrow @click-left="back" @click-right="submitForm"/>-->
    <tabs v-model:active="active" :lazy-render="false" animated swipeable sticky>
      <tab title="审批表单"></tab>
      <tab title="审批流程"></tab>
    </tabs>
    <div style="padding-bottom: 5rem">
      <div v-if="userDepts.length > 1" style="margin-bottom: 10px">
        本次发起部门：
        <radio-group v-model="userDeptId" direction="horizontal">
          <radio v-for="dept in userDepts" :key="dept.id" :name="dept.id">{{dept.name }}</radio>
        </radio-group>
      </div>
      <form-render v-if="!loading" v-show="active === 0" mode="MOBILE" class="process-form" ref="form" :forms="forms" v-model="formData" :config="form.formConfig"/>
      <process-render @render-ok="submitLoading = false" ref="process" v-show="active === 1"
                      v-if="!loading && userDeptId" :process-def-id="form.processDefId"
                      :dept-id="userDeptId" v-model="processUsers" :forms="forms" :pcMode="false"
                      :formData="formData" :process="process" style="padding: 10px"/>
    </div>
    <v-button class="submit-btn" :loading="submitLoading" round type="primary" @click="submit">提交审批</v-button>
  </div>
</template>

<script>
import {Radio, RadioGroup, NavBar, Tabs, Tab, Button, showFailToast, showSuccessToast} from 'vant'
import ProcessRender from '../process/ProcessRender.vue'
import FormRender from '@/views/common/form/FormRender.vue'
import FormDesignRender from '@/views/admin/layout/form/FormDesignRender.vue'
import { getModelById } from '@/api/modelGroup'
import { getInstanceFormData } from '@/api/processTask'
import { getUserDepts } from '@/api/org'
import { startProcess } from '@/api/process'

const VButton = Button
export default {
  name: 'MbInitiateProcess',
  components: {
    FormDesignRender,
    FormRender,
    ProcessRender,
    VButton,
    Radio,
    RadioGroup,
    NavBar,
    Tabs,
    Tab,
  },
  data() {
    return {
      active: 0,
      loading: false,
      formData: {},
      userDepts: [],
      userDeptId: '',
      submitLoading: false,
      processUsers: {},
      form: {
        formId: '',
        formName: '',
        logo: {},
        formItems: [],
        process: {},
        remark: '',
      },
    }
  },
  mounted() {
    if (this.$isNotEmpty(this.$route.query.code)) {
      this.getUserDept()
      this.loadFormInfo(this.$route.query.code)
    } else {
      showFailToast('参数缺失')
    }
  },
  computed: {
    forms() {
      return this.$store.state.design.formItems
    },
    process() {
      return this.$store.state.design.process
    },
  },
  methods: {
    getUserDept() {
      getUserDepts(this.$store.state.loginUser.id)
        .then((rsp) => {
          this.userDepts = rsp.data
          if (this.userDepts.length > 0) {
            this.userDeptId = this.userDepts[0].id
          }
        })
        .catch((err) => {
          this.$err(err, '获取用户部门信息失败')
        })
    },
    loadFormInfo(formId) {
      this.loading = true
      getModelById(formId)
        .then((rsp) => {
          this.loading = false
          console.log(rsp.data)
          let form = rsp.data
          form.logo = JSON.parse(form.logo)
          this.form = form
          //构建表单及校验规则
          this.$store.state.design = form
          this.loadFormData()
        })
        .catch((err) => {
          this.loading = false
          showFailToast('获取流程模型失败')
        })
    },
    loadFormData() {
      let instanceId = this.$route.query.instanceId
      if (this.$isNotEmpty(instanceId)) {
        getInstanceFormData(instanceId)
          .then((rsp) => {
            for (let key in this.formData) {
              this.formData[key] = rsp.data[key]
            }
          })
          .catch((e) => {
            showFailToast('回显数据失败')
          })
      }
    },
    submit() {
      if (!this.$isNotEmpty(this.form.processDefId)) {
        showFailToast('流程未发布')
        return
      }
      this.validate((validForm, validProcess) => {
        if (validForm && validProcess) {
          //Toast.success('校验成功')
          let startParams = {
            deptId: this.userDeptId,
            formData: this.formData,
            processUsers: this.processUsers,
          }
          startProcess(this.form.processDefId, startParams)
            .then((rsp) => {
              showSuccessToast('提交成功')
              this.$router.push('/workspace/submit')
            })
            .catch((err) => {
              showFailToast('提交失败')
            })
        } else {
          showFailToast('请完善表单/流程选项')
        }
      })
    },
    back() {
      this.$router.push('/workspace/forms')
    },
    validate(call) {
      this.$refs.form.validate(validForm => {
        this.$refs.process.validate(validProcess => {
          if (validForm && !validProcess){
            this.active = 1
          }
          call(validForm, validProcess)
        });
      });
    },
  },
}
</script>

<style lang="less" scoped>
.process-form {
  :deep(.el-form-item__label) {
    padding: 0 0;
  }
}
:deep(.van-tabs) {
  .van-tabs__wrap {
    border-bottom: 1px solid @theme-aside-bgc;
  }
  .van-tabs__line {
    background-color: @theme-primary;
  }
  .van-tab--active .van-tab__text {
    color: @theme-primary;
  }
}
.submit-btn {
  position: fixed;
  bottom: 2rem;
  width: 95%;
  left: calc((100% - 95%) / 2);
}
</style>
