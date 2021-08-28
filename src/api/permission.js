import request from "@/utils/request";

export function getRouter(data) {
  return request({
    url: "backend/router",
    method: "GET",
    params: data,
  });
}
