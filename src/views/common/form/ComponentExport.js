import * as Vue from 'vue'
let TextInput = Vue.defineAsyncComponent(
  () => import('./components/TextInput.vue')
)
let NumberInput = Vue.defineAsyncComponent(
  () => import('./components/NumberInput.vue')
)
let AmountInput = Vue.defineAsyncComponent(
  () => import('./components/AmountInput.vue')
)
let TextareaInput = Vue.defineAsyncComponent(
  () => import('./components/TextareaInput.vue')
)
let SelectInput = Vue.defineAsyncComponent(
  () => import('./components/SelectInput.vue')
)
let MultipleSelect = Vue.defineAsyncComponent(
  () => import('./components/MultipleSelect.vue')
)
let DateTime = Vue.defineAsyncComponent(
  () => import('./components/DateTime.vue')
)
let DateTimeRange = Vue.defineAsyncComponent(
  () => import('./components/DateTimeRange.vue')
)
let TimePicker = Vue.defineAsyncComponent(
  () => import('./components/TimePicker.vue')
)
let TimeRangePicker = Vue.defineAsyncComponent(
  () => import('./components/TimeRangePicker.vue')
)
let Description = Vue.defineAsyncComponent(
  () => import('./components/Description.vue')
)
let ImageUpload = Vue.defineAsyncComponent(
  () => import('./components/ImageUpload.vue')
)
let FileUpload = Vue.defineAsyncComponent(
  () => import('./components/FileUpload.vue')
)
let MoneyInput = Vue.defineAsyncComponent(
  () => import('./components/MoneyInput.vue')
)
let DeptPicker = Vue.defineAsyncComponent(
  () => import('./components/DeptPicker.vue')
)
let UserPicker = Vue.defineAsyncComponent(
  () => import('./components/UserPicker.vue')
)
let SignPanel = Vue.defineAsyncComponent(
  () => import('./components/SignPanel.vue')
)
let Score = Vue.defineAsyncComponent(() => import('./components/Score.vue'))

let SpanLayout = Vue.defineAsyncComponent(
  () => import('./components/SpanLayout.vue')
)
let TableList = Vue.defineAsyncComponent(
  () => import('./components/TableList.vue')
)
let Location = Vue.defineAsyncComponent(
  () => import('./components/Location.vue')
)
let Provinces = Vue.defineAsyncComponent(
  () => import('./components/Provinces.vue')
)
let WebIframe = Vue.defineAsyncComponent(
  () => import('./components/WebIframe.vue')
)
let CalcFormula = Vue.defineAsyncComponent(
  () => import('./components/CalcFormula.vue')
)
let ProcessIndex = Vue.defineAsyncComponent(
  () => import('./components/ProcessIndex.vue')
)
let VueContainer = Vue.defineAsyncComponent(
  () => import('./components/VueContainer.vue')
)
let OuterForm = Vue.defineAsyncComponent(
  () => import('./components/OuterForm.vue')
)
let SelectPlus = Vue.defineAsyncComponent(
  () => import('./components/SelectPlus.vue')
)

export default {
  //基础组件
  TextInput,
  NumberInput,
  AmountInput,
  TextareaInput,
  SelectInput,
  MultipleSelect,
  DateTime,
  DateTimeRange,
  UserPicker,
  DeptPicker,
  TimePicker,
  TimeRangePicker,
  //高级组件
  Description,
  FileUpload,
  ImageUpload,
  MoneyInput,
  Location,
  SignPanel,
  CalcFormula,
  SpanLayout,
  TableList,
  Provinces,
  Score,
  WebIframe,
  VueContainer,
  ProcessIndex,
  OuterForm,
  SelectPlus
}
