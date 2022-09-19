import { ContentTypeEnum } from '@/enums/httpEnum';
import { http } from '@/utils/http/axios/baseIndex';
export interface BasicResponseModel<T = any> {
  code: number;
  msg: string;
  data: T;
}

//项目审核列表-审核
export function toProjectReview(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/project_review',
    method: 'PUT',
    params,
  });
}
//我的项目-导出excel
export function exportDataExcl(params) {
  return http.request({
    headers: { 'Content-Type': ContentTypeEnum.BLOB },
    responseType: 'blob',
    url: '/v1/project/apply/export_data_ToExcel',
    method: 'POST',
    params,
  });
}
//我的项目-导出列表
export function exportDataList(params) {
  return http.request<BasicResponseModel>({
    url: '/v1/project/apply/export_data_list',
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
