<template>
  <div>
    <el-form-item label="提示文字">
      <el-input v-model="modelValue.placeholder" placeholder="请设置提示语"/>
    </el-form-item>
    <el-form-item label="选项模式">
      <el-radio-group v-model="modelValue.fixed">
        <el-radio :label="true">固定选项</el-radio>
        <el-radio :label="false">远程加载</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item class="options" v-if="modelValue.fixed">
      <template #label>
        <div class="option-item-label">
          <span>选项设置（鼠标拖拽排序）</span>
          <el-button icon="plus" link type="primary"
                     @click="modelValue.options.push({name: '', value: ''})">新增选项
          </el-button>
        </div>
      </template>
      <draggable item-key="id" v-model="modelValue.options" class="option-items"
                 :component-data="{tag: 'div', type: 'transition-group'}"
                 handler=".el-icon-rank" v-bind="dragOption">
        <template #item="{element, index}">
          <div class="option-item">
            <el-input v-model="element.value" style="width: 100px;" placeholder="选项value值" clearable/>
            ~
            <el-input v-model="element.name" placeholder="选项名称" style="width: 130px;"/>
            <el-icon class="del-btn" @click="modelValue.options.splice(index, 1)"><delete/></el-icon>
          </div>
        </template>
      </draggable>
    </el-form-item>

    <el-form-item label="配置数据源" v-else>
      <el-button icon="link" @click="visible = true">编辑http数据源</el-button>
    </el-form-item>
    <el-form-item label="选项展开">
      <el-switch v-model="modelValue.expanding"></el-switch>
    </el-form-item>
    <el-form-item label="多选模式">
      <el-switch v-model="modelValue.multiple"></el-switch>
    </el-form-item>
    <w-dialog title="配置http数据源请求" width="600px" v-model="visible" @opened="loadHttp" @ok="httpOk">
      <http-req ref="http" :runtime="false" :show-tip="false" v-model="tempHttp">
        <template #aft>
          <el-radio-group v-model="tempHttp.aftHandler.isJs" style="margin-bottom: 10px">
            <el-radio :label="false">规则解析</el-radio>
            <el-radio :label="true">JS解析(小程序端不支持)</el-radio>
          </el-radio-group>
          <div v-if="!tempHttp.aftHandler.isJs">
            <el-input style="width: 200px;" v-model="tempHttp.aftHandler.rule.source"><template slot="prepend">返回值.</template></el-input>
            取数据
            <el-input style="width: 150px;" v-model="tempHttp.aftHandler.rule.name"><template slot="prepend">名称</template></el-input>
            <el-input style="width: 150px;" v-model="tempHttp.aftHandler.rule.value"><template slot="prepend">值</template></el-input>
          </div>
          <code-editor v-else height="200px" ref="aftCode" v-model="tempHttp.aftHandler.js" :default-value="`function aftHandler(rsp){\n\t//获取到结果后做一些处理\n\t\n}`"/>
        </template>
      </http-req>
    </w-dialog>
  </div>
</template>

<script>
import HttpReq from "@/components/common/HttpReq.vue";
import draggable from "vuedraggable";
import ConfigMinxins from '../ConfigMinxins.js'
import CodeEditor from '@/components/common/CodeEditor.vue'

export default {
  name: "ScoreConfig",
  mixins: [ConfigMinxins],
  components: {draggable, HttpReq, CodeEditor},
  data() {
    return {
      visible: false,
      tempHttp: {
        url: '',
        method: 'GET',
        headers: [],
        contentType: 'JSON',
        params: [],
        data: '',
        preHandler: null,
        aftHandler: {
          isJs: false,
          js: '',
          rule: {
            source: '',
            name: '',
            value: ''
          }
        }
      },
      dragOption: {
        animation: 300,
        sort: true,
        group: 'option'
      },
    }
  },
  beforeMount() {
    this.loadHttp()
  },
  methods: {
    loadHttp(){
      this.tempHttp = this.$deepCopy(this.modelValue.http)
      //处理旧数据兼容
      const aftHandler = {
        isJs: true,
        js: '',
        rule: {
          source: 'data',
          name: 'name',
          value: 'value'
        }
      }
      if (typeof(this.tempHttp.aftHandler) === 'string'){
        aftHandler.js = this.tempHttp.aftHandler
        this.tempHttp['aftHandler'] = aftHandler
      } else if (!this.tempHttp.aftHandler){
        this.tempHttp['aftHandler'] = aftHandler
      }
      if (this.$refs.aftCode){
        this.$refs.aftCode.reloadCode()
      }
    },
    httpOk(){
      this.$refs.http.validate((valid, err) => {
        if (valid){
          this.modelValue.http = this.$deepCopy(this.tempHttp)
          this.visible = false
        }else {
          this.$message.warning(err)
        }
      })
    },
  }
}
</script>

<style scoped lang="less">
:deep(.options) {
  display: flex;
  flex-direction: column;

  .el-form-item__label{
    width: 100% !important;
  }

  .option-item{
    margin-bottom: 5px;
  }

  .del-btn{
    cursor: pointer;
    margin-left: 5px;
    padding: 5px;
    border-radius: 50%;
    &:hover{
      background: #DDDFE5;
    }
  }
}


.option-item-label {
  display: flex;
  text-align: left;
  button {
    float: right;
  }
}

</style>
