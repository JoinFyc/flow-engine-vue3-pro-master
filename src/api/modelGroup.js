import request from '@/api/request.js'


// 查询表单及分组
export function getGroupModels(param, isSub = false) {
  return request({
    url: `wflow/model/${isSub ? 'sub/':''}group/list`,
    method: 'get',
    params: param
  })
}

// 查询表单及分组
export function getGroupModelsByUser(param) {
  return request({
    url: 'wflow/model/list/byUser',
    method: 'get',
    params: param
  })
}

// 查询所有模型分组
export function getModelGroups(param, isSub = false) {
  return request({
    url: `wflow/model/${isSub ? 'sub/':''}group`,
    method: 'get',
    params: param
  })
}

// 表单分组排序
export function modelGroupsSort(param, isSub = false) {
  return request({
    url: `wflow/model/${isSub ? 'sub/':''}group/sort`,
    method: 'put',
    data: param
  })
}

// 表单排序
export function modelsSort(groupId, param, isSub = false) {
  return request({
    url: `wflow/model/${isSub ? 'sub/':''}sort/${groupId}`,
    method: 'put',
    data: param
  })
}

// 修改分组
export function updateModelGroupName(groupId, param, isSub = false) {
  return request({
    url: `wflow/model/${isSub ? 'sub/':''}group/${groupId}`,
    method: 'put',
    params: param
  })
}

// 新增模型分组
export function createModelGroup(param, isSub = false) {
  return request({
    url: `wflow/model/${isSub ? 'sub/':''}group`,
    method: 'post',
    params: param
  })
}

// 删除分组
export function deleteModelGroup(groupId, isSub = false) {
  return request({
    url: `wflow/model/${isSub ? 'sub/':''}group/${groupId}`,
    method: 'delete'
  })
}

// 删除模型
export function deleteModel(modelId) {
  return request({
    url: `wflow/model/${modelId}`,
    method: 'delete'
  })
}

// 获取模型
export function getModelById(modelId) {
  return request({
    url: `wflow/model/detail/${modelId}`,
    method: 'get'
  })
}

// 获取模型
export function getModelByDefId(defId) {
  return request({
    url: `wflow/model/detail/def/${defId}`,
    method: 'get'
  })
}

// 修改分组
export function modelMoveToGroup(modelId, groupId, isSub = false) {
  return request({
    url: `wflow/model/${isSub ? 'sub/':''}${modelId}/move/${groupId}`,
    method: 'put'
  })
}

// 启用或停用流程
export function enOrDisModel(modelId, type, params = {}, isSub = false) {
  return request({
    url: `wflow/model/${isSub ? 'sub/':''}${modelId}/active/${type}`,
    method: 'put',
    params: params
  })
}

// 获取抄送我的流程
export function getCcMeList(params) {
  return request({
    url: `wflow/process/ccMe`,
    method: 'get',
    params: params
  })
}

// 获取控制台统计数据
export function getProcessCountData() {
  return request({
    url: `wflow/process/instance/count`,
    method: 'get'
  })
}


export default {
  createModelGroup, updateModelGroupName, modelGroupsSort,
  modelsSort, getGroupModels, getModelGroups, modelMoveToGroup,
  deleteModelGroup, deleteModel, getModelById, getModelByDefId,
  enOrDisModel, getCcMeList, getProcessCountData, getGroupModelsByUser
}
