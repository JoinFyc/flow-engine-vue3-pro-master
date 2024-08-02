<script>
import draggable from "vuedraggable";
import modelGroupApi from '@/api/modelGroup'
export default{
  name: "SubProcess",
  components: {draggable},
  data(){
    return {
      groupsSort: false,
      loading: false,
      groups: [],
      moveSelect: null,
      groupDragOptions:{
        animation: 300,
        disabled: false,
        sort: true,
        scroll: true,
        ghostClass: "choose",
      },
    }
  },
  mounted() {
    this.getGroupModels()
  },
  methods:{
    groupSort(group){
      this.groupsSort = false
      this.loading = true
      modelGroupApi.modelGroupsSort(this.groups.map(g => g.id), true).then(rsp => {
        this.loading = false
        this.$ok(rsp, '分组排序成功')
        this.getGroupModels()
      }).catch(err => {
        this.loading = false
        this.getGroupModels()
        this.$err(err, '分组排序失败')
      })
    },
    delGroup(group) {
      this.$confirm('确定要删除分组 ' + group.name + '吗 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        modelGroupApi.deleteModelGroup(group.id, true).then(rsp => {
          this.loading = false
          this.$ok(rsp, '删除分组成功')
          this.getGroupModels()
        }).catch(err => {
          this.loading = false
          this.$err(err, '删除分组失败')
        })
      })
    },
    editGroup(group) {
      this.$prompt('请输入新的组名', '修改分组名', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9\\-]{1,30}$/,
        inputErrorMessage: '分组名不能为空且长度小于30',
        inputPlaceholder: '请输入分组名',
        inputValue: group.name
      }).then(({value}) => {
        this.loading = true
        modelGroupApi.updateModelGroupName(group.id, {name: value}, true).then(rsp => {
          this.loading = false
          this.$ok(rsp, '修改成功')
          this.getGroupModels()
        }).catch(err => {
          this.loading = false
          this.$err(err, '修改失败')
        })
      })
    },
    addGroup(){
      this.$prompt('请输入要添加的组名', '新的分组名', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9\\-]{1,30}$/,
        inputErrorMessage: '分组名不能为空且长度小于30',
        inputPlaceholder: '请输入分组名'
      }).then(({value}) => {
        modelGroupApi.createModelGroup({name: value}, true).then(rsp => {
          this.$ok(rsp, '添加分组成功')
          this.getGroupModels()
        }).catch(err => this.$err(err, '添加分组失败'))
      })
    },
    getGroupModels() {
      this.loading = true
      modelGroupApi.getGroupModels({}, true).then(rsp => {
        this.loading = false
        this.groups = rsp.data.filter(v => v.id > 0 || v.items.length > 0)
      }).catch(err => {
        this.loading = false
        this.$err(err, '获取分组异常')
      })
    },
    addModel(group){
      this.$store.commit("setIsEdit", false);
      window.open(`/#/admin/design?groupId=${group.id}&isSub=1`, '_blank')
    },
    groupModelSort(group){
      this.groupsSort = false
      this.loading = true
      modelGroupApi.modelsSort(group.id, group.items.map(g => g.id), true).then(rsp => {
        this.loading = false
        this.$ok(rsp, '子流程排序成功')
        this.getGroupModels()
      }).catch(err => {
        this.loading = false
        this.getGroupModels()
        this.$err(err, '子流程排序失败')
      })
    },
    editModel(item){
      window.open(`/#/admin/design?code=${item.procCode}&groupId=${item.groupId}&isSub=1`, '_blank')
    },
    enOrDisModel(item){
      const call = () => {
        this.loading = true
        modelGroupApi.enOrDisModel(item.id, item.isStop, {groupId: this.moveSelect}, true).then(rsp => {
          this.loading = false
          this.getGroupModels()
          this.$ok(rsp, '操作成功')
        }).catch(err => {
          this.loading = false
          this.$err(err, '操作失败')
        })
      }
      if (!item.isStop){
        this.$confirm(item.procName + ' 被停用后将进入已停用分组，无法被设置进新的主流程，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => call())
      }else {
        if (this.moveSelect){
          call()
        }else {
          this.$message.warning("请选则启用流程到哪个分组")
        }
      }
    },
    moveModel(item){
      modelGroupApi.modelMoveToGroup(item.id, this.moveSelect, true).then(rsp => {
        this.loading = false
        this.getGroupModels()
        this.$ok(rsp, '操作成功')
      }).catch(err => {
        this.loading = false
        this.$err(err, '操作失败')
      })
    },
    delModel(item){

    }
  }
}
</script>

<template>
  <div>
    <div class="from-title">
      <span>📢 拖拽分组名右侧 <el-icon class="el-icon-rank"><rank/></el-icon> 可对分组排序</span>
      <div>
