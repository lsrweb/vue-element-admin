import defaultSettings from "@/settings";
import variables from "@/styles/element-variables.scss";
const { showSettings, tagsView, fixedHeader, sidebarLogo, openDyRouter, breadIsLink, isTreeLoad, showAplayer, AplayerId, showLive, slideBar } = defaultSettings;

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  cateData: null,
  openDyRouter: openDyRouter,
  breadIsLink: breadIsLink,
  isTreeLoad: isTreeLoad,
  showAplayer: showAplayer,
  AplayerId: AplayerId,
  showLive: showLive,
  slideBar: slideBar,
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    }
  },
};

const actions = {
  changeSetting({ commit }, data) {
    commit("CHANGE_SETTING", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
