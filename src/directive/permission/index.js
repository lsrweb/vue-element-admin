import Vue from "vue";
const has = Vue.directive("permission", {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding, vnode) {
    let btnPermissions = vnode.context.$route.meta.button_per;
    let characteristic = binding.value;

    if (!isPermission(btnPermissions, characteristic)) {
      el.parentNode.removeChild(el);
    }
  },
});
// 权限检查方法
function isPermission(metaValue, bindingValue) {
  if (metaValue.includes(bindingValue[0])) return true;
}

export { has };
