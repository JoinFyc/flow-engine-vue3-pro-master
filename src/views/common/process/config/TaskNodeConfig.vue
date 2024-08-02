<template>
  <div>
    <el-form label-position="top" label-width="90px">
      <el-form-item label="⚙ 选择办理对象" prop="text" class="user-type">
        <el-radio-group v-model="nodeProps.assignedType">
          <el-radio v-for="t in approvalTypes" :label="t.type" :key="t.type">{{ t.name }}</el-radio>
        </el-radio-group>
        <div v-if="nodeProps.assignedType === 'ASSIGN_USER'">
          <el-button size="small" icon="plus" type="primary" @click="selectUser" round>选择人员</el-button>
          <org-items v-model="nodeProps.assignedUser"/>
        </div>
        <div v-else-if="nodeProps.assignedType === 'ASSIGN_LEADER'">
          <el-button size="small" icon="plus" type="primary" @click="selectOrgDept" round>选择部门</el-button>
          <org-items v-model="nodeProps.assignedDept"/>
        </div>
        <div v-else-if="nodeProps.assignedType === 'OTHER_SELECT'">
          <el-select style="width: 80%;" multiple v-model="nodeProps.assignedNode" placeholder="请选择指定节点">
            <el-option v-for="(node, i) in assignNodes" :key="i" :label="node.name" :value="node.id"></el-option>
          </el-select>
        </div>
        <div v-else-if="nodeProps.assignedType === 'SELF_SELECT'">
          <el-radio-group size="small" v-model="nodeProps.selfSelect.multiple">
            <el-radio-button :label="false">自选一个人</el-radio-button>
            <el-radio-button :label="true">自选多个人</el-radio-button>
          </el-radio-group>
        </div>
        <div v-else-if="nodeProps.assignedType === 'LEADER_TOP'">
          <el-divider/>
          <el-form-item label="🖐 办理终点" prop="text" class="approve-end">
            <el-radio-group v-model="nodeProps.leaderTop.endCondition">
              <el-radio label="TOP">直到最上层主管</el-radio>
              <el-radio label="LEAVE">不超过发起人的</el-radio>
            </el-radio-group>
            <div class="approve-end-leave" v-if="nodeProps.leaderTop.endCondition === 'LEAVE'">
              <span>第 </span>
              <el-input-number :min="1" :max="20" :step="1" v-model="nodeProps.leaderTop.endLevel"/>
              <span> 级主管</span>
            </div>
            <el-divider/>
          </el-form-item>
          <el-form-item label="📌 提取规则" prop="text" class="approve-end">
            <el-radio-group v-model="nodeProps.leaderTop.skipEmpty">
              <el-radio :label="true">无主管时跳过，向上查找直到满足级别人数</el-radio>
              <el-radio :label="false">无主管时按空处理</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-else-if="nodeProps.assignedType === 'LEADER'">
          <el-divider/>
          <el-form-item label="👨‍💼 指定主管" prop="text">
            <div>
              <span>发起人的第 </span>
              <el-input-number :min="1" :max="20" v-model="nodeProps.leader.level"></el-input-number>
              <span> 级主管</span>
              <p style="color: #409eff; font-size: small">👉 直接主管为 第 1 级主管</p>
            </div>
          </el-form-item>
          <el-form-item label="📌 提取规则" prop="text" class="approve-end">
            <el-radio-group v-model="nodeProps.leader.skipEmpty">
              <el-radio :label="true">无主管时跳过并向上查找</el-radio>
              <el-radio :label="false">无主管时按空处理</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-else-if="nodeProps.assignedType === 'ROLE'">
          <el-button size="small" icon="plus" type="primary" @click="selectRole" round>选择系统角色</el-button>
          <org-items v-model="nodeProps.role"/>
        </div>
        <div v-else-if="nodeProps.assignedType === 'FORM_USER'">
          <el-form-item label="选择表单联系人项" prop="text" class="approve-end">
            <el-select style="width: 80%" v-model="nodeProps.formUser" placeholder="请选择联系人表单项">
              <el-option v-for="op in userForms" :label="op.title" :value="op.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else-if="nodeProps.assignedType === 'FORM_DEPT'">
          <el-form-item label="选择表单部门项" prop="text" class="approve-end">
            <el-select style="width: 80%" v-model="nodeProps.formDept" placeholder="请选择部门选择表单项">
              <el-option v-for="op in deptForms" :label="op.title" :value="op.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="nodeProps.assignedType === 'ASSIGN_LEADER' || nodeProps.assignedType === 'FORM_DEPT'">
          <el-radio-group v-model="nodeProps.deptProp.type">
            <el-radio label="LEADER">部门内主管</el-radio>
            <el-radio label="ALL">部门内所有人</el-radio>
            <el-radio label="ROLE">部门内角色</el-radio>
          </el-radio-group>
          <div style="display: flex; align-items: center" v-if="nodeProps.deptProp.type === 'ROLE'">
            <el-button style="margin-top: 10px" size="small" icon="plus" @click="selectRole" round>选择系统角色</el-button>
            <org-items v-model="nodeProps.deptProp.roles"/>
          </div>
        </div>
        <div v-else-if="nodeProps.assignedType === 'SELF'">
          <span class="item-desc">发起人自己作为办理人进行办理</span>
        </div>
      </el-form-item>
      <div v-show="nodeProps.assignedType !== 'REFUSE'">
        <el-divider></el-divider>
        <el-form-item label="👤 办理人为空时" prop="text" class="line-mode">
          <el-radio-group v-model="nodeProps.nobody.handler">
            <el-radio label="TO_PASS">自动办理</el-radio>
            <el-radio label="TO_ADMIN">转交管理员</el-radio>
            <el-radio label="TO_USER" :disabled="nodeProps.assignedType === 'ASSIGN_USER'">转交指定人员</el-radio>
          </el-radio-group>

          <div style="margin-top: 10px" v-if="nodeProps.nobody.handler === 'TO_USER'">
            <el-button size="small" icon="plus" type="primary" @click="selectNoSetUser" round>选择人员</el-button>
            <org-items v-model="nodeProps.nobody.assignedUser"/>
          </div>
        </el-form-item>

        <div v-if="showMode">
          <el-divider/>
          <el-form-item label="👩‍👦‍👦 多人办理时办理方式" prop="text" class="approve-mode">
            <el-radio-group v-model="nodeProps.mode">
              <el-radio label="NEXT">会签 （按选择顺序办理，每个人必须处理）</el-radio>
              <el-radio label="AND">会签（可同时办理，每个人必须处理）</el-radio>
              <el-radio label="OR">或签（有一人办理即可）</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <el-divider>高级设置</el-divider>
        <el-form-item label="✍ 提交时是否需要签字" prop="text">
          <el-switch inactive-text="不用" active-text="需要" v-model="nodeProps.sign"></el-switch>
          <el-tooltip class="item" effect="dark" content="如果全局设置了需要签字，则此处不生效" placement="top-start">
            <el-icon style="margin-left: 10px; font-size: medium; color: #b0b0b1">
              <QuestionFilled/>
            </el-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="⏱ 办理期限（为 0 则不生效）" prop="timeLimit">
          <el-input style="width: 180px" placeholder="时长" type="number" v-model="nodeProps.timeLimit.timeout.value">
            <template #append>
              <el-select style="width: 75px" v-model="nodeProps.timeLimit.timeout.unit" placeholder="请选择">
                <el-option label="天" value="D"></el-option>
                <el-option label="小时" value="H"></el-option>
                <el-option label="分钟" value="M"></el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="办理期限超时后执行" prop="level" v-if="nodeProps.timeLimit.timeout.value > 0">
          <el-radio-group v-model="nodeProps.timeLimit.handler.type">
            <el-radio label="PASS">自动办理</el-radio>
            <el-radio label="NOTIFY">发送提醒</el-radio>
          </el-radio-group>
          <div style="margin-left: 20px" v-if="nodeProps.timeLimit.handler.type === 'NOTIFY'">
            <div style="color: #409eef; font-size: small;">
              默认提醒当前办理人
            </div>
            <el-switch inactive-text="循环" active-text="一次"
                       v-model="nodeProps.timeLimit.handler.notify.once"></el-switch>
            <!--            <span style="margin-left: 20px" v-if="!nodeProps.timeLimit.handler.notify.once">
  							每隔
  							<el-input-number :min="0" :max="10000" :step="1" size="small"
                                 v-model="nodeProps.timeLimit.handler.notify.hour"/>
  							小时提醒一次
  						</span>-->
          </div>
        </el-form-item>
      </div>
    </el-form>
    <org-picker :title="pickerTitle" multiple :type="orgPickerType" ref="orgPicker" :selected="orgPickerSelected"
                @ok="selected"/>
  </div>
