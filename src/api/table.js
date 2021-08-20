import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/vue-admin-template/table/list",
    method: "get",
    params,
  });
}

export function table() {
  return request({
    url: "backend/backendMember/index",
    method: "GET",
    baseURL: "http://stu.api.sdbaizhi.com/",
  });
}
