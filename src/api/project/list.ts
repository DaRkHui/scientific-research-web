import { ContentTypeEnum } from '@/enums/httpEnum';
import { http } from '@/utils/http/axios/baseIndex';
export interface BasicResponseModel<T = any> {
  code: number;
  msg: string;
  data: T;
}
//获取table
export function getTableList(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply_plan',
    method: 'GET',
    params,
  });
}
//新增申请计划
export function newApply(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply_plan',
    method: 'POST',
    params,
  });
}
//申请计划详情
export function getInfo(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply_plan/info',
    method: 'GET',
    params,
  });
}
//删除申请
export function reviewPlan(params) {
  return http.request<BasicResponseModel>({
    headers: { 'Content-Type': ContentTypeEnum.JSON },
    url: '/v1/project/apply_plan',
    method: 'DELETE',
    params,
  });
}
