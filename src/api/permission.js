import request from "@/utils/request";
import QueryString from "qs";

/**
 * get node list
 * @param data
 * @returns {AxiosPromise}
 */
export function getRouter(data) {
  return request({
    url: "backend/router",
    method: "GET",
    params: data,
  });
}

/**
 * add node
 * @param data
 * @returns {AxiosPromise}
 */
export function addRouter(data) {
  return request({
    url: "backend/router/add",
    method: "POST",
    data,
  });
}

/**
 * update node
 * @param data
 * @returns {AxiosPromise}
 */
export function changeRouter(data) {
  return request({
    url: "backend/router/update",
    method: "POST",
    data: QueryString.stringify(data),
  });
}

/**
 * send id to get router info
 * @param data
 * @returns {AxiosPromise}
 */
export function getRouterInfo(data) {
  return request({
    url: "backend/router/get",
    method: "GET",
    params: {
      id: data,
    },
  });
}

/***
 * delete node
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteRouter(data) {
  return request({
    url: "backend/router/delete",
    method: "DELETE",
    data: {
      id: data,
    },
  });
}

/**
 * get father node
 * @returns {AxiosPromise}
 */
export function getFatherRouter() {
  return request({
    url: "backend/router/father",
    method: "GET",
  });
}

// 角色管理

/**
 * get Role list
 * @returns {AxiosPromise}
 */
export function getRole() {
  return request({
    url: "/backend/role",
    method: "GET",
  });
}

/**
 * add Role
 * @param data
 * @returns {AxiosPromise}
 */
export function addRole(data) {
  return request({
    url: "/backend/role/add",
    method: "POST",
    data: data,
  });
}

/**
 * delete Role
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteRole(id) {
  return request({
    url: `/backend/role/delete?id=${id}`,
    method: "DELETE",
  });
}

/**
 * change Role
 * @param data
 * @returns {AxiosPromise}
 */
export function changeRole(data) {
  return request({
    url: "/backend/role/update",
    method: "POST",
    data,
  });
}

/**
 * get role router
 * @param id
 * @returns {AxiosPromise}
 */
export function getRoleRouter(id) {
  return request({
    url: `/backend/role/router?id=${id}`,
    method: "GET",
  });
}

/**
 * reset role router
 * @param data
 * @returns {AxiosPromise}
 */
export function resetRouter(data, id) {
  return request({
    url: "/backend/role/reset/router",
    method: "POST",
    data: {
      data: data,
      id: id,
    },
  });
}

/**
 * get simple router button permission
 * @param roleId
 * @param routerId
 * @returns {AxiosPromise}
 */
export function getButtonPermission(roleId, routerId) {
  return request({
    url: `/backend/role/button?role=${roleId}&router=${routerId}`,
    method: "GET",
  });
}

/**
 * change router permission
 * @param data
 * @returns {AxiosPromise}
 */
export function changeButtonPermission(data, router) {
  return request({
    url: "/backend/role/button/update",
    method: "POST",
    data: {
      button: data,
      id: router,
    },
  });
}

// --------------------- 管理员

/**
 * GET all admin
 * @returns {AxiosPromise}
 */
export function getAllAdmin(data) {
  return request({
    url: "/backend/getAllAdmin",
    method: "GET",
    params: data,
  });
}

/**
 * delete admin account
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteAdmin(id) {
  return request({
    url: `/backend/getAdmin/delete?id=${id}`,
    method: "DELETE",
  });
}

/**
 * add admin account
 * @param data
 * @returns {AxiosPromise}
 */
export function addAdmin(data) {
  return request({
    url: "/backend/getAdmin/add",
    method: "POST",
    data,
  });
}

/**
 * editor admin account
 * @param data
 * @returns {AxiosPromise}
 */
export function editorAdmin(data) {
  return request({
    url: "/backend/getAdmin/update",
    method: "POST",
    data,
  });
}

/**
 * change password
 * @param data
 * @returns {AxiosPromise}
 */
export function changePassword(data) {
  return request({
    url: "/backend/getAdmin/password",
    method: "POST",
    data,
  });
}
