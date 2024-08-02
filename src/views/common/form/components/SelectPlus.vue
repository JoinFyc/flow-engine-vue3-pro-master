<script>
//高级选择器组件
import componentMinxins from '../ComponentMinxins'
import {Checkbox, CheckboxGroup, Radio, RadioGroup} from "vant";
export default {
  name: "SelectPlus",
  components: {CheckboxGroup, Checkbox, RadioGroup, Radio},
  mixins: [componentMinxins],
  props:{
    modelValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder:{
      type: String,
      default: '请选择选项'
    },
    fixed: {
      type: Boolean,
      default: true
    },
    expanding:{
      type: Boolean,
      default: false
    },
    options:{
      type: Array,
      default: () => {
        return []
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    http: {
      type: Object,
      default: () => {
        return {
          url: null,
          method: 'GET',
          headers: [],
          contentType: 'JSON',
          params: [],
          data: null,
          preHandler: null,
          aftHandler: {
            isJs: false,
            js: '',
            rule: {
              source: '',
              name: '',
              value: ''
            }
          },
        }
      }
    }
  },
  computed:{
    __value:{
      get(){
        return this.multiple ? this.modelValue : this.modelValue[0]
      },
      set(val){
        if (this.multiple){
          this._value = val
        }else {
          this._value = [val]
        }
      }
    }
  },
  data(){
    return {
      loading: false,
      dataOptions: [],
      preHandlerFuc: null,
      aftHandlerFuc: null,
      reloadOptions: null
    }
  },
  mounted() {
    this.loadOptionsData();
    this.reloadOptions = this.$debounce(this.loadOptionsData, 1000)
  },
  methods:{
    loadOptionsData(){
      if (this.fixed){
        this.dataOptions = this.options
      }else {
        this.doRequest(this.dataOptions)
      }
    },
    doRequest(options){
      if (this.http.url && this.http.method){
        const params = {
          url: this.http.url,
          method : this.http.method.toLowerCase(),
          headers:{
            'Content-Type': this.http.contentType === 'JSON' ? 'application/json' : 'application/x-www-form-urlencoded',
            ...this.coverParams(this.http.headers || [])
          },
          formData: Object.assign({}, this.formData),
          params: this.coverParams(this.http.params || []),
          data: this.http.contentType === 'JSON' ? JSON.parse(this.bindVar(this.http.data || '{}')) : ''
        }
        this.preHandler(params, this.http.preHandler)
        //这里由于前置处理后，可能修改params参数，所以需要重新处理
        if (this.http.contentType !== 'JSON'){
          params.data = this.coverParams(params.params, true)
          params.params = {} //去除参数，防止参数跑到url中
        }
        this.loading = true
        this.$axios.request(params).then(rsp => {
          this.loading = false
          const ops = this.aftHandler(rsp, this.http.aftHandler)
          options.length = 0
          options.push(...(ops || []))
        }).catch(err => {
          this.loading = false
          this.$message.warning('请求http数据源发生异常:' + JSON.stringify(err))
        })
      }
    },
    bindVar(str){
      return str.replace(/\$\{(\w+)\}/g, (match, key) => {
        return this.formData[key] || '';
      })
    },
    //数组转对象
    coverParams(args, isForm = false){
      let params = {};
      if(Array.isArray(args)){
        args.forEach(arg => {
          if (this.$isNotEmpty(arg.name)){
            params[arg.name] = arg.value.replace(/\$\{(\w+)\}/g, (match, key) => {
              return this.formData[key] || '';
            })
          }
        })
      }else {
        params = {...args}
      }
      if (isForm) {
        return Object.keys(params).map(v => `${v}=${params[v]}`).join('&')
      }
      return params
    },
    //前置处理
    preHandler(params, script){
      if (!this.preHandlerFuc){
        this.preHandlerFuc = new Function('ctx', `${script}\n preHandler(ctx)`)
      }
      try {
        this.preHandlerFuc(params)
      } catch (e) {
        console.log(e)
      }
    },
    //后置处理
    aftHandler(rsp, aftHandler){
      if (typeof(aftHandler) === 'string'){
        return this.toFunc(rsp, aftHandler)
      }else {
        //新格式，带字段设置
        if (aftHandler.isJs){
          return this.toFunc(rsp, aftHandler.js)
        }else {
          //取值进行转，拿到数组
          const dataArr = this.getData(rsp, this.ifEmGet(aftHandler.rule.source, 'data'));
          const name = this.ifEmGet(aftHandler.rule.name, 'name')
          const value = this.ifEmGet(aftHandler.rule.value, 'value')
          return (dataArr || []).map(v => {
            return {
              name: v[name],
              value: v[value],
            }
          })
        }
      }
    },
    ifEmGet(v, dv){
      return this.$isNotEmpty(v) ? v : dv
    },
    getData(obj, path) {
      // 将路径字符串分割成数组
      const keys = path.split('.');
      // 初始化结果为传入的对象
      let result = obj;
      // 逐层查找属性值
      for (const key of keys) {
        if (result.hasOwnProperty(key)) {
          result = result[key];
        } else {
          return undefined;
        }
      }
      return result;
    },
    toFunc(rsp, script){
      if (!this.aftHandlerFuc){
        this.aftHandlerFuc = new Function('rsp', `${script}\n return aftHandler(rsp)`)
      }
      try {
        return this.aftHandlerFuc(rsp)
      } catch (e) {}
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(){
        this.reloadOptions()
      }
    }
  }
}
</script>

<template>
  <div v-loading="loading" class="select-plus">
    <div v-if="mode === 'DESIGN'">
      <el-select class="max-fill" v-if="!expanding" v-model="__value" size="medium" disabled :placeholder="placeholder"/>
      <el-checkbox-group v-else-if="expanding && multiple" v-model="__value">
        <el-checkbox disabled class="w-row-text" v-for="(op, index) in dataOptions" :key="index" :label="op.value">{{op.name}}</el-checkbox>
      </el-checkbox-group>
      <el-radio-group v-else v-model="__value">
        <el-radio disabled class="w-row-text" v-for="(op, index) in dataOptions" :key="index" :label="op.value">{{op.name}}</el-radio>
      </el-radio-group>
    </div>
    <div v-else-if="expanding && dataOptions.length === 0" style="color:#E79467;">无选项😢，请检查设置</div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-select class="max-fill" v-if="!expanding" v-model="__value" :multiple="multiple" size="medium" clearable :placeholder="placeholder">
        <el-option v-for="(op, index) in dataOptions" :key="index" :value="op.value" :label="op.name">{{op.name}}</el-option>
      </el-select>
      <el-checkbox-group v-else-if="expanding && multiple" v-model="__value">
        <el-checkbox class="w-row-text" v-for="(op, index) in dataOptions" :key="index" :label="op.value">{{op.name}}</el-checkbox>
      </el-checkbox-group>
      <el-radio-group v-else v-model="__value">
        <el-radio class="w-row-text" v-for="(op, index) in dataOptions" :key="index" :label="op.value">{{op.name}}</el-radio>
      </el-radio-group>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <checkbox-group v-if="multiple" v-model="__value" direction="horizontal">
        <checkbox class="w-row-text" :name="op.value" shape="square" v-for="(op, index) in dataOptions" :key="index">{{op.name}}</checkbox>
      </checkbox-group>
      <radio-group v-else v-model="__value" direction="horizontal">
        <radio class="w-row-text" v-for="(op, index) in dataOptions" :key="index" :name="op.value">{{op.name}}</radio>
      </radio-group>
    </div>
    <div v-else>
      {{String((_value || []).map(val => (dataOptions.find(v => val === v.value) || {}).name))}}
    </div>
  </div>
</template>

<style scoped lang="less">
:deep(.select-plus){
  .el-checkbox-group{
    line-height: normal;
  }

  .w-row-text{
    margin: 5px;
  }
}
</style>
