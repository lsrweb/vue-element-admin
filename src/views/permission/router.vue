<template>
  <div class="router">
    <!--    按钮组-->
    <div class="btn_group">
      <el-button :plain="true" icon="el-icon-plus" size="mini" type="primary" @click="showAdd = true">添加节点</el-button>
    </div>
    <!--  表格  -->
    <div class="main_table">
      <el-table v-loading="loadingTable" :data="tableData" border style="width: 97%; margin: 0 auto">
        <el-table-column align="center" label="ID" prop="id" width="60"></el-table-column>
        <el-table-column align="center" label="节点类型" prop="pid" width="160">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pid == 0" type="success">顶级路由</el-tag>
            <el-tag v-if="scope.row.pid != 0" type="info">{{ `pid为${scope.row.pid}的子路由` }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="节点名称" prop="name" width="160"></el-table-column>
        <el-table-column align="center" label="节点排序" prop="sort" width="120"></el-table-column>
        <el-table-column label="组件位置" prop="component" width="180"></el-table-column>
        <el-table-column align="center" label="组件图标" prop="city" width="120">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column label="节点name" prop="name" width="120"></el-table-column>
        <el-table-column label="节点访问路径" prop="path" width="220"></el-table-column>
        <el-table-column align="center" label="默认重定向" prop="created_router" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.redirect == 'true'" type="success">默认定向</el-tag>
            <el-tag v-if="scope.row.redirect == 'false'" type="warning">取消定向</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="显示规则忽略" prop="created_router" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.alwaysShow == 'true'" type="success">默认规则</el-tag>
            <el-tag v-if="scope.row.alwaysShow == 'false'" type="warning">忽略默认</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标签栏固定" prop="created_router" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.affix == 'true'" type="success">默认固定</el-tag>
            <el-tag v-if="scope.row.affix == 'false'" type="warning">不固定</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="节点创建日期" prop="created_router" width="220">
          <template slot-scope="scope">
            {{ new Date(Number(scope.row.created_router)).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="节点更新日期" prop="updated_router" width="220">
          <template slot-scope="scope">
            {{ new Date(Number(scope.row.updated_router)).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" plain size="mini" @click="[(showEditor = true), handleClick(scope.row)]" style="margin-right: 5px">编辑</el-button>
            <el-popconfirm cancel-button-text="取消" confirm-button-text="确认" icon="el-icon-info" icon-color="red" title="确认删除?" @confirm="deleteRouter(scope.row.id)">
              <el-button slot="reference" icon="el-icon-delete" plain size="mini" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!--   分页   -->
      <pagination v-show="total > 0" :limit.sync="limit" :page.sync="page" :pageSizes="[10, 20]" :total="total" @pagination="fetchData" />
    </div>
    <!--  添加节点  -->
    <div v-if="showAdd">
      <Add size="50%" title="添加节点" @changeAdd="changeAdd" />
    </div>
    <div v-if="showEditor">
      <Editor size="50%" title="添加节点" />
    </div>
  </div>
</template>

<script>
import Add from "./router_diag/Add";
import Editor from "./router_diag/Editor";

import { getRouter, deleteRouter } from "@/api/permission";
import Pagination from "@/components/Pagination";
import { Message } from "element-ui";

export default {
  name: "Router",
  components: {
    Add,
    Editor,

    Pagination,
  },
  data() {
    return {
      showAdd: false,
      showEditor: false,

      loadingTable: true,
      total: 0,
      page: 1,
      limit: 10,

      tableData: [],
      editorData: null,
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
        setTimeout(() => {
          this.loadingTable = false;
        }, 400);
      });
    },

    deleteRouter(e) {
      deleteRouter(e).then((response) => {
        if (response.code == 200) {
          Message.info("");
        }
      });
    },
    handleClick(row) {
      console.log(row);
    },
    changeAdd(isShow) {
      this.showAdd = isShow;
      this.fetchData();
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped></style>
