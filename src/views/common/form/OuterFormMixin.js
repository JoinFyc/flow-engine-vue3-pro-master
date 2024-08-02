//混入外部表单组件配置，所有接入wflow的外部表单都需要这个配置
export default{
  props:{
    mode:{
      type: String,
      default: 'DESIGN'
    },
    required:{
      type: Boolean,
      default: false
    },
    perm:{
      type: String,
      default: 'R'
    },
    modelValue:{
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data(){
    return {
      _formData: null, //定义表单数据
      _formRef: ''
    }
  },
  computed: {
    _value: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
        this.postMsg({type: 'WFLOW_FORM_DATA_CHANGE', formData: val})
      }
    },
    _disabled() {
      return this.$route.query.perm !== 'E' && this.perm !== 'E'
    }
  },
  mounted() {
    window.addEventListener('message',this.onMessage, false)
    this.postMsg({type: 'WFLOW_GET_FORM_DATA'})
  },
  beforeDestroy() {
    window.removeEventListener('message', this.onMessage)
  },
  methods:{
    /**
     * 初始化表单，外部表需要在mounted里面调用
     * @param formData 表单绑定数据对象
     * @param formRef 表单的ref name
     */
    formInit(formData, formRef){
      this._formData = formData
      this._formRef = formRef
      //属性字段赋值初始化
      for (const key in formData) {
        this._formData[key] = this._value[key] === undefined ? null : this._value[key]
      }
    },
    onMessage(ev){
      if (ev.source !== ev.target){
        switch (ev.data.type){
          case 'WFLOW_FORM_VALIDATE':
            this.validate(valid => {
              this.postMsg({
                type: 'WFLOW_FORM_VALID',
                valid: valid,
                formData: this._formData
              })
            })
            break
          case 'WFLOW_SET_FORM_DATA':
            //加载表单数据
            console.log('iframe收到表单值', ev.data.formData)
            if (ev.data.formData){
              for (const key of Object.keys(ev.data.formData)) {
                this._formData[key] = ev.data.formData[key]
              }
            }
            break
        }
      }
    },
    validate(call){
      this.$refs[this._formRef].validate((valid) => {
        if (call){
          call(valid)
        }
      });
    },
    postMsg(msg){
      window.parent.postMessage(JSON.parse(JSON.stringify(msg)))
    }
  },
  emits: ['update:modelValue'],
  watch:{
    _formData: {
      deep: true,
      handler(){
        this._value = this._formData
      }
    }
  }
}
