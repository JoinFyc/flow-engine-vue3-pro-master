<template>
  <el-form inline label-width="100px">
    <el-form-item v-if="config.mode === 'SIMPLE'" label="条件组关系">
      <el-switch v-model="config.groupsType" active-color="#409EFF"
                 inactive-color="#c1c1c1" active-value="AND" inactive-value="OR"
                 active-text="且" inactive-text="或">
      </el-switch>
    </el-form-item>
    <el-form-item label="条件设置模式">
      <el-radio-group v-model="config.mode">
        <el-radio label="SIMPLE">简单模式</el-radio>
        <el-radio label="UEL">逻辑表达式</el-radio>
        <el-radio label="JS">JS解析</el-radio>
        <el-radio label="HTTP">网络请求</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="表达式设置" v-if="config.mode === 'UEL'">
      <el-input size="medium" style="width: 410px;" v-model="config.expression" placeholder="输入返回值为true / false 的SpringEl表达式">
        <el-button slot="append" @click="validateEl">校验</el-button>
      </el-input>
      <div class="item-desc">使用能返回true / false 的 SpringEl表达式构建复杂逻辑，谨慎使用</div>
    </el-form-item>
    <div v-if="config.mode === 'SIMPLE'">
      <el-button type="primary" size="small" icon="plus" style="margin: 0 15px 15px 0" round @click="addConditionGroup">
        添加条件组
      </el-button>
      <span class="item-desc">📢表单字段设置为必填才能作为审批条件</span>
      <group-item/>
    </div>
    <div v-else-if="config.mode === 'JS'">
      <code-editor ref="jsCode" v-model="config.js" :default-value="'//编写js脚本执行逻辑解析条件，返回true / false \r\n //默认注入上下文变量ctx \r\n return false'"/>
    </div>
    <div v-if="config.mode === 'HTTP'">
      <http-req v-model="config.http"/>
    </div>
  </el-form>
</template>

<script>
import draggable from "vuedraggable";
import GroupItem from "./ConditionGroupItemConfig.vue"
import HttpReq from "@/components/common/HttpReq.vue";
import CodeEditor from "@/components/common/CodeEditor.vue";
import {validateEl} from "@/api/process";

export default {
  name: "InclusiveNodeConfig",
  components: {CodeEditor, HttpReq, draggable, GroupItem},
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    selectedNode() {
      return this.$store.state.selectedNode
    },
    select() {
      return this.config.assignedUser || []
    },
    nowNodeLeave() {
      return this.prioritySortList.indexOf(this.selectedNode)
    },
    //条件节点
    prioritySortList() {
      let node = this.$store.state.nodeMap.get(this.selectedNode.parentId)
      console.log(this.selectedNode.id, node)
      if (node) {
        return node.branchs || []
      }
      return []
    }
  },
  data() {
    return {
      sortOption: {
        animation: 300,
        chosenClass: 'choose',
        scroll: true,
        sort: true
      }
    }
  },
  methods: {
    addConditionGroup() {
      this.config.groups.push({
        cids:[],
        groupType: "OR",
        conditions:[]
      })
    },
    validateEl(){
      validateEl(this.config.expression).then(rsp => {
        this.$ok(rsp.data, '校验成功')
      }).catch(err => this.$err(err, 'El表达式校验失败'))
    },
    selectUser() {
      this.showOrgSelect = true
    },
    selected(select) {
      console.log(select)
      this.showOrgSelect = false
      select.forEach(val => this.select.push(val))
    },
    removeOrgItem(index) {
      this.select.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.choose {
  border-radius: 5px;
  margin-top: 2px;
  background: #f4f4f4;
  border: 1px dashed #1890FF !important;
}

.drag-hover {
  color: #1890FF
}

.drag-no-choose {
  cursor: move;
  background: #f8f8f8;
  border-radius: 5px;
  margin: 5px 0;
  height: 25px;
  line-height: 25px;
  padding: 5px 10px;
  border: 1px solid #ffffff;
  div{
    display: inline-block;
    font-size: small !important;
  }

  div:nth-child(2) {
    float: right !important;
  }
}
</style>
