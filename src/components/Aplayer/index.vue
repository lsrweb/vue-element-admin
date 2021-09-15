<template>
  <div class="alayer">
    <!--    <div id="aplayer"></div>-->
    <meting-js v-if="$store.state.settings.showAplayer" server="tencent" type="playlist" :id="$store.state.settings.AplayerId" fixed="true" theme="#25CCF7"></meting-js>
  </div>
</template>

<script>
export default {
  name: "index",
  mounted() {},
};
</script>

<style scoped>
.alayer {
  position: relative;
  z-index: 2300;
}
</style>
