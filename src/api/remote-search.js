import request from "@/utils/request";

// export function searchUser(name) {
//   return request({
//     url: "/vue-element-admin/search/user",
//     method: "get",
//     params: { name },
//   });
// }
//
export function transactionList(query) {
  return request({
    url: "/vue-element-admin/transaction/list",
    method: "get",
    params: query,
  });
}

// 获取todo
export function getToDoList() {
  return request({
    url: "backend/index/todo",
    method: "GET",
  });
}
// 添加todo
export function addTodo(data) {
  return request({
    url: "backend/index/todo/add",
    method: "POST",
    data,
  });
}
// 删除todo
export function deleteTodo(id) {
  return request({
    url: `backend/index/todo/delete?id=${id}`,
    method: "DELETE",
  });
}
// 修改todo 文字
export function updated(id, value) {
  return request({
    url: "backend/index/todo/update",
    method: "POST",
    data: { id: id, text: value },
  });
}
// 修改todo是否完成
export function updatedActive(id, done) {
  return request({
    url: `backend/index/todo/active?id=${id}&done=${done}`,
    method: "GET",
  });
}
