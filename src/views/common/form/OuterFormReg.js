import {defineAsyncComponent} from "vue";

//需要注册的表单组件放到这里来
const TestForm = defineAsyncComponent(
  () => import('./TestForm.vue')
)

export default {
  TestForm
}
