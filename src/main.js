import { createApp } from 'vue'
import router from "./router";
import store from './store'
import App from './App.vue'

import ElementPlus from "element-plus";
import 'element-plus/dist/index.css'
import * as ElIcons from '@element-plus/icons-vue'
import {Icon} from '@iconify/vue'


import 'vant/lib/index.css';

import "@/assets/global.css";

import Ellipsis from './components/common/Ellipsis.vue'
import WDialog from './components/common/WDialog.vue'
import Tip from './components/common/Tip.vue'
import Avatar from './components/common/Avatar.vue'
import VueAMap, {initAMapApiLoader} from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css'

/*高德地图组件初始化*/
initAMapApiLoader({
    key: 'ebb9f6fb9beaec43fddcb22ab7406386',
    plugin: [
      'AMap.Autocomplete',
    /*  'AMap.ElasticMarker',
      'AMap.PlaceSearch',
      "AMap.MapType",*/
      "AMap.Geocoder",
      'AMap.Geolocation'
    ],
  });

const app = createApp(App)
  .use(router)
  .use(store)
  .use(VueAMap)
  .use(ElementPlus)
  .component('iconify', Icon)
  .component('Ellipsis', Ellipsis)
  .component('WDialog', WDialog)
  .component('Tip', Tip)
  .component('w-avatar', Avatar)
  .component('Icon', Icon)

window.$vueApp = app
window.$vCtx = app.config.globalProperties
import('./utils/Injection')

app.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}

//图标全局注册
for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component)
}

app.mount('#app')

