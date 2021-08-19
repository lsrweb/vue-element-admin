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

export function getToDoList() {
  return request({
    url: "backend/index/todo",
    method: "GET",
  });
}

export function addTodo(data) {
  return request({
    url: "backend/index/todo/add",
    method: "POST",
    data,
  });
}

export function deleteTodo(id) {
  return request({
    url: `backend/index/todo/delete?id=${id}`,
    method: "DELETE",
  });
}
