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
