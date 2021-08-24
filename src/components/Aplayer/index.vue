<template>
  <div class="alayer">
    <div id="aplayer"></div>
  </div>
</template>

<script>
import "aplayer/dist/APlayer.min.css";
import APlayer from "aplayer";

export default {
  name: "index",
  mounted() {
    new APlayer({
      container: document.getElementById("aplayer"),
      fixed: true,
      mini: false,
      autoplay: false,
      theme: "#FADFA3",
      loop: "all",
      order: "random",
      preload: "auto",
      volume: 0.7,
      mutex: true,
      listFolded: false,
      listMaxHeight: 90,
      lrcType: 3,
      audio: [
        {
          name: "米迪拉",
          artist: "artist1",
          url: "http://dl.stream.qqmusic.qq.com/C400002v26BU2suYMU.m4a?guid=3305377824&vkey=1A51BB95245911286CE6EDA2698D6067DCDC28719C129FCC2AC2C56019AFABD4492C84B89E0839E540D80CAF4B635B772C2F955DBBF2F51E&uin=&fromtag=66",
          cover: "https://y.qq.com/music/photo_new/T002R300x300M000002LNGal3tmVGV_1.jpg?max_age=2592000",
          lrc: "lrc1.lrc",
          theme: "#ebd0c2",
        },
      ],
    });
  },
};
</script>

<style scoped></style>
