<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <draggable class="l-drag-from" item-key="id" v-model="_items"
                 :component-data="{tag: 'div', type: 'transition-group'}" v-bind="dragProps"
                 @start="drag = true; selectFormItem = null" @end="drag = false">
        <template #item="{element, index}">
          <div class="l-form-item" @click.stop="selectItem(element)" :style="getSelectedClass(element)">
            <div class="l-form-header">
              <p><span v-if="element.props.required">*</span>{{ element.title }}</p>
              <div class="l-option">
                <!--<el-icon name="el-icon-copy-document" @click="copy"></el-icon>-->
                <el-icon @click="delItem(index)"><close/></el-icon>
              </div>
              <form-design-render :config="element" />
            </div>
          </div>
        </template>

      </draggable>
      <div style="color: #c0bebe; text-align: center; width: 90%; padding: 5px">
        ☝ 拖拽控件到布局容器内部
      </div>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-row :gutter="20" v-for="(rows, rsi) in __items" :key="rsi + '_rows'">
        <el-col :span="24 / rows.length" v-for="(item, ri) in rows" :key="ri + '_row'" v-show="showItem(item)">
          <el-form-item v-if="item.name !== 'SpanLayout' && item.name !== 'Description'" :prop="item.id" :label="item.title">
            <form-design-render :formData="formData" :readonly="isReadonly(item)" v-model="_value[item.id]" :mode="mode" :config="item"/>
          </el-form-item>
          <form-design-render :formData="formData" :readonly="isReadonly(item)" v-else v-model="_value" :mode="mode" :config="item"/>
        </el-col>
      </el-row>
    </div>
    <div v-else-if="mode === 'PC'">
      <div v-for="(item, rsi) in _items" :key="rsi + '_rows'" v-show="showItem(item)">
        <el-form-item v-if="item.name !== 'SpanLayout' && item.name !== 'Description'" :prop="item.id" :label="item.title">
          <form-design-render :formData="formData" :readonly="isReadonly(item)" v-model="_value[item.id]" :mode="mode" :config="item"/>
        </el-form-item>
        <form-design-render :formData="formData" :readonly="isReadonly(item)" v-else v-model="_value" :mode="mode" :config="item"/>
      </div>
    </div>
    <div v-else>
      <div v-for="(item, i) in _items" :key="'column_' + i" v-show="showItem(item)">
        <form-item v-if="item.name !== 'SpanLayout' && item.name !== 'Description'"
          :model="_value" :rule="rules[item.id]" :ref="item.id" :prop="item.id" :label="item.title">
          <form-design-render :formData="formData" :readonly="isReadonly(item)" v-model="_value[item.id]" :mode="mode" :config="item"/>
        </form-item>
        <form-design-render :formData="formData" :readonly="isReadonly(item)" v-else :ref="item.id" v-model="_value" :mode="mode" :config="item"/>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import FormItem from '@/components/common/FormItem.vue'
