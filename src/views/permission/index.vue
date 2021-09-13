<template>
  <div>
    <el-table :data="tableData" stripe style="width: 50%" border>
      <el-table-column prop="id" label="ID" width="180"> </el-table-column>
      <el-table-column prop="role" label="角色标识" width="180"> </el-table-column>
      <el-table-column prop="role_name" label="角色名称" width="180"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRole } from "@/api/permission";

export default {
  name: "Role",
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    async fetchData() {
      await getRole().then((response) => {
        this.tableData = response.data;
      });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
