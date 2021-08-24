<template>
  <div id="app">
    <router-view />
    <live2d />
    <aPlay />
  </div>
</template>

<script>
import Live2d from "@/components/Live2d/index";
import aPlay from "@/components/Aplayer/index";
export default {
  name: "App",
  components: {
    Live2d,
    aPlay,
  },
};
</script>
