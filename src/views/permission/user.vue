<template>
  <div class="table"></div>
</template>

<script>
import { getAllAdmin } from "@/api/permission";
export default {
  name: "user",
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    getAllAdmin().then((res) => {
      this.tableData = res.data;
    });
  },
};
</script>

<style scoped></style>
