<template>
  <div class="table">
    <div class="btn_group">
      <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="showAdd = true">添加</el-button>
    </div>
    <el-table v-loading="loadTable" :data="tableData" border stripe style="width: 97%; margin: 0 auto">
      <el-table-column align="center" label="ID" prop="id" width="60"></el-table-column>
      <el-table-column align="center" label="用户名" prop="username" width="180"></el-table-column>
      <el-table-column align="center" label="用户头像" prop="avatar" width="180">
        <template slot-scope="scope">
          <el-avatar :size="60" :src="env + scope.row.avatar">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" alt="" />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱" prop="email" width="220"></el-table-column>
      <el-table-column align="center" label="登录账号" prop="account" width="180"></el-table-column>
      <el-table-column align="center" label="用户描述" prop="usercop" width="220" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="用户角色" prop="role_name" width="180">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.role_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" prop="updated_router" width="220" align="center">
        <template slot-scope="scope">
          {{ new Date(Number(scope.row.created)).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updated_router" width="220" align="center">
        <template slot-scope="scope">
          {{ new Date(Number(scope.row.update)).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="330">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" plain size="mini" @click="[(showEditor = true), (getRow = scope.row)]">编辑</el-button>
          <el-popconfirm cancel-button-text="取消" confirm-button-text="确认" icon="el-icon-info" icon-color="red" title="确认删除?" @confirm="deleteAccount(scope.row.id)">
            <el-button slot="reference" icon="el-icon-delete" plain size="mini" type="danger" style="margin-left: 5px">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页   -->
    <pagination v-show="total > 0" :limit.sync="limit" :page.sync="page" :pageSizes="[10, 20]" :total="total" @pagination="fetchData" />
    <div class="add">
      <Add title="添加管理员" v-if="showAdd" @changeAdd="changeAdd" />
    </div>
    <div class="editor">
      <Editor title="修改管理员信息" v-if="showEditor" @changeAdd="changeAdd"></Editor>
    </div>
  </div>
</template>

<script>
import { getAllAdmin, deleteAdmin } from "@/api/permission";
import { Message } from "element-ui";
import Add from "./user/Add";
import Editor from "./user/Editor";
import Pagination from "@/components/Pagination";

export default {
  name: "user",
  components: {
    Add,
    Editor,
    Pagination,
  },
  data() {
    return {
      loadTable: true,
      showAdd: false,
      showEditor: false,

      total: 0,
      page: 1,
      limit: 10,

      env: process.env.VUE_APP_IMAGE_URL,
      tableData: [],
    };
  },
  methods: {
    async deleteAccount(val) {
      this.loadTable = true;
      await deleteAdmin(val).then((response) => {
        if (response.code == 200) {
          this.fetchData();
          Message.success(response.message);
        } else {
          Message.success(response.message);
        }
        setTimeout(() => {
          this.loadTable = false;
        }, 500);
      });
    },

    async fetchData(e) {
      if (e) {
        this.limit = e.limit;
        this.page = e.page;
      }
      await getAllAdmin({ page: this.page, limit: this.limit }).then((res) => {
        this.tableData = res.data;
        this.total = res.alltotal;

        setTimeout(() => {
          this.loadTable = false;
        }, 500);
      });
    },

    changeAdd(val) {
      this.showAdd = this.showEditor = val;
      this.fetchData();
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