import FormDesignRender from '@/views/admin/layout/form/FormDesignRender.vue'
import componentMinxins from '../ComponentMinxins'
import {ValueType} from "../ComponentsConfigExport";
export default {
  mixins: [componentMinxins],
  name: 'SpanLayout',
  components: { draggable, FormItem, FormDesignRender },
  props: {
    modelValue: {
      default: null,
    },
    items: {
      type: Array,
      default: () => {
        return []
      },
    },
    number: {
      type: Number,
      default: 2
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    rules() {
      let rules = {}
      this.items.forEach((v) => {
        if (v.props.required) {
          rules[v.id] = [
            {
              type: ValueType.getValidType(v.valueType),
              required: true,
              message: '请完成' + v.title,
              trigger: 'blur' },
          ]
        }
      })
      return rules
    },
    _items: {
      get() {
        return this.items
      },
      set(val) {
        this.$emit('update:items', val)
      },
    },
    __items() {
      let result = []
      for (let i = 0; i < this.items.length; i++) {
        if (i > 0 && i % this.number === 0) {
          result.push([this.items[i]])
        }else {
          let row = result[parseInt(i / this.number)]
          if (row){
            row.push(this.items[i])
          }else {
            result.push([this.items[i]])
          }
        }
      }
      return result
    },
    selectFormItem: {
      get() {
        return this.$store.state.selectFormItem
      },
      set(val) {
        this.$store.state.selectFormItem = val
        return true
      },
    },
    nodeMap() {
      return this.$store.state.nodeMap
    },
  },
  data() {
    return {
      select: null,
      drag: false,
      formConfig: {
        //数据字段
        data: {},
        //校验规则
        rules: {},
      },
      dragProps:{
        animation: 300,
        group: "form",
        disabled: false,
        sort: true,
        ghostClass: "choose",
      },
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
  methods: {
    showItem(item) {
      return ((!(this.isReadonly(item) && this.isBlank(this._value[item.id])))
        || item.name === 'SpanLayout') && item.perm !== 'H'
    },

    isBlank(val) {
      return (
        !this.$isNotEmpty(val) ||
        (val instanceof String && val.trim() === '') ||
        (Array.isArray(val) && val.length === 0)
      )
    },
    isReadonly(item) {
      return item.perm === 'R'
    },
    selectItem(cp) {
      this.selectFormItem = cp
    },
    getSelectedClass(cp) {
      return this.selectFormItem && this.selectFormItem.id === cp.id
        ? 'border-left: 4px solid #f56c6c'
        : ''
    },
    delItem(index) {
      this.$confirm(
        '删除组件将会连带删除包含该组件的条件以及相关设置，是否继续?',
        '提示',
        {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          type: 'warning',
        }
      ).then(() => {
        if (this._items[index].name === 'SpanLayout') {
          //删除的是分栏则遍历删除分栏内所有子组件
          this._items[index].props.items.forEach((item) => {
            this.removeFormItemAbout(item)
          })
          this._items[index].props.items.length = 0
        } else {
          this.removeFormItemAbout(this._items[index])
        }
        this._items.splice(index, 1)
      })
    },
    validate(call) {
      let success = true
      this.items.forEach((form) => {
        let formRef = this.$refs[form.id]
        if (formRef && Array.isArray(formRef) && formRef.length > 0  && form.perm === 'E') {
          formRef[0].validate((subValid) => {
            if (!subValid) {
              success = false
            }
          })
        }
      })
      call(success)
    },
    async removeFormItemAbout(item) {
      this.nodeMap.forEach((node) => {
        //搜寻条件，进行移除
        if (node.type === 'CONDITION') {
          node.props.groups.forEach((group) => {
            let i = group.cids.remove(item.id)
            if (i > -1) {
              //从子条件移除
              group.conditions.splice(i, 1)
            }
          })
        }
        //搜寻权限，进行移除
        if (
          node.type === 'ROOT' ||
          node.type === 'APPROVAL' ||
          node.type === 'CC'
        ) {
          node.props.formPerms.removeByKey('id', item.id)
        }
      })
    },
  },
  emits: ['update:modelValue', 'update:items'],
}
</script>

<style lang="less" scoped>
.choose {
  border: 1px dashed @theme-primary!important;
}
.l-drag-from {
  min-height: 50px;
  background-color: rgb(245, 246, 246);
  .l-form-item,
  li {
    cursor: grab;
    background: #ffffff;
    padding: 10px;
    border: 1px solid #ebecee;
    margin: 5px 0;
  }
}
.l-form-header {
  font-size: small;
  color: #818181;
  text-align: left;
  position: relative;
  background-color: #fff;
  p {
    position: relative;
    margin: 0 0 10px 0;

    span {
      position: absolute;
      left: -8px;
      top: 3px;
      color: rgb(217, 0, 19);
    }
  }

  .l-option {
    position: absolute;
    top: -10px;
    right: -10px;

    :deep(.icon) {
      font-size: large;
      cursor: pointer;
      color: #8c8c8c;
      padding: 5px;

      &:hover {
        color: @theme-primary;
      }
    }
  }
}
</style>
