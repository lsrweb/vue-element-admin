<template>
  <div id="app" class="scroller">
    <router-view />
    <Aplayer />
    <live2d v-if="$store.state.settings.showLive" />
  </div>
</template>

<script>
import Aplayer from "@/components/Aplayer";
import Live2d from "@/components/Live2d/index";
export default {
  name: "App",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Live2d,
    Aplayer,
  },
};
</script>

<style></style>
