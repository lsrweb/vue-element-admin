import { getInfo, login, getRouter } from "@/api/user";
import { getToken, removeToken, setToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    routerList: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROUTER: (state, routerList) => {
    state.routerList = routerList;
  },
};

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ account: username.trim(), password: password })
        .then((response) => {
          const { token } = response;
          commit("SET_TOKEN", token);
          setToken(token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((response) => {
          const { data } = response;
          const { name, avatar } = data;
          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 获取用户权限路由
  getRouter({ commit }) {
    return new Promise((resolve, reject) => {
      getRouter()
        .then((response) => {
          const { data } = response;
          commit("SET_ROUTER", data);
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      resetRouter();
      commit("RESET_STATE");
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
