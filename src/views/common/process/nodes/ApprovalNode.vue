<template>
  <node
    v-model:title="config.name"
    :show-error="showError"
    :content="content"
    :error-info="errorInfo"
    @selected="$emit('selected')"
    @delNode="$emit('delNode')"
    @insertNode="(type) => $emit('insertNode', type)"
    placeholder="请设置审批人"
    header-bgc="#f78f5f"
    header-icon="stamp"
  />
</template>

<script>
import Node from './Node.vue'

export default {
  name: 'ApprovalNode',
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  components: { Node },
  data() {
    return {
      showError: false,
      errorInfo: '',
    }
  },
  computed: {
    formItems() {
      return this.$store.state.design.formItems
    },
    nodeMap() {
      return this.$store.state.nodeMap
    },
    content() {
      const config = this.config.props
      switch (config.assignedType) {
        case 'ASSIGN_USER':
          if (config.assignedUser.length > 0) {
            let texts = []
            config.assignedUser.forEach((org) => texts.push(org.name))
            return String(texts).replaceAll(',', '、')
          } else {
            return '请指定审批人'
          }
        case 'SELF':
          return '发起人自己'
        case 'SELF_SELECT':
          return config.selfSelect.multiple
            ? '发起人自选多人'
            : '发起人自选一人'
        case 'LEADER_TOP':
          return '多级主管依次审批'
        case 'LEADER':
          return config.leader.level > 1
            ? '发起人的第 ' + config.leader.level + ' 级主管'
            : '发起人的直接主管'
        case 'FORM_USER':
          if (!config.formUser || config.formUser === '') {
            return '表单内联系人（未选择）'
          } else {
            let text = this.getFormItemById(this.formItems, config.formUser)
            if (text && text.title) {
              return `表单（${text.title}）内的人员`
            } else {
              return '该表单项已被移除😥'
            }
          }
        case 'ROLE':
          if (config.role.length > 0) {
            return `角色 [${String(config.role.map((r) => r.name)).replaceAll(
              ',',
              '、'
            )}] `
          } else {
            return '指定角色（未设置）'
          }
        case 'REFUSE':
          return '系统自动拒绝审批'
        case 'FORM_DEPT':
          if (!config.formDept || config.formDept === '') {
            return '表单内部门（未选择）'
          } else {
            let text = this.getFormItemById(this.formItems, config.formDept)
            if (text && text.title) {
              return `表单（${text.title}）` + this.getDeptType(config.deptProp || {})
            } else {
              return '该表单项已被移除😥'
            }
          }
        case 'ASSIGN_LEADER':
          if ((config.assignedDept || []).length > 0) {
            let texts = []
            config.assignedDept.forEach(org => texts.push(org.name))
            return String(texts).replaceAll(',', '、') + this.getDeptType(config.deptProp || {})
          } else {
            return '请指定部门'
          }
        case 'OTHER_SELECT':
          if ((config.assignedNode || []).length === 0) {
            return '请指定审批节点'
          } else {
            const tip = config.assignedNode.map(v => (this.nodeMap.get(v) || {}).name || '未知节点').join('、')
            return `指定节点（${tip}）`
          }
        default:
          return '未知设置项😥'
      }
    },
  },
  methods: {
    getDeptType(dept) {
      if (dept.type === 'ALL') {
        return '内所有人'
      } else if (dept.type === 'LEADER') {
        return '的部门负责人'
      } else if (dept.type === 'ROLE') {
        return '下的角色[ ' + (dept.roles || []).map(v => v.name).join('、') + ' ]'
      }else {
        return ''
      }
    },
    getFormItemById(items, id) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].name === 'SpanLayout') {
          let result = this.getFormItemById(items[i].props.items, id)
          if (result) {
            return result
          }
        } else if (items[i].id === id) {
          return items[i]
        }
      }
      return null
    },
    //校验数据配置的合法性
    validate(err) {
      try {
        return (this.showError =
          !this[`validate_${this.config.props.assignedType}`](err))
      } catch (e) {
        return true
      }
    },
    validate_ASSIGN_USER(err) {
      if (this.config.props.assignedUser.length > 0) {
        return true
      } else {
        this.errorInfo = '请指定审批人员'
        err.push(`${this.config.name} 未指定审批人员`)
        return false
      }
    },
    validate_ASSIGN_LEADER(err) {
      const config = this.config
      if ((config.props.assignedDept || []).length > 0) {
        if (config.props.deptProp.type === 'ROLE' && config.props.deptProp.roles.length === 0) {
          this.errorInfo = '请指定部门下的角色'
          err.push(`${config.name} 未指定部门下的角色`)
          return false
        }
        return true
      } else {
        this.errorInfo = '请指定要审批的部门'
        err.push(`${this.config.name} 未指定审批部门`)
        return false
      }
    },
    validate_SELF_SELECT(err) {
      return true
    },
    validate_LEADER_TOP(err) {
      return true
    },
    validate_LEADER(err) {
      return true
    },
    validate_ROLE(err) {
      if (this.config.props.role.length <= 0) {
        this.errorInfo = '请指定负责审批的系统角色'
        err.push(`${this.config.name} 未指定审批角色`)
        return false
      }
      return true
    },
    validate_SELF(err) {
      return true
    },
    validate_FORM_USER(err) {
      if ((this.config.props.formUser || '') === '') {
        this.errorInfo = '请指定表单中的人员组件'
        err.push(`${this.config.name} 审批人为表单中人员，但未指定`)
        return false
      }
      return true
    },
    validate_FORM_DEPT(err) {
      if ((this.config.props.formDept || '') === '') {
        this.errorInfo = '请指定表单中的部门选择组件'
        err.push(`${this.config.name} 为表单中的部门，但未指定`)
        return false
      }else if (this.config.props.deptProp.type === 'ROLE' && this.config.props.deptProp.roles.length === 0) {
        this.errorInfo = '请指定部门下的角色'
        err.push(`${this.config.name} 未指定部门下的角色`)
        return false
      }
      return true;
    },
    validate_OTHER_SELECT(err) {
      const nodes = this.config.props.assignedNode
      if (nodes.length === 0) {
        this.errorInfo = '请指定设置审批人的节点'
        err.push(`${this.config.name} 未指定设置审批人的节点`)
        return false
      }
      for (let i = 0; i < nodes; i++) {
        const node = this.nodeMap.get(nodes[i])
        if (!node) {
          this.errorInfo = '指定的审批不存在'
          err.push(`${this.config.name} 指定的节点不存在`)
          return false
        } else if ((this.config.props.assignedNode || '') === '') {
          this.errorInfo = '请指定节点'
          err.push(`${this.config.name} 未指定节点`)
          return false
        }
      }
      return true
    },
    validate_REFUSE(err) {
      return true
    },
  },
  emits: ['selected', 'delNode', 'insertNode'],
}
</script>

<style scoped></style>
