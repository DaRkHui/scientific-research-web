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
    method: 'get',
    params,
  });
}
