import request from './request.js'
import {syncRequest} from './request.js'

/**
 *
 * 查询当前用户的指定级别领导
 * @param level 指定级别
 * @param deptId 部门ID
 * @param skipEmpty 是否跳过空部门
 * @returns {Promise<unknown>}
 */
export function getUserLeader(level, deptId, skipEmpty){
  return request({
    url: `wflow/process/step/leader/level`,
    method: 'get',
    params: {level: level, deptId: deptId, skipEmpty: skipEmpty}
  })
}

/**
 * 查询当前用户的指定级别下的所有领导
 * @param maxLevel 截至级别，为空则直到顶级
 * @param deptId 部门ID
 * @param skipEmpty 是否跳过空部门
 */
export function getUserLeaders(maxLevel, deptId, skipEmpty){
  return request({
    url: `wflow/process/step/leader/to/level`,
    method: 'get',
    params: {maxLevel: maxLevel, deptId: deptId, skipEmpty: skipEmpty}
  })
}

/**
 * 获取指定系统角色的所有人员
 * @param roles
 */
export function getUsersByRoles(roles){
  return request({
    url: `wflow/process/step/userByRoles`,
    method: 'post',
    data: roles
  })
}

/**
 * 查询所有部门主管
 * @param deptIds 部门ID
 */
export function getLeaderByDepts(deptIds){
  return request({
    url: `wflow/process/step/deptLeader`,
    method: 'post',
    data: deptIds
  })
}

/**
 * 获取指定系统部门内角色的所有人员
 * @param roles
 * @param depts
 */
export function getDeptUsersByRoles(roles, depts){
  return request({
    url: `wflow/process/step/deptUserByRoles`,
    method: 'post',
    data: {roles: roles, depts: depts}
  })
}

/**
 * 获取指定人员是否属于某部门
 * @param userId 该人员ID
 * @param depts 部门 List
 */
export function userInDepts(userId, depts){
  let result = false
  syncRequest({
    url: `/wflow/process/step/user/${userId}/belong/depts`,
    method: 'POST',
    data: depts,
    type: 'json',
    success: res => {
      result = res
    }
  })
  return result
}

/**
 * 获取指定的多个人员是否属于某些部门
 * @param userIds 该人员ID集合
 * @param depts 部门 List
 */
export function usersInDepts(userIds, depts){
  let result = false
  syncRequest({
    url: `/wflow/process/step/users/belong/depts`,
    method: 'POST',
    data: {
      sourceIds: userIds,
      targetIds: depts
    },
    type: 'json',
    success: res => {
      result = res
    }
  })
  return result
}

/**
 * 获取指定的多个部门是否属于某些部门子部门
 * @param depts 该部门ID集合
 * @param parents 父部门 List
 */
export function deptsInDepts(depts, parents){
  let result = false
  syncRequest({
    url: `/wflow/process/step/depts/belong/depts`,
    method: 'POST',
    data: {
      sourceIds: depts,
      targetIds: parents
    },
    type: 'json',
    success: res => {
      result = res
    }
  })
  return result
}

export function getNewVerProcess(code, isSub = false){
  return request({
    url: `wflow/process/model${isSub ? '/sub':''}/${code}`,
    method: 'get'
  })
}

export function saveProcess(params, isSub = false){
  return request({
    url: `wflow/process/model${isSub ? '/sub': ''}/save/`,
    method: 'post',
    data: params
  })
}

export function deployProcess(code, isSub = false){
  return request({
    url: `wflow/process/model${isSub ? '/sub': ''}/deploy/${code}`,
    method: 'post'
  })
}

export function getCustomPrintConfig(instanceId){
  return request({
    url: `wflow/process/model/customPrint/${instanceId}`,
    method: 'get'
  })
}

export function delProcessInst(instanceId){
  return request({
    url: `wflow/process/instance/${instanceId}`,
    method: 'delete'
  })
}

export function startProcess(code, params){
  return request({
    url: `wflow/process/start/${code}`,
    method: 'post',
    data: params
  })
}

//查询条件节点的所有满足的条件分支
export function getTrueConditions(params){
  return request({
    url: `/wflow/process/step/conditions/resolve`,
    method: 'post',
    data: params
  })
}

//校验EL表达式
export function validateEl(el){
  return request({
    url: `/wflow/process/step/el/validate`,
    method: 'get',
    params: {el: el}
  })
}

//查询表单字段的历史值
export function getFormFieldHis(instanceId, fieldId){
  return request({
    url: `/wflow/process/form/his/by/${instanceId}/${fieldId}`,
    method: 'get'
  })
}
export default {
  getUserLeader, getUserLeaders, getUsersByRoles, getDeptUsersByRoles,
  userInDepts, validateEl, deployProcess, saveProcess, getNewVerProcess, getCustomPrintConfig,
  getLeaderByDepts, delProcessInst, usersInDepts, deptsInDepts, getTrueConditions,
  getFormFieldHis
}
