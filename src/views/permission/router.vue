<template>
  <div class="router">
    <!--    按钮组-->
    <div class="btn_group">
      <el-button type="primary" :plain="true" size="mini" icon="el-icon-plus" @click="showAdd = true">添加节点</el-button>
    </div>
    <!--  表格  -->
    <div class="main_table">
      <el-table :data="tableData" border style="width: 97%; margin: 0 auto">
        <el-table-column prop="pid" label="节点类型" width="160" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pid == 0">顶级路由</el-tag>
            <el-tag type="info" v-if="scope.row.pid != 0">{{ `pid为${scope.row.pid}的子路由` }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="节点名称" width="160" align="center"> </el-table-column>
        <el-table-column prop="sort" label="节点排序" width="120" align="center"> </el-table-column>
        <el-table-column prop="component" label="组件位置" width="180"> </el-table-column>
        <el-table-column prop="city" label="组件图标" width="120" align="center">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="节点name" width="120"> </el-table-column>
        <el-table-column prop="path" label="节点访问路径" width="220"> </el-table-column>
        <el-table-column prop="created_router" label="默认重定向" width="120" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.redirect == 'true'">默认定向</el-tag>
            <el-tag type="warning" v-if="scope.row.redirect == 'false'">取消定向</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_router" label="显示规则忽略" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.alwaysShow == 'true'">默认规则</el-tag>
            <el-tag type="warning" v-if="scope.row.alwaysShow == 'false'">忽略默认</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_router" label="标签栏固定" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.affix == 'true'">默认固定</el-tag>
            <el-tag type="warning" v-if="scope.row.affix == 'false'">不固定</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_router" label="节点创建日期" width="220">
          <template slot-scope="scope">
            {{ new Date(scope.row.created_router).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="updated_router" label="节点更新日期" width="220">
          <template slot-scope="scope">
            {{ new Date(scope.row.updated_router).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--   分页   -->
      <pagination v-show="total > 0" :pageSizes="[10, 20]" :total="total" :page.sync="page" :limit.sync="limit" @pagination="fetchData" />
    </div>
    <!--  添加节点  -->
    <div v-if="showAdd">
      <Add title="添加节点" size="50%" @changeAdd="changeAdd" />
    </div>
  </div>
</template>

<script>
import Add from "./router_diag/Add";
import { getRouter } from "@/api/permission";
import Pagination from "@/components/Pagination";

export default {
  name: "Router",
  components: {
    Add,

    Pagination,
  },
  data() {
    return {
      showAdd: false,
      total: 0,
      page: 1,
      limit: 10,

      tableData: [],
    };
  },
  methods: {
    // 表格数据获取
    fetchData(e) {
      if (e) {
        this.limit = e.limit;
        this.page = e.page;
      }
      getRouter({ page: this.page, limit: this.limit }).then((response) => {
        this.total = response.total;
        this.tableData = response.data;
      });
    },

    // eslint-disable-next-line no-unused-vars
    handleClick(row) {},
    changeAdd(isShow) {
      this.showAdd = isShow;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped lang="scss"></style>
