<script>
import {getGroupModels} from '@/api/modelGroup.js'

export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    rangeText: {
      type: Array,
      default: () => {
        return ['开始时间', '结束时间']
      }
    },
    keywordText: {
      type: String,
      default: '发起人、流程名'
    },
    showCode: {
      type: Boolean,
      default: true
    },
    showFinished: {
      type: Boolean,
      default: true
    },
    showStartTimes: {
      type: Boolean,
      default: true
    },
    showKeyword: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      options: [],
      pickerOptions: [
        {
          text: '近一小时',
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000);
            return [start, end]
          }
        },
        {
          text: '近一天',
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24);
            return [start, end]
          }
        }, {
          text: '最近一周',
          value: () =>{
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end]
          }
        }, {
          text: '最近一个月',
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end]
          }
        }, {
          text: '最近三个月',
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end]
          }
        }
      ]
    }
  },
  computed: {
    _value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  mounted() {
    this.loadFormList()
  },
  methods: {
    loadFormList() {
      getGroupModels().then(res => {
        res.data.forEach(group => {
          this.options.push({
            value: group.id,
            label: group.name,
            children: group.items.map(it => {
              return {
                value: it.formId,
                label: it.formName,
              }
            })
          })
        })
      }).catch((err) => {
        this.$err(err, '获取流程清单异常')
      })
    }
  },
  emits: ['update:modelValue']
}

</script>

<template>
  <div class="w-search">
    <el-cascader v-if="showCode" clearable :show-all-levels="false" :props="{emitPath: false}"
                 v-model="_value.code" style="width: 150px;" placeholder="筛选流程" :options="options"/>
    <div style="margin: 0 20px;" v-if="showStartTimes">
      <el-date-picker v-model="_value.startTimes"
                      type="datetimerange" :shortcuts="pickerOptions" range-separator="至"
                      :start-placeholder="rangeText[0]" :end-placeholder="rangeText[1]"
                      align="right" value-format="YYYY-MM-DD HH:mm:ss"/>
    </div>
    <el-select v-if="showFinished" style="width: 150px; margin-right: 20px"
               placeholder="流程状态" v-model="_value.finished">
      <el-option :value="null" label="状态-全部"/>
      <el-option :value="false" label="状态-进行中"/>
      <el-option :value="true" label="状态-已结束"/>
    </el-select>
    <el-input v-if="showKeyword" style="width: 250px;" prefix-icon="search"
              :placeholder="`搜索关键字（${keywordText}）`"
              clearable v-model="_value.keyword"/>
  </div>
</template>

<style scoped lang="less">
.w-search {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
