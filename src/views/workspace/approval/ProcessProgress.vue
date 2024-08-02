<template>
  <div class="progress">
    <div v-for="item in progress" :key="item.taskId"
         :class="{'progress-item': true, 'progress-item-waiting': item.isFuture, 'progress-item-his': !item.isFuture}">
      <div>
        <div class="item-user">
          <div class="item-user-avatar">
            <template v-if="item.user">
              <w-avatar :show-name="false" :status="getStatus(item)" :name="item.user.name" :src="item.user.avatar"></w-avatar>
            </template>
            <template v-else>
              <iconify v-if="item.nodeType === 'APPROVAL'" style="font-size: 16px" icon="fluent:people-48-filled" class="multi-user-avatar"></iconify>
              <el-icon v-else class="multi-user-avatar"><Promotion /></el-icon>
            </template>
          </div>
          <div :class="{'item-user-desc': true, 'subprocess': item.nodeType === 'SUBPROC'}" @click="showItemNode(item)">
            <div>
              {{ item.name }}
              <span v-if="item.nodeType === 'SUBPROC'" style="margin-left: 10px">
                <el-icon><View /></el-icon> 查看
              </span>
            </div>
            <div>{{ getDesc(item) }}</div>
          </div>
        </div>
        <div class="time">
          {{ item.isFuture ? '等待中' : getShortTime(item.finishTime) }}
        </div>
      </div>
      <div v-if="item.users && item.users.length > 0" class="multi-user">
        <div v-for="subItem in item.users" :key="subItem.taskId" class="">
          <div class="item-user-avatar">
            <w-avatar showY :size="35" :status="getStatus(subItem)" :name="subItem.user.name" :src="subItem.user.avatar"></w-avatar>
          </div>
        </div>
      </div>
      <div v-show="(item.comment && item.comment.length > 0) || item.signature" class="user-comment">
        <div v-if="item.signature" style="display: flex; align-items: center">
          <span><el-icon><EditPen /></el-icon> 签字：</span>
          <img :src="item.signature" style="width: 140px; height: 60px">
        </div>
        <div v-for="cmt in item.comment" :key="cmt.id" style="position: relative">
          <div class="user-comment-user" v-if="item.users">
            <w-avatar :size="30" :name="cmt.user.name" :src="cmt.user.avatar"></w-avatar>
            <span>（添加了评论）</span>
          </div>
          <div class="user-comment-time" v-if="item.users">
            {{ getShortTime(cmt.createTime) }}
          </div>
          <div class="user-comment-content">
            <div class="text-comment">{{ cmt.text }}</div>
            <div class="image-comment" v-show="cmt.attachments.length > 0">
              <el-image class="image" :src="img" v-for="(img, i) in filterImages(cmt.attachments)" :key="img" :preview-src-list="filterImages(cmt.attachments)"></el-image>
            </div>
            <div class="file-comment">
              <ellipsis style="display: inline-block" class="file-item" type="primary" @click="download(file)" :content="file.name" v-for="file in filterFiles(cmt.attachments)" :key="file.id">
                <template #pre>
                  <el-icon><Document /></el-icon>
                </template>
              </ellipsis>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="progress-item end-process">
      <div class="item-user-avatar node-icon">
        <el-icon :class="['icon', 'multi-user-avatar', result]">
          <component :is="statusIcon"/>
        </el-icon>
      </div>
      <div class="item-user-desc" style="font-size: 16px; line-height: 34px">
        {{ status }}
      </div>
    </div>
    <el-drawer :size="isMobile ? '100%': '500px'" append-to-body direction="rtl" title="子流程详情" v-model="showSubProc">
      <instance-view :instance-id="subProcInst"></instance-view>
    </el-drawer>
  </div>
</template>

<script>
import {getTaskResult} from "@/utils/ProcessUtil.js";
import {defineAsyncComponent} from "vue";

