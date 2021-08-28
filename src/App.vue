<template>
  <div id="app" class="scroller">
    <router-view />
    <!--    <live2d />-->
  </div>
</template>

<script>
import Live2d from "@/components/Live2d/index";
export default {
  name: "App",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Live2d,
  },
};
</script>

<style></style>
