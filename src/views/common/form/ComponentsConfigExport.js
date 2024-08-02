export const ValueType = {
  string: 'String',
  object: 'Object',
  array: 'Array',
  number: 'Number',
  date: 'Date',
  user: 'User',
  dept: 'Dept',
  dateRange: 'DateRange',
  getValidType: (type) => {
    switch (type) {
      case 'Dept':
      case 'User':
      case 'DateRange':
        return 'array'
      case 'Array':
      case 'Number':
      case 'String':
        return type.toLowerCase()
      default:
        return undefined
    }
  }
}

export const baseComponents = [
  {
    name: '布局',
    components: [
      {
        title: '分栏布局',
        name: 'SpanLayout',
        icon: 'tabler:layout-columns',
        value: [],
        valueType: ValueType.array,
        props: {
          items:[],
          number: 2 //分几栏，均等分能被24整除
        }
      }
    ]
  }, {
    name: '基础组件',
    components: [
      {
        title: '单行文本输入',
        name: 'TextInput',
        icon: 'iconamoon:edit',
        key: '',
        valueType: ValueType.string,
        props: {
          enableScan: false,
          required: false,
          enablePrint: true,
          abstract: false
        }
      },
      {
        title: '多行文本输入',
        name: 'TextareaInput',
        icon: 'solar:list-down-line-duotone',
        key: '',
        valueType: ValueType.string,
        props: {
          enableScan: false,
          required: false,
          enablePrint: true,
          abstract: false
        }
      },
      {
        title: '数字输入框',
        name: 'NumberInput',
        icon: 'tabler:123',
        key: '',
        valueType: ValueType.number,
        props: {
          required: false,
          enablePrint: true,
          precision: undefined,
          abstract: false
        }
      },
      {
        title: '金额输入框',
        name: 'AmountInput',
        icon: 'f7:money-yen-circle',
        key: '',
        valueType: ValueType.number,
        props: {
          required: false,
          enablePrint: true,
          showChinese: true,
          precision: undefined,
          abstract: false
        }
      },
      {
        title: '单选框',
        name: 'SelectInput',
        icon: 'mdi:radiobox-marked',
        key: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: true,
          expanding: false,
          options: ['选项1', '选项2'],
          abstract: false
        }
      },
      {
        title: '多选框',
        name: 'MultipleSelect',
        icon: 'mingcute:multiselect-line',
        key: '',
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: true,
          expanding: false,
          options: ['选项1', '选项2'],
          abstract: false
        }
      },
      {
        title: '时间选择',
        name: 'TimePicker',
        icon: 'gridicons:time',
        key: '',
        valueType: ValueType.date,
        props: {
          required: false,
          enablePrint: true,
          abstract: false
        }
      },
      {
        title: '时间范围选择',
        name: 'TimeRangePicker',
        icon: 'zmdi:time-interval',
        key: '',
        valueType: ValueType.dateRange,
        props: {
          required: false,
          enablePrint: true,
          placeholder: ['开始时间', '结束时间'],
          showLength: false,
          abstract: false
        }
      },
      {
        title: '日期时间点',
        name: 'DateTime',
        icon: 'material-symbols:calendar-clock-outline',
        key: '',
        valueType: ValueType.date,
        props: {
          required: false,
          enablePrint: true,
          format: 'YYYY-MM-DD HH:mm',
          abstract: false
        }
      },
      {
        title: '日期时间区间',
        name: 'DateTimeRange',
        icon: 'material-symbols:calendar-month-outline',
        key: '',
        valueType: ValueType.dateRange,
        props: {
          required: false,
          enablePrint: true,
          placeholder: ['开始时间', '结束时间'],
          format: 'YYYY-MM-DD HH:mm',
          showLength: false,
          abstract: false
        }
      },
      {
        title: '上传图片',
        name: 'ImageUpload',
        icon: 'mingcute:pic-2-line',
        key: '',
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: true,
          maxSize: 5, //图片最大大小MB
          maxNumber: 10, //最大上传数量
          enableZip: true, //图片压缩后再上传
          abstract: false
        }
      },
      {
        title: '上传附件',
        name: 'FileUpload',
        icon: 'material-symbols:folder-open-outline',
        key: '',
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: true,
          onlyRead: false, //是否只读，false只能在线预览，true可以下载
          maxSize: 100, //文件最大大小MB
          maxNumber: 10, //最大上传数量
          fileTypes: [], //限制文件上传类型
          abstract: false
        }
      },
      {
        title: '人员选择',
        name: 'UserPicker',
        icon: 'gravity-ui:persons',
        key: '',
        valueType: ValueType.user,
        props: {
          required: false,
          enablePrint: true,
          multiple: false,
          expansion: false,
          options: [],
          abstract: false
        }
      },
      {
        title: '部门选择',
        name: 'DeptPicker',
        icon: 'fluent:organization-24-regular',
        key: '',
        valueType: ValueType.dept,
        props: {
          required: false,
          enablePrint: true,
          multiple: false,
          expansion: false,
          options: [],
          abstract: false
        }
      },{
        title: '评分',
        name: 'Score',
        icon: 'fluent:star-12-regular',
        key: '',
        valueType: ValueType.number,
        props: {
          required: false,
          enablePrint: true,
          color: '#f0a732',
          max: 5,
          showScore: true,
          enableHalf: false,
          type: 'star',
          abstract: false
        }
      },
      {
        title: '说明文字',
        name: 'Description',
        icon: 'clarity:info-standard-line',
        key: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: true,
          color: '#818181',
          abstract: false
        }
      },
    ]
  }, {
    name: '扩展组件',
    components: [
      {
        title: '明细表',
        name: 'TableList',
        icon: 'mdi:table',
        key: '',
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: true,
          showBorder: true,
          rowLayout: true,
          showSummary: false,
          summaryColumns: [],
          maxSize: 0, //最大条数，为0则不限制
          columns:[], //列设置
          abstract: false
        }
      },
      {
        title: '高级选择器',
        name: 'SelectPlus',
        icon: 'iconoir:open-select-hand-gesture',
        key: '',
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: true,
          multiple: false, //是否多选
          expanding: false, //是否展开选项
          fixed: false, //是否是手动设置的固定项
          options: [], //固定项
          http: {},
          abstract: false
        }
      },
      {
        title: '地理位置',
        name: 'Location',
        icon: 'material-symbols:location-on-outline',
        key: '',
        valueType: ValueType.object,
        props: {
          required: false,
          enablePrint: true,
          enableEdit: false,
          abstract: false
        }
      },
      {
        title: '省市区',
        name: 'Provinces',
        icon: 'material-symbols:local-see-outline',
        key: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: true,
          level: 3,
          abstract: false
        }
      },
      {
        title: '签名',
        name: 'SignPanel',
        icon: 'majesticons:edit-pen-4',
        key: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: true,
          thickness: 2,
          color: '#000000',
          abstract: false
        }
      },
      {
        title: '流程关联',
        name: 'ProcessIndex',
        icon: 'solar:link-round-bold',
        key: '',
        valueType: ValueType.array,
        props: {
          required: false,
          enablePrint: false,
          processCode: null,
          abstract: false
        }
      }, {
        title: '计算公式',
        name: 'CalcFormula',
        icon: 'pajamas:formula',
        key: '',
        valueType: ValueType.number,
        props: {
          precision: 0,
          required: false,
          enablePrint: false,
          isPlus: false,
          jsCode: '',
          explain: [],
          abstract: false
        }
      },
      {
        title: '外部表单',
        name: 'OuterForm',
        icon: 'material-symbols:sheets-add-on',
        key: '',
        valueType: ValueType.object,
        props: {
          required: false,
          enablePrint: true,
          isCodeForm: true, //是否是代码写的内部表单
          path: null, //表单访问路径，如果是代码写的表单就是组件地址，url表单就是url地址
          formProps: null, //表单的属性设置信息
          height: '',
          abstract: false
        }
      },
      {
        title: '网页iframe',
        name: 'WebIframe',
        icon: 'mingcute:chrome-line',
        key: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: false,
          url: '',
          height: 200,
          abstract: false
        }
      },
      {
        title: 'Vue容器',
        name: 'VueContainer',
        icon: 'la:vuejs',
        key: '',
        valueType: ValueType.string,
        props: {
          required: false,
          enablePrint: false,
          template: null,
          cpStyle: null,
          cpJs: null,
          abstract: false
        }
      },
    ]
  }
]

export default {
  baseComponents,
}
