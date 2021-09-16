import request from "@/utils/request";

export function uploadImage(data) {
  return request({
    url: "/backend/upload/image/global",
    method: "POST",
    data,
  });
}
