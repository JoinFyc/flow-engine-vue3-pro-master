<template>
  <div class="base-setup" @click="showIconSelect = false">
    <el-form ref="baseSetting" :model="setup" label-position="top" label-width="80px">
      <el-form-item label="流程图标" v-if="!isSubProc">
        <iconify class="w-form-icon" :key="setup.logo.icon" :icon="setup.logo.icon" color="#FFFFFF" :style="{'--bgc': setup.logo.background}"></iconify>
        <span class="change-icon">
          <span>
            <span>选择背景色</span>
            <el-color-picker v-model="setup.logo.background" show-alpha size="default" :predefine="colors"></el-color-picker>
          </span>
          <span>
            <span>选择图标</span>
            <el-popover placement="bottom-start" width="402" trigger="click">
              <div class="icon-select">
                <icon-select @ok="ico => setup.logo.icon = ico"/>
							</div>
              <template #reference>
                <iconify class="w-form-icon w-form-icon-select" style="padding: 0" slot="reference" :icon="setup.logo.icon"></iconify>
              </template>
            </el-popover>
            <!--<el-icon :name="setup.icon" @click.stop="showIconSelect = true"></el-icon>-->
          </span>
        </span>
      </el-form-item>
      <el-form-item label="流程名称" :rules="getRule('请输入流程名称')" prop="formName">
        <el-input v-model="setup.formName" size="default"></el-input>
      </el-form-item>
      <el-form-item label="所在分组" :rules="getRule('请选择流程分组')" class="group" prop="groupId">
        <el-select v-model="setup.groupId" size="default" placeholder="请选择分组">
          <el-option v-for="(op, index) in fromGroup" :key="index" v-show="op.groupId > 1" :label="op.groupName" :value="op.groupId"></el-option>
        </el-select>
        <el-popover placement="bottom-end" title="新建流程分组" width="300" trigger="click">
          <el-input v-model="newGroup" size="default" placeholder="请输入新的分组名">
            <template #append>
              <el-button type="primary" @click="addGroup">提交</el-button>
            </template>
          </el-input>
          <template #reference>
            <el-button icon="plus" size="default"  type="primary">新建分组</el-button>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item label="流程说明">
        <el-input placeholder="请输入流程说明" v-model="setup.remark" size="default" type="textarea" show-word-limit :autosize="{ minRows: 2, maxRows: 5 }" maxlength="500"></el-input>
      </el-form-item>
      <template v-if="!isSubProc">
        <el-form-item label="消息通知方式" :rules="getRule('请选择消息通知方式')">
          <el-select v-model="setup.settings.notify.types" size="default" placeholder="选择消息通知方式" style="width: 30%" clearable multiple collapse-tags>
            <el-option v-for="(wc, index) in notifyTypes" :label="wc.name" :key="index" :value="wc.type"></el-option>
          </el-select>
          <el-input disabled v-model="setup.settings.notify.title" size="default" style="width: 68%; float: right" placeholder="消息通知标题"></el-input>
        </el-form-item>
        <el-form-item label="谁可以管理此流程">
          <el-select disabled v-model="setup.settings.admin" size="default" @click="selectUser('admin')" value-key="name" class="select-u" placeholder="暂不支持，控制菜单权限即可" clearable multiple>
            <el-option v-for="(wc, index) in setup.settings.admin" :label="wc.name" :key="index" :value="wc"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <org-picker title="请选择可以管理此流程的人员" multiple ref="orgPicker" :selected="select" @ok="selected"></org-picker>
  </div>
</template>

<script>
import OrgPicker from '@/components/common/OrgPicker.vue'
import { getModelGroups, createModelGroup } from '@/api/modelGroup'
import IconSelect from "./IconSelect.vue";
export default {
  name: 'FormBaseSetting',
  components: { OrgPicker, IconSelect },
  data() {
    return {
      nowUserSelect: null,
      showIconSelect: false,
      select: [],
      newGroup: '',
      fromGroup: [],
      notifyTypes: [
        { type: 'APP', name: '应用内通知' },
        { type: 'EMAIL', name: '邮件通知' },
        { type: 'SMS', name: '短信通知' },
        { type: 'WX', name: '微信通知' },
        { type: 'DING', name: '钉钉通知' },
      ],
      colors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577',
      ],
      rules: {
        formName: [{}],
        groupId: [],
      },
    }
  },
  computed: {
    setup() {
      return this.$store.state.design
    },
    isSubProc(){
      return this.setup.isSubProc || false;
    }
  },
  mounted() {
    this.getGroups()
  },
  methods: {
    getRule(msg) {
      return [{ required: true, message: msg, trigger: 'blur' }]
    },
    getGroups() {
      getModelGroups({}, this.isSubProc).then((rsp) => {
          this.fromGroup = rsp.data
      }).catch((err) => this.$err(err, '获取分组异常'))
    },
    addGroup() {
      if (this.newGroup.trim() !== '') {
        createModelGroup({name: this.newGroup.trim()}, this.isSubProc)
          .then((rsp) => {
            this.$ok(rsp, '新增分组成功')
            this.getGroups()
          })
          .catch((err) => this.$err(err, '新增分组失败'))
      }
    },
    selected(select) {
      this.setup.settings[this.nowUserSelect] = select
      //this.setup[this.nowUserSelect] = select
    },
    selectUser(key) {
      this.select = this.setup.settings[key]
      this.nowUserSelect = key
      this.$refs.orgPicker.show()
    },
    validate() {
      this.$refs.baseSetting.validate()
      let err = []
      if (!this.$isNotEmpty(this.setup.formName)) {
        err.push('流程名称未设置')
      }
      if (!this.$isNotEmpty(this.setup.groupId)) {
        err.push('流程分组未设置')
      }
      if (!this.isSubProc && this.setup.settings.notify.types.length === 0) {
        err.push('审批消息通知方式未设置')
      }
      return err
    },
  },
}
</script>

<style lang="less" scoped>
.w-form-icon-select{
  font-size: 25px;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 0 3px 0 #cccccc;
}

:deep(.select-u) {
  width: 100%;
}
.base-setup {
  overflow: auto;
  margin: 0 auto;
  width: 600px;
  height: calc(100vh - 105px);
  background: #ffffff;
  margin-top: 10px;
  padding: 15px 20px;

  .w-form-icon:first-child {
    position: relative;
    cursor: pointer;
    font-size: xx-large;
    color: #ffffff;
    border-radius: 10px;
    padding: 8px;
    background: var(--bgc);
  }

  .w-form-icon-select{
    box-shadow: 0 0 3px 0 #cccccc;
  }

  .change-icon {
    margin-left: 20px;

    span {
      font-size: small;
      color: #7a7a7a;
      margin-right: 15px;
    }
  }

  :deep(.el-form-item__label) {
    padding: 0;
    font-weight: bold;
  }
}
:deep(.group) {
  .el-select {
    width: calc(100% - 130px);
  }

  .el-button {
    margin-left: 10px;
    width: 120px;
  }
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: #f8f8f8;
}
::-webkit-scrollbar-thumb {
  border-radius: 16px;
  background-color: #e8e8e8;
}
</style>
