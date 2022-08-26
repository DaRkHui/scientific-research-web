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
//获取评审专家
export function selectExpert(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/review_plan/select_expert',
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
//申报材料详情
export function applyMaterial(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply/material_template',
    method: 'GET',
    params,
  });
}
//删除计划
export function deleteApply(params) {
  return http.request<BasicResponseModel>({
    headers: { 'Content-Type': ContentTypeEnum.JSON },
    url: '/v1/project/apply_plan',
    method: 'DELETE',
    params,
  });
}
//关闭计划
export function closePlan(params) {
  return http.request<BasicResponseModel>({
    headers: { 'Content-Type': ContentTypeEnum.JSON },
    url: '/v1/project/apply_plan/close',
    method: 'PUT',
    params,
  });
}
//项目审核列表
export function projectReview(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/project_review',
    method: 'GET',
    params,
  });
}
//项目审核列表-数量
export function projectReviewTotal(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/project_review/total',
    method: 'GET',
    params,
  });
}
//项目审核详情-详情
export function projectReviewDetail(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/project_review/review_info',
    method: 'GET',
    params,
  });
}
//项目审核详情-人员表格
export function projectReviewStaff(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/project_review/info_staff',
    method: 'GET',
    params,
  });
}
//项目审核详情-申报材料
export function projectReviewInfo(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/project_review/info',
    method: 'GET',
    params,
  });
}
//项目审核列表-审核
export function toProjectReview(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/project_review',
    method: 'PUT',
    params,
  });
}
//我的项目-项目申报列表全部
export function myApply(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply',
    method: 'GET',
    params,
  });
}
//我的项目-项目申报列表退回or通过or审核
export function myApplypr(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply/pass_or_return',
    method: 'GET',
    params,
  });
}

//我的项目-项目申报数量
export function myApplyTotal(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply/total',
    method: 'GET',
    params,
  });
}
