<template>
  <div>
    <!--    <Tinymce v-model="test" />-->
    <WangEditor v-model="test" />
    <div v-text="test"></div>
  </div>
</template>

<script>
// import Tinymce from "@/components/Tinymce";
import WangEditor from "@/components/WangeEditor";

export default {
  components: {
    // Tinymce,
    WangEditor,
  },
  data() {
    return {
      test: "",
    };
  },
  methods: {},
};
</script>