<!--        <el-button type="primary" icon="el-icon-plus" size="mini" @click="" round>新建子流程</el-button>-->
        <el-button icon="plus" @click="addGroup" size="small" round>新建子流程分组</el-button>
      </div>
    </div>
    <div class="form-groups">
      <el-row :gutter="10">
        <draggable class="groups" item-key="id" v-model="groups" group="group" handle=".el-icon-rank"
                   :component-data="{tag: 'div', type: 'transition-group'}"
                   filter=".undrag" @start="groupsSort = true" v-bind="groupDragOptions" @end="groupSort">
          <template #item="{element: group}">
            <el-col style="padding: 5px" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <div class="subproc-group" :style="{background: group.id === 0 ? '#e7e6e6':'#F7F7F9'}">
                <div>
                  <div>
                    <span>{{group.name}}</span>
                    <span style="font-size: small; color: #949495">（{{group.items.length}}）</span>
                    <el-icon class="el-icon-rank" v-show="group.id > 0"><rank/></el-icon>
                  </div>
                  <div v-if="group.id > 0" class="oprations">
                    <el-button type="text" size="small" icon="plus" v-show="group.items.length > 0" @click="addModel(group)">流程</el-button>
                    <el-button type="text" size="small" icon="edit" @click="editGroup(group)">修改</el-button>
                    <el-button type="text" size="small" icon="delete" @click="delGroup(group)">删除</el-button>
                  </div>
                </div>
                <div v-show="!groupsSort">
                  <div class="subproc-group-empty" v-if="group.items.length === 0">
                    <el-button type="text" icon="plus" @click="addModel(group.id)">新建子流程</el-button>
                  </div>
                  <draggable v-else item-key="id" :group="group.id" v-model="group.items" v-bind="groupDragOptions"
                             :component-data="{tag: 'div', type: 'transition-group'}" @end="groupModelSort(group)">
                    <template #item="{element: item}">
                      <el-row class="subproc-group-item">
                        <el-col :span="5" style="font-size: 14px">
                          <ellipsis :content="item.procName" hoverTip/>
                        </el-col>
                        <el-col :span="2">
                          <el-badge is-dot :hidden="item.procDefId !== null" type="warning">
                            <el-tag type="success" size="small">v{{item.version}}</el-tag>
                          </el-badge>
                        </el-col>
                        <el-col :span="5" class="w-desc-text" style="font-size: small">
                          <ellipsis hoverTip :content="item.remark"/>
                        </el-col>
                        <el-col :xs="0" :md="7" :sm="5" :span="6" class="w-desc-text" style="font-size: small">
                          <ellipsis hoverTip :content="item.updated"/>
                        </el-col>
                        <el-col :xs="12" :md="5" :sm="7"  :span="6">
                          <el-button type="primary" link size="small" icon="edit" v-if="group.id > 0" @click="editModel(item)"></el-button>
                          <el-button type="primary" link size="small" icon="close" v-if="group.id > 0" @click="enOrDisModel(item)"></el-button>
                          <el-button type="primary" link size="small" icon="delete" style="color:#ff4646;" v-else @click="delModel(item)"></el-button>
                          <el-popover placement="left" trigger="click" width="400" style="margin-left: 10px" @show="moveSelect === null">
                            <el-radio-group v-model="moveSelect" size="small">
                              <el-radio :label="g.id" border v-for="g in groups" :key="g.id" v-show="g.id > 1"
                                        :disabled="g.id === group.id" style="margin: 10px;">{{g.name}}</el-radio>
                            </el-radio-group>
                            <div style="text-align: right; margin: 0">
                              <el-button type="primary" link size="small" @click="group.id > 0 ? moveModel(item):enOrDisModel(item)">提交</el-button>
                            </div>
                            <template #reference>
                              <el-button type="primary" link size="small"
                                         :icon="group.id > 0 ? 'promotion' : 'finished'"></el-button>
                            </template>
                          </el-popover>
                        </el-col>
                      </el-row>
                    </template>
                  </draggable>
                </div>
              </div>
            </el-col>
          </template>
        </draggable>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="less">
.from-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  height: 30px;
  span {
    font-size: 13px;
    color: @theme-warning;
  }
  &>div:last-child{
    .el-button {
      border-radius: 15px;
    }
  }
}

.groups{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.subproc-group{
  background: #F7F7F9;
  padding: 12px;
  border: 1px;
  padding-top: 0;
  border-radius: 10px;
  &>div:first-child{
    padding: 8px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover{
      &>div:first-child{
        .el-icon{
          display: inline-block;
        }
      }
    }
    &>div:first-child{
      display: flex;
      align-items: center;
    }
    :deep(.oprations){
      .el-button--text {
        color: #9b9595;
        margin-left: 0;
      }
    }
  }
  &>div:last-child{
    padding: 2px;
    height: 200px;
    overflow: auto;
  }

  .subproc-group-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 2px 0;
    padding: 14px 10px;
    background: white;
    border-radius: 5px;
  }

  .subproc-group-empty{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 4px;
  }
  /*定义滚动条轨道
   内阴影+圆角*/
  ::-webkit-scrollbar-track {
    border-radius:10px;
    background-color:#F5F5F5;
  }
  /*定义滑块
   内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius:10px;
    background-color: #cbcbcb;
  }

}
</style>
