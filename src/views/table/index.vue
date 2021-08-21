<template>
  <div>
    <Tinymce v-model="test" />
    <div v-html="test"></div>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      test: "",
    };
  },
  methods: {},
};
</script>