</template>

<script>
import OrgPicker from '@/components/common/OrgPicker.vue'
import OrgItems from '../OrgItems.vue'
import {forEachNode} from "@/utils/ProcessUtil";

export default {
  name: 'TaskNodeConfig',
  components: {OrgPicker, OrgItems},
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      showOrgSelect: false,
      orgPickerSelected: [],
      orgPickerType: 'user',
      approvalTypes: [
        {name: '指定人员', type: 'ASSIGN_USER'},
        {name: '发起人自选', type: 'SELF_SELECT'},
        {name: '由其他节点指定', type: 'OTHER_SELECT'},
        {name: '发起人自己', type: 'SELF'},
        {name: '部门主管', type: 'LEADER'},
        {name: '多级部门主管', type: 'LEADER_TOP'},
        {name: '指定部门', type: 'ASSIGN_LEADER'},
        {name: '系统角色', type: 'ROLE'},
        {name: '表单内联系人', type: 'FORM_USER'},
        {name: '表单内部门', type: 'FORM_DEPT'},
      ],
    }
  },
  computed: {
    nodeProps() {
      return this.$store.state.selectedNode.props
    },
    select() {
      return this.config.assignedUser || []
    },
    selectDept() {
      if (!this.config.assignedDept) {
        this.config['assignedDept'] = []
      }
      return this.config.assignedDept
    },
    userForms() {
      let userForm = []
      this.loadFormItemPicker(
        this.$store.state.design.formItems,
        userForm,
        'UserPicker'
      )
      return userForm
    },
    deptForms() {
      let deptForm = []
      this.loadFormItemPicker(
        this.$store.state.design.formItems,
        deptForm,
        'DeptPicker'
      )
      return deptForm
    },
    pickerTitle() {
      switch (this.orgPickerType) {
        case 'user':
          return '请选择人员'
        case 'role':
          return '请选择系统角色'
        default:
          return null
      }
    },
    nodeOptions() {
      let values = []
      const excType = [
        'EMPTY',
        'CONDITION',
        'CONDITIONS',
        'CONCURRENT',
        'CONCURRENTS',
      ]
      this.$store.state.nodeMap.forEach((v) => {
        if (excType.indexOf(v.type) === -1) {
          values.push({id: v.id, name: v.name})
        }
      })
      return values
    },
    assignNodes(){
      let values = []
      //从当前节点出发向上遍历
      const nMap = this.$store.state.nodeMap
      let node = nMap.get(this.$store.state.selectedNode.id)
      node = nMap.get(node.parentId)
      do {
        if (node.type === "APPROVAL" || node.type === "TASK"){
          values.push({id: node.id, name: node.name})
        }else if (node.type === "EMPTY"){
          //空节点的话就找到网关节点去遍历内部节点
          forEachNode(nMap.get(node.parentId), (n) => {
            if (n.type === "APPROVAL" || n.type === "TASK"){
              values.push({id: n.id, name: n.name})
            }else if (n.id === node.id){
              //找到合流点，停止遍历
              return true
            }
          })
        }
        node = nMap.get(node.parentId)
      }while (node);
      return values
    },
    showMode() {
      switch (this.nodeProps.assignedType) {
        case 'ASSIGN_USER':
          return this.nodeProps.assignedUser.length > 0
        case 'ASSIGN_LEADER':
          return true
        case 'SELF_SELECT':
          return this.nodeProps.selfSelect.multiple
        case 'LEADER_TOP':
          return true
        case 'FORM_USER':
          return true
        case 'ROLE':
          return true
        case 'FORM_DEPT':
          return true
        default:
          return false
      }
    },
  },
  methods: {
    loadFormItemPicker(items, result, name) {
      items.forEach((it) => {
        if (it.name === 'SpanLayout') {
          this.loadFormItemPicker(it.props.items, result, name)
        } else if (it.name === name) {
          result.push(it)
        }
      })
    },
    selectUser() {
      this.orgPickerSelected = this.select
      this.orgPickerType = 'user'
      console.log('选择 ' + this.orgPickerType)
      this.$refs.orgPicker.show()
    },
    selectOrgDept() {
      this.orgPickerSelected = this.selectDept
      this.orgPickerType = 'dept'
      console.log('选择 ' + this.orgPickerType)
      this.$refs.orgPicker.show()
    },
    selectNoSetUser() {
      this.orgPickerSelected = this.config.nobody.assignedUser
      this.orgPickerType = 'user'
      this.$refs.orgPicker.show()
    },
    selectRole() {
      this.orgPickerType = 'role'
      if (this.config.assignedType === 'ASSIGN_LEADER' || this.config.assignedType === 'FORM_DEPT'){
        this.orgPickerSelected = this.config.deptProp.roles
      }else {
        this.orgPickerSelected = this.config.role
      }
      this.$refs.orgPicker.show()
    },
    selected(select) {
      this.orgPickerSelected.length = 0
      select.forEach((val) => this.orgPickerSelected.push(val))
    },
    removeOrgItem(index) {
      this.select.splice(index, 1)
    },
  },
}
</script>

<style lang="less" scoped>
.user-type {
  :deep(.el-radio) {
    width: 110px;
    margin-bottom: 20px;
  }
}

:deep(.line-mode) {
  .el-radio {
    margin-right: 40px;
  }
}

:deep(.el-form-item__label) {
  line-height: 25px;
}

:deep(.approve-mode) {
  .el-radio {
    float: left;
    width: 100%;
    display: block;
    margin-top: 5px;
  }
}

:deep(.approve-end) {
  position: relative;

  .el-radio {
    margin-bottom: 5px;
    width: 100%;
  }

  .approve-end-leave {
    position: absolute;
    bottom: 26px;
    left: 150px;
  }
}

:deep(.el-divider--horizontal) {
  margin: 10px 0;
}
</style>
