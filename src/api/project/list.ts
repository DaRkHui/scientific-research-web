import { ContentTypeEnum } from '@/enums/httpEnum';
import { http } from '@/utils/http/axios/baseIndex';
export interface BasicResponseModel<T = any> {
  code: number;
  msg: string;
  data: T;
}
//获取计划table
export function getTableList(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply_plan',
    method: 'GET',
    params,
  });
}
//获取计划table和状态
export function getTableListStatus(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply_plan/status',
    method: 'GET',
    params,
  });
}
//获取申报table
export function getPlanTotal(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply_plan/total',
    method: 'GET',
    params,
  });
}

//获取评审table 数量
export function getReviewNum(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/review_plan',
    method: 'GET',
    params,
  });
}
//获取评审table
export function getReviewList(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/review_plan/by_name',
    method: 'GET',
    params,
  });
}
//新增申请计划
export function newApplyPlan(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply_plan',
    method: 'POST',
    params,
  });
}
//新增申报
export function newApply(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply',
    method: 'POST',
    params,
  });
}
//新增评审计划
export function newReviewPlan(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/review_plan',
    method: 'POST',
    params,
  });
}
//计划详情
export function getApplyInfo(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply_plan/info',
    method: 'GET',
    params,
  });
}
//申报详情
export function getInfo(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/plan/info',
    method: 'GET',
    params,
  });
}
//删除申请
export function deleteApply(params) {
  return http.request<BasicResponseModel>({
    headers: { 'Content-Type': ContentTypeEnum.JSON },
    url: '/v1/project/apply_plan',
    method: 'DELETE',
    params,
  });
}
