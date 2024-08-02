<template>
  <el-form class="w-el-form" v-loading="loading" label-position="top">
    <el-form-item label="🛠️ 选择子流程">
      <el-cascader placeholder="选择子流程" v-model="config.subProcCode" :props="{emitPath: false}" :show-all-levels="false" :options="options">
        <template v-slot="{ node, data }">
          <template v-if="node.isLeaf">
            <!--第一版本且未发布的子流程不允许选择-->
            <el-tag type="success" v-if="data.procDefId">v{{data.version}}</el-tag>
            <el-tag type="warning" v-else>v{{data.version}}</el-tag>
          </template>
          <span style="margin-left: 5px">{{ data.label }}</span>
        </template>
      </el-cascader>
      <el-button type="primary" link style="margin-left: 10px" icon="view" @click="viewProc">查看子流程</el-button>
    </el-form-item>
    <el-form-item label="🧑‍💼 选择子流程发起人">
      <el-radio-group v-model="config.staterUser.type" @change="config.staterUser.value = null">
        <el-radio label="ROOT">同主流程</el-radio>
        <el-radio label="FORM">表单选择</el-radio>
        <el-radio label="SELECT">指定人员</el-radio>
      </el-radio-group>
      <div v-if="config.staterUser.type === 'FORM'">
        <el-select v-model="config.staterUser.value" placeholder="选择表单人员字段">
          <el-option :label="field.label" :key="field.value" :value="field.value" v-for="field in userForms"></el-option>
        </el-select>
        <span class="w-desc-text" style="margin-left: 10px">🎈表单选人字段设置需为必填</span>
      </div>
      <div v-if="config.staterUser.type === 'SELECT'">
        <el-button type="primary" icon="user" @click="$refs.orgPicker.show()" round>选择指定人员</el-button>
        <el-tag style="margin-left: 20px" v-if="config.staterUser.value">{{config.staterUser.value.name}}</el-tag>
        <org-picker title="选择指定人员作为子流程发起人" type="user" ref="orgPicker" :selected="[]" @ok="selected"/>
      </div>
    </el-form-item>
    <el-form-item label="✨ 是否每次都调用最新版本的子流程">
      <el-switch v-model="config.syncVersion"></el-switch>
      <span class="w-desc-text" style="margin-left: 10px">{{config.syncVersion ? '每次调用最新版子流程':'仅调用主流程发布时的子流程版本'}}</span>
    </el-form-item>
    <el-form-item label="⤵️ 从主流程传递上下文到子流程">
      <div>
        传递所有变量：
        <el-switch v-model="config.subAll" style="margin-right: 10px"></el-switch>
        <el-button type="primary" link icon="plus" v-if="!config.subAll" @click="addSubVar">新增数据传递</el-button>
        <span v-if="config.subAll" class="w-desc-text">不建议这么干😘</span>
        <div v-else>
          <div v-for="(v, i) in config.inVar" :key="i + 'subVar'" class="row-var">
            - <el-select v-model="v.mKey">
              <el-option-group v-for="group in varOptions" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-option-group>
            </el-select>
            →
            <el-input style="width: 200px;" :placeholder="v.mKey" v-model="v.sKey"></el-input>
            <el-icon @click="config.inVar.splice(i, 1)"><delete/></el-icon>
          </div>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="⤴️ 从子流程传递回主流程">
      <div>
        <el-button type="primary" link icon="plus" @click="addMainVar">新增数据传递</el-button>
        <div>
          <div v-for="(v, i) in config.outVar" :key="i + 'subVar'" class="row-var">
            - <el-input style="width: 200px;" :placeholder="v.sKey" v-model="v.mKey"></el-input>
            →
            <el-select v-model="v.sKey">
              <el-option-group v-for="group in varOptions" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-option-group>
            </el-select>
            <el-icon @click="config.outVar.splice(i, 1)"><delete/></el-icon>
          </div>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import {getGroupModels} from "@/api/modelGroup";
import OrgPicker from "@/components/common/OrgPicker.vue";

export default {
  name: "SubProcNodeConfig",
  components: {OrgPicker},
  props:{
    config:{
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  computed:{
    forms(){
      let items = []
      this.userForms.length = 0
      this.getItems(items, this.$store.state.design.formItems)
      return items
    },
    varOptions(){
      return [{
        label: '系统数据',
        value: null,
        options: [{
          label: '发起人ID',
          value: 'initiator',
        },{
          label: '发起人部门ID',
          value: 'owner.deptId',
        }]
      },{
        label: '表单数据',
        value: null,
        options: this.forms.map(v => {
          return {label: v.title, value: v.id}
        })
      }]
    }
  },
  data() {
    return {
      loading: false,
      options: [],
      userForms: []
    }
  },
  mounted() {
    this.getGroupModels()
  },
  methods: {
    getGroupModels() {
      this.loading = true
      getGroupModels({}, true).then(rsp => {
        this.loading = false
        const data = rsp.data.filter(v => v.id > 0)
        data.forEach(group => {
          this.options.push({
            value: group.id,
            label: group.name,
            children: group.items.map(it => {
              return {
                value: it.procCode,
                label: it.procName,
                version: it.version,
                procDefId: it.procDefId,
                disabled: it.version <= 1 && !it.procDefId
              }
            })
          })
        })
      }).catch(err => {
        this.loading = false
        this.$err(err, '获取分组异常')
      })
    },
    addSubVar(){
      this.config.inVar.push({mKey: null, sKey: null})
    },
    selected(user){
      this.config.staterUser.value = user[0]
    },
    addMainVar(){
      this.config.outVar.push({mKey: null, sKey: null})
    },
    viewProc(){
      if ((this.config.subProcCode || '').length > 0){
        window.open(`/#/admin/design?code=${this.config.subProcCode}&isSub=1`, '_blank')
      }
    },
    getItems(options, items){
      items.forEach(item => {
        if (item.name === 'SpanLayout'){
          this.getItems(options, item.props.items)
        }else {
          options.push(item)
          if (item.name === 'UserPicker' && item.props.required){
            //过滤出单选人员组件
            this.userForms.push({label: item.title, value: item.id})
          }
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
:deep(.w-el-form){
  .el-form-item__label{
    padding: 0;
  }

  .row-var{
    .icon{
      margin-left: 8px;
      cursor: pointer;
      &:hover{

      }
    }
  }
}


</style>