export default {
  name: 'ProcessProgress',
  components: {InstanceView: defineAsyncComponent(_ => import("./ProcessInstancePreview.vue"))},
  props: {
    progress: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    result: {
      required: true,
      default: null
    },
    status:{
      required: true,
      default: '未知'
    }
  },
  computed: {
    isMobile() {
      return window.screen.width < 450
    },
    statusIcon() {
      switch (this.result){
        case 'RUNNING':
          return 'MoreFilled'
        case 'COMPLETE':
          return 'MoreFilled'
        case 'PASS':
          return 'SuccessFilled'
        case 'CANCEL':
          return 'CircleClose'
        case 'REFUSE':
          return 'CircleCloseFilled'
      }
    },
  },
  data() {
    return {
      showSubProc: false,
      subProcInst: null
    }
  },
  methods: {
    filterImages(attachments) {
      return (attachments || [])
        .filter((f) => f.isImage)
        .map((f) => {
          return this.$getRes(f.url)
        })
    },
    filterFiles(attachments) {
      return (attachments || [])
        .filter((f) => !f.isImage)
        .map((f) => {
          return {...f, url: this.$getRes(f.url)}
        })
    },
    download(file) {
      window.open(`${this.$getRes(file.url)}?name=${file.name}`, '_blank')
    },
    showItemNode(item){
      if (item.nodeType === 'SUBPROC'){
        this.subProcInst = item.taskId
        this.showSubProc = true
      }
    },
    getSize(size) {
      if (size > 1048576) {
        return (size / 1048576).toFixed(1) + 'MB'
      } else if (size > 1024) {
        return (size / 1024).toFixed(1) + 'KB'
      } else {
        return size + 'B'
      }
    },
    getShortTime(time) {
      if (time) {
        return time.substring(5, 16)
      }
      return '处理中'
    },
    getStatus(item) {
      if (item.isFuture) {
        return 'waiting'
      } else if (item.finishTime === null) {
        return 'pending'
      } else if (item.nodeType === 'CC') {
        return 'cc'
      } else if (item.result === 'agree' || item.result === 'complete'){
        return 'success'
      } else if (item.result === 'refuse') {
        return 'error'
      } else if (item.result === 'comment') {
        return 'comment'
      } else if (item.result === 'transfer') {
        return 'transfer'
      } else if (item.result === 'recall') {
        return 'recall'
      } else if (item.nodeType === 'cancel') {
        return 'cancel'
      } else {
        return undefined
      }
    },
    getDesc(item) {
      if (item.nodeType === 'APPROVAL') {
        if (item.user) {
          return `${item.user.name}（${getTaskResult(item).text}）`
        }
        let desc = (item.users || []).length + '人（'
        switch (item.approvalMode) {
          case 'AND':
            return desc + '会签）'
          case 'OR':
            return desc + '或签）'
          case 'NEXT':
            return desc + '顺序会签）'
        }
      } else if (item.nodeType === 'CC') {
        if (item.user) {
          return `抄送 ${item.user.name}`
        }
        return `抄送 ${item.users.length}人`
      }else if (item.nodeType === 'SUBPROC') {
        switch (item.result){
          case 'agree': return `${item.user.name} 发起的子流程（审批通过）`;
          case 'cancel': return `${item.user.name} 发起的子流程（被撤销）`;
          case 'refuse': return `${item.user.name} 发起的子流程（被驳回）`;
          default: return `${item.user.name} 发起的子流程（正在处理中）`;
        }
      } else if (item.result === 'comment') {
        return `${item.user.name}（添加了评论）`
      } else {
        return item.user?.name
      }
    },
  },
}
</script>

<style lang="less" scoped>
.progress {
  position: relative;
}

.subprocess{
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background: @theme-aside-bgc;
    color: @theme-primary;
  }
}

.progress-item-his::before {
  content: '';
  position: absolute;
  width: 4px;
  top: 0;
  left: 18px;
  color: #e4e4e4;
  background: #e4e4e4;
  height: 100%;
}
.end-process {
  margin-bottom: 30px;
  padding-bottom: 0 !important;
  height: 40px;
  .node-icon {
    span {
      font-size: 30px;
    }
    .icon {
      left: 0 !important;
      top: 0 !important;
    }
    .PASS {
      color: @theme-success !important;
      background: white !important;
    }
    .REFUSE {
      color: @theme-danger !important;
      background: white !important;
    }
    .CANCEL {
      color: #979797 !important;
      background: white !important;
    }
    .RUNNING, .COMPLETE {
      color: #b0b0b0 !important;
      background: #e4e4e4 !important;
    }
  }
}
.progress-item-waiting{
  position: relative;
  &:before {
    content: '';
    position: absolute;
    border: 2px dashed #e4e4e4;
    width: 0;
    left: 18px;
    height: 100%;
  }

}
.progress-item {
  z-index: 1;
  padding-bottom: 30px;
  position: relative;
  .item-user {
    & > div {
      display: inline-block;
    }
  }

  .user-comment {
    margin-left: 60px;
    font-size: 14px;
    position: relative;
    padding-top: 5px;
    .user-comment-user {
      display: flex;
      align-items: center;
    }
    :deep(.a-img span) {
      font-size: 12px;
    }
    .user-comment-time {
      position: absolute;
      right: 8px;
      top: 7px;
      color: #8c8c8c;
      font-size: small;
    }
    .user-comment-content {
      margin: 5px 0;
      background: #eeeeee;
      padding: 5px 20px;
      border-radius: 0 5px 5px 5px;

      :deep(.image-comment) {
        padding: 5px 0;
        .image {
          height: 60px;
          width: 60px;
          padding: 5px;
        }
        img {
          border-radius: 5px;
        }
      }
      .file-comment {
        .file-item {
          color: @theme-primary;
          cursor: pointer;
        }
      }
    }
  }

  .item-user-avatar {
    background: white;
    position: relative;
    padding: 4px 0;

    :deep(.icon) {
      border-radius: 50%;
      font-size: 15px;
      color: white;
      border: 2px solid white;
      position: absolute;
      padding: 0px;
      right: -10px;
      top: 20px;
    }

    .el-icon-promotion {
      padding: 1px;
      font-size: 12px;
    }
    .el-icon-more {
      color: white;
      font-size: 6px !important;
    }

    .multi-user-avatar {
      display: flex;
      height: 40px;
      width: 40px;
      background: @theme-primary;
      color: white;
      font-size: 28px;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
    }
  }

  .item-user-desc {
    position: absolute;
    left: 60px;
    top: 5px;
    font-size: 14px;

    div:nth-child(1) {
      color: #8c8c8c;
    }

    div:nth-child(2) {
      font-size: 15px;
      color: black;
    }
  }
}
.time {
  font-size: 15px;
  color: #8a8a8a;
  position: absolute;
  right: 0;
  top: 0;
}
.multi-user {
  display: grid;
  margin-left: 50px;
  grid-template-columns: repeat(7, 60px);
  /*.item-user-avatar {
    :deep(.icon) {
      right: 2px;
    }
  }*/
}
</style>
