import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  info: string;
  list: T;
}

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

/**
 * @description: 获取审批人员
 */
export function queryuser() {
  return http.request(
    {
      url: 'user/queryuser',
      method: 'POST',

    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 * @description: 获取用户信息
 */
export function getUserInfo(params) {
  return http.request(
    {
      url: '/user/setdoctype',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return http.request<BasicResponseModel>(
    {
      url: '/user/userlogin',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return http.request(
    {
      url: `/user/u${uid}/changepw`,
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}
export function queryapprovermenu(params) {
  return http.request({
    url: '/appme/queryapprovermenu',
    method: 'POST',
    params,
  });
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return http.request({
    url: '/login/logout',
    method: 'POST',
    params,
  });
}
