<template>
  <div>
    <el-alert
      title="触发器支持模板变量替换语法 ${变量名}， 变量名支持所有的【表单字段ID】及【扩展变量】
           扩展变量如下：[formName 审批表单名] [instanceId 审批实例ID]
           [owner_id 发起人ID] [owner_name 发起人名] [owner_deptId 发起人部门ID] [owner_deptName 发起人部门名]"
      type="success" :closable="false">
    </el-alert>
    <el-form label-position="top" label-width="90px">
      <el-form-item label="选择触发的动作" prop="text" class="user-type">
        <el-radio-group v-model="config.type">
          <el-radio label="WEBHOOK">发送网络请求</el-radio>
          <el-radio label="EMAIL">发送邮件</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="config.type === 'WEBHOOK'">
        <el-form-item label="请求地址" prop="text">
          <el-input placeholder="请输入URL地址" v-model="config.http.url">
            <template #prepend>
              <el-select v-model="config.http.method" style="width: 85px" placeholder="URL">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Header请求头" prop="text">
          <template #label>
            <div style="display: flex;">
              <span style="margin-right: 10px">Header请求头</span>
              <el-button type="primary" link @click="addItem(config.http.headers)">+ 添加</el-button>
            </div>
          </template>
          <div v-for="(header, index) in config.http.headers" :key="index" style="display:flex;">- &nbsp
            <el-input placeholder="参数名" style="width: 100px" v-model="header.name"/>
            <el-radio-group style="margin: 0 5px" v-model="header.isField">
              <el-radio-button :label="true">表单</el-radio-button>
              <el-radio-button :label="false">固定</el-radio-button>
            </el-radio-group>
            <el-select v-if="header.isField" style="width: 180px" v-model="header.value" placeholder="请选择表单字段">
              <el-option v-for="form in forms" :key="form.id" :label="form.title" :value="form.id"></el-option>
            </el-select>
            <el-input v-else placeholder="请设置字段值" v-model="header.value" style="width: 180px"/>
            <el-icon @click="delItem(config.http.headers, index)" style="margin-left: 5px; color: #c75450; cursor: pointer">
              <delete/>
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item label="Header请求参数" prop="text">
          <template #label>
            <div style="display: flex;">
              <span style="margin-right: 10px">请求参数 </span>
              <el-button style="margin-right: 20px" link @click="addItem(config.http.params)">+ 添加</el-button>
              <span>参数类型 - </span>
              <el-radio-group size="small" style="margin: 0 5px" v-model="config.http.contentType">
                <el-radio-button label="JSON">json</el-radio-button>
                <el-radio-button label="FORM">form</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div v-for="(param, index) in config.http.params" style="display: flex; align-items: center; margin-bottom: 5px" :key="index">- &nbsp
            <el-input placeholder="参数名" style="width: 100px" v-model="param.name"/>
            <el-radio-group style="margin: 0 5px" v-model="param.isField">
              <el-radio-button :label="true">表单</el-radio-button>
              <el-radio-button :label="false">固定</el-radio-button>
            </el-radio-group>
            <el-select v-if="param.isField" style="width: 180px" v-model="param.value" placeholder="请选择表单字段">
              <el-option v-for="form in forms" :key="form.id" :label="form.title" :value="form.id"></el-option>
            </el-select>
            <el-input v-else placeholder="请设置字段值" v-model="param.value" style="width: 180px"/>
            <el-icon @click="delItem(config.http.params, index)" style="margin-left: 5px; color: #c75450; cursor: pointer">
              <delete/>
            </el-icon>
          </div>
          <div></div>
        </el-form-item>
        <el-form-item label="请求结果处理" prop="text">
          <template #label>
            <div>
              <span>请求结果处理</span>
              <span style="margin-left: 20px">自定义脚本: </span>
              <el-switch disabled v-model="config.http.handlerByScript"></el-switch>
            </div>
          </template>
          <span class="item-desc" v-if="config.http.handlerByScript">
            👉 返回值为 ture 则流程通过，为 false 则流程将被驳回
            <div>
              支持函数
              <span style="color: dodgerblue">
                setFormByName(<span style="color: #939494">'表单字段名', '表单字段值'</span>)
              </span>
              可改表单数据
            </div>
          </span>
          <span class="item-desc" v-else>👉 无论请求结果如何，均通过</span>
          <div v-if="config.http.handlerByScript">
            <div>
              <span>请求成功😀：</span>
              <el-input type="textarea" v-model="config.http.success" :rows="3"></el-input>
            </div>
            <div>
              <span>请求失败😥：</span>
              <el-input type="textarea" v-model="config.http.fail" :rows="3"></el-input>
            </div>
          </div>
        </el-form-item>
      </div>
      <div v-else-if="config.type === 'EMAIL'">
        <el-form-item label="邮件主题" prop="text">
          <el-input placeholder="请输入邮件主题" v-model="config.email.subject"/>
        </el-form-item>
        <el-form-item label="收件方" prop="text">
          <el-select style="width: 100%" v-model="config.email.to" filterable multiple allow-create default-first-option placeholder="请输入收件人">
            <el-option v-for="item in config.email.to" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮件正文" prop="text">
          <el-input type="textarea" v-model="config.email.content" :rows="4" placeholder="邮件内容，支持变量提取表单数据 ${表单字段名} "></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
//import { codemirror } from 'vue-codemirror'
// 引入主题 可以从 codemirror/theme/ 下引入多个
//import 'codemirror/theme/idea.css'
// 引入语言模式 可以从 codemirror/mode/ 下引入多个
//import "codemirror/mode/javascript/javascript.js"

export default {
  name: 'TriggerNodeConfig',
  components: {
    /*codemirror*/
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    forms() {
      let items = []
      this.getItems(items, this.$store.state.design.formItems)
      return items
    },
  },
  data() {
    return {
      cmOptions: {
        tabSize: 4, // tab
        indentUnit: 4,
        styleActiveLine: true, // 高亮选中行
        lineNumbers: true, // 显示行号
        styleSelectedText: true,
        line: true,
        foldGutter: true, // 块槽
        gutters: ['CodeMirror-linenumbers', 'lock', 'warn'],
        highlightSelectionMatches: { showToken: /w/, annotateScrollbar: true }, // 可以启用该选项来突出显示当前选中的内容的所有实例
        mode: 'javascript',
        // hint.js options
        hintOptions: {
          // 当匹配只有一项的时候是否自动补全
          completeSingle: false,
        },
        // 快捷键 可提供三种模式 sublime、emacs、vim
        keyMap: 'sublime',
        matchBrackets: true,
        showCursorWhenSelecting: false,
        // scrollbarStyle:null,
        // readOnly:true,  //是否只读
        theme: 'material', // 主题 material
        extraKeys: { Ctrl: 'autocomplete' }, // 可以用于为编辑器指定额外的键绑定，以及keyMap定义的键绑定
        lastLineBefore: 0,
      },
    }
  },
  methods: {
    getItems(options, items){
      items.forEach(item => {
        if (item.name === 'SpanLayout'){
          this.getItems(options, item.props.items)
        }else {
          options.push(item)
        }
      })
    },
    addItem(items) {
      if (
        items.length > 0 &&
        (items[items.length - 1].name.trim() === '' ||
          items[items.length - 1].value.trim() === '')
      ) {
        this.$message.warning('请完善之前项后在添加')
        return
      }
      items.push({ name: '', value: '', isField: true })
    },
    delItem(items, index) {
      items.splice(index, 1)
    },
    onCmCodeChange() {},
    onCmReady() {},
  },
}
</script>

<style lang="less" scoped>
.item-desc {
  color: #939494;
}
</style>
