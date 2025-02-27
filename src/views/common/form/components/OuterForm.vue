<script>
import componentMinxins from '../ComponentMinxins'
import {defineAsyncComponent} from "vue";
//需要显示的表单事先注册到这个js导出
import OuterFormReg from "../OuterFormReg.js";

//要先预先导入路径
export default {
  name: "OuterForm",
  mixins: [componentMinxins],
  components: OuterFormReg,
  props: {
    formProps: Object | String,
    isCodeForm:{
      type: Boolean,
      default: false
    },
    path:{
      type: String,
      default: ''
    },
    height:{
      type: String,
      default: '100%'
    },
    modelValue:{
      type: Object,
      default: undefined
    }
  },
  computed:{
    _formProps(){
      try {
        return eval(`return ${this.formProps || {}}`) || {}
      } catch (e) {
        return {}
      }
    },
    codeForm() {
      const path = (this.path || '').trim()
      if (path === ''){
        return defineAsyncComponent(() => import('./subs/EmptyForm.vue'))
      }
      return this.path
    },
    origin(){
      return this.resolveOrigin(this.path)
    },
    formPath(){
      if (!this.isCodeForm){
        return `${this.path}${this.urlHasParam(this.path) ? '?':'&'}perm=${this.readonly ? 'R':'E'}`
      }
      return this.path
    }
  },
  mounted() {
    //监听表单消息
    if (!this.isCodeForm){
      window.addEventListener("message", this.onMessage, false);
    }
  },
  beforeUnmount() {
    if (!this.isCodeForm){
      window.removeEventListener("message", this.onMessage);
    }
  },
  data() {
    return {
      timer: null,
      validResult: false,
      validCall: null,
    }
  },
  methods:{
    onMessage(ev){
      if (ev.source !== ev.target){
        switch (ev.data.type){
          case 'WFLOW_FORM_VALID':
            if (this.timer){
              clearTimeout(this.timer)
            }
            this._value = ev.data.formData
            if (this.validCall){
              console.log('iframe表单校验结果', ev.data.valid || false)
              this.validCall(ev.data.valid || false)
              this.validCall = null
            }
            break
          case 'WFLOW_FORM_DATA_CHANGE':
            this._value = ev.data.formData
            break
          case 'WFLOW_GET_FORM_DATA':
            this.loadIframeFormData()
            break
        }
      }
    },
    loadIframeFormData(){
      const iframe = document.getElementById('urlForm_' + this.path)
      if (iframe){
        iframe.contentWindow.postMessage(JSON.parse(JSON.stringify({
          type: 'WFLOW_SET_FORM_DATA',
          formData: this.modelValue
        })), this.origin)
      }
    },
    urlHasParam(url){
      try {
        const params = new URL(url).searchParams;
        // 判断是否有参数
        return params && params.keys().next().done === false;
      } catch (e) {
        return true
      }
    },
    resolveOrigin(url){
      // 使用正则表达式匹配 URL 中的域名或 IP 地址和端口
      const regex = /^(https?:\/\/)?([^:\/\s]+)(:\d+)?/;
      const match = url.match(regex);
      if (match) {
        const protocol = match[1] || 'http://';
        const domainOrIp = match[2];
        const port = match[3] || '';
        // 如果端口存在且不是默认端口（80 或 443），则包括端口
        if (port && !/:\d+/.test(port)) {
          return `${protocol}${domainOrIp}${port}`;
        } else {
          return `${protocol}${domainOrIp}`;
        }
      }
      return null;
    },
    validate(call){
      if (this.isCodeForm){
        if (this.$refs.codeForm && this.$refs.codeForm.validate){
          this.$refs.codeForm.validate(call)
        } else if(call){
          call(false)
        }
      }else {
        //网络表单，通过消息传递交互
        this.validCall = call
        const iframe = document.getElementById('urlForm_' + this.path)
        iframe.contentWindow.postMessage(JSON.parse(JSON.stringify({type: 'WFLOW_FORM_VALIDATE'})), this.origin)
        //超时检测表单校验数据返回
        this.timer = setTimeout(() => {
          if (call){
            this.timer = null
            call(false)
          }
        }, 500)
      }
    },
  }
}
</script>

<template>
  <component v-if="isCodeForm" :mode="mode" ref="codeForm" :perm="this.readonly ? 'R':'E'"
             :key="path" :is="codeForm" v-bind="_formProps" v-model="_value"/>
  <iframe :id="'urlForm_' + this.path" v-else scrolling="auto" frameborder="0" :src="formPath" width="100%" :height="height"></iframe>
</template>

<style scoped lang="less">
iframe {
  box-shadow: none;
}
</style>
