import request from "@/utils/request";

/**
 * 用户登录,获取token
 * @param data
 * @returns {AxiosPromise}
 */
export function login(data) {
  return request({
    url: "backend/login",
    method: "POST",
    data,
  });
}

/**
 * 获取用户信息,传入 X-token header
 * @returns {AxiosPromise}
 */
export function getInfo() {
  return request({
    url: "backend/getUserinfo",
    method: "GET",
  });
}

/**
 * 获取用户权限路由
 * @returns {AxiosPromise}
 */
export function getRouter() {
  return request({
    url: "backend/getRouter",
    method: "GET",
  });
}
