//审批节点默认属性
export const APPROVAL_PROPS = {
  assignedType: "ASSIGN_USER",
  mode: "AND",
  sign: false,
  nobody: {
    handler: "TO_PASS",
    assignedUser: []
  },
  timeLimit: {
    timeout: {
      unit: "H",
      value: 0
    },
    handler: {
      type: "REFUSE",
      notify: {
        once: true,
        hour: 1
      }
    }
  },
  assignedDept:[],
  deptProp: { //指定部门/表单内部门子设置
    type: 'LEADER', //ALL=全部人员 / LEADER=主管 / ROLE=部门下的角色
    roles: [] //设置值
  },
  assignedUser: [],
  formPerms: [],
  selfSelect: {
    multiple: false
  },
  leaderTop: {
    endCondition: "TOP",
    endLevel: 0,
    skipEmpty: false //当前级别部门未设置主管时，是否跳过
  },
  leader: {
    level: 1,
    skipEmpty: true //当前级别部门未设置主管时，是否跳过再寻找父级
  },
  role: [],
  refuse: {
    type: 'TO_END', //驳回规则 TO_END  TO_NODE  TO_BEFORE
    target: '' //驳回到指定ID的节点
  },
  operationPerm: {
    agree: {alisa: '同意', show: true},
    refuse: {alisa: '拒绝', show: true},
    transfer: {alisa: '转交', show: true},
    afterAdd: {alisa: '后加签', show: true},
    recall: {alisa: '退回', show: true},
  },
  listeners: {},
  assignedNode: [], //指定审批人的节点ID
  formUser: '', //表单内人员组件ID
  formDept: '', //表单内部门组件ID
}

//办理节点配置属性
export const TASK_PROPS = {
  assignedType: "ASSIGN_USER",
  mode: "AND",
  nobody: {
    handler: "TO_PASS",
    assignedUser: []
  },
  timeLimit: {
    timeout: {
      unit: "H",
      value: 0
    },
    handler: {
      type: "PASS",
      notify: {
        once: true,
        hour: 1
      }
    }
  },
  assignedDept:[],
  deptProp: {
    type: 'LEADER', //ALL=全部人员 / LEADER=主管 / ROLE=部门下的角色
    roles: [] //设置值
  },
  assignedUser: [],
  formPerms: [],
  selfSelect: {
    multiple: false
  },
  leaderTop: {
    endCondition: "TOP",
    endLevel: 0,
    skipEmpty: false //当前级别部门未设置主管时，是否跳过
  },
  leader: {
    level: 1,
    skipEmpty: true //当前级别部门未设置主管时，是否跳过再寻找父级
  },
  role: [],
  operationPerm: {
    complete: {alisa: '提交', show: true},
    transfer: {alisa: '转办', show: true},
    recall: {alisa: '退回', show: true},
  },
  listeners: {},
  assignedNode: [], //指定审批人的节点ID
  formUser: '', //表单内人员组件ID
  formDept: '', //表单内部门组件ID
}

//根节点默认属性
export const ROOT_PROPS = {
  assignedUser: [],
  formPerms: [],
  listeners: {},
  operationPerm: {
    complete: {alisa: '提交', show: true}
  }
}

//条件节点默认属性
export const CONDITION_PROPS = {
  mode: 'SIMPLE',
  groupsType: "OR", //条件组逻辑关系 OR、AND
  groups: [
    {
      groupType: "AND", //条件组内条件关系 OR、AND
      cids: [], //条件ID集合
      conditions: [] //组内子条件
    }
  ],
  expression: "", //自定义表达式，灵活构建逻辑关系
  http: {
    method: 'GET',
    url: '',
    contentType: 'form',
    params: [
      {name: '', value: ''}
    ],
    headers: [
      {name: '', value: ''}
    ],
    pre: 'function preHandler(ctx){\n\t//发起请求前做一些处理\n\t\n}',
    aft: 'function aftHandler(rsp){\n\t//获取到结果后做一些处理\n\t\n}'
  }
}

//抄送节点默认属性
export const CC_PROPS = {
  shouldAdd: false,
  assignedUser: [],
  formPerms: []
}

//触发器节点默认属性
export const TRIGGER_PROPS = {
  type: 'WEBHOOK',
  http: {
    method: 'GET', //请求方法 支持GET/POST
    url: '', //URL地址，可以直接带参数
    headers: [ //http header
      {
        name: '',
        isField: true,
        value: '' //支持表达式 ${xxx} xxx为表单字段名称
      }
    ],
    contentType: 'FORM', //请求参数类型
    params: [ //请求参数
      {
        name: '',
        isField: true, //是表单字段还是自定义
        value: '' //支持表达式 ${xxx} xxx为表单字段名称
      }
    ],
    retry: 1,
    handlerByScript: false,
    success: 'function handlerOk(res) {\n  return true;\n}',
    fail: 'function handlerFail(res) {\n  return true;\n}'
  },
  email: {
    subject: '',
    to: [],
    content: ''
  }
}

//延时节点默认属性
export const DELAY_PROPS = {
  type: "FIXED", //延时类型 FIXED:到达当前节点后延时固定时长 、AUTO:延时到 dateTime设置的时间
  time: 0, //延时时间
  unit: "M", //时间单位 D天 H小时 M分钟
  dateTime: "" //如果当天没有超过设置的此时间点，就延时到这个指定的时间，到了就直接跳过不延时
}

//子流程节点
export const SUB_PROC_PROPS = {
  subProcCode: null, //子流程编号，流程定义Id
  formPerms: [],
  staterUser: { //子流程发起人
    type: 'ROOT', //ROOT=与主流程一致 / CUSTOM=自选一个人
    value: null //发起人
  },
  startDept: null, //发起d部门ID
  syncVersion: false, //是否每次调用子流程的最新版本
  subAll: false, //是否传递所有变量
  inVar: [ //主->子
    {mKey: null, sKey: null}
  ],
  outVar: [ //子 -> 主
    {mKey: null, sKey: null}
  ]
}

export default {
  APPROVAL_PROPS, TASK_PROPS, CC_PROPS, DELAY_PROPS, CONDITION_PROPS, ROOT_PROPS, TRIGGER_PROPS, SUB_PROC_PROPS
}
