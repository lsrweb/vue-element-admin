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
          {{ new Date(Number(scope.row.updated)).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="330">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" plain size="mini" @click="[(showEditor = true), (getRow = scope.row)]">编辑</el-button>
          <el-popconfirm cancel-button-text="取消" confirm-button-text="确认" icon="el-icon-info" icon-color="red" title="确认删除?" @confirm="deleteAccount(scope.row.id)">
            <el-button slot="reference" icon="el-icon-delete" plain size="mini" type="danger" style="margin-left: 5px">删除</el-button>
          </el-popconfirm>
          <el-button icon="el-icon-edit" plain size="mini" style="margin-left: 5px" @click="[(changePassword = true), (password.id = scope.row.id)]">密码修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页   -->
    <pagination v-show="total > 0" :limit.sync="limit" :page.sync="page" :pageSizes="[10, 20]" :total="total" @pagination="fetchData" />
    <div class="add">
      <Add title="添加管理员" v-if="showAdd" @changeAdd="changeAdd" />
    </div>
    <div class="editor">
      <Editor title="修改管理员信息" v-if="showEditor" @changeAdd="changeAdd" :data="getRow"></Editor>
    </div>
    <div class="changePassword">
      <el-dialog title="账号密码修改" :visible.sync="changePassword">
        <el-form :model="password">
          <el-form-item label="修改密码" :required="true" :label-width="formLabelWidth">
            <el-input v-model="password.pas" auto-complete="off" show-password></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changePassword = false">取 消</el-button>
          <el-button type="primary" @click="confirmChangePassword">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAllAdmin, deleteAdmin, changePassword } from "@/api/permission";
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
      changePassword: false,
      formLabelWidth: "120px",

      total: 0,
      page: 1,
      limit: 10,

      env: process.env.VUE_APP_IMAGE_URL,
      tableData: [],
      getRow: [],
      password: {
        pas: "",
        id: "",
      },
    };
  },
  methods: {
    async confirmChangePassword() {
      await changePassword(this.password).then((response) => {
        if (response.code == 200) {
          this.changePassword = false;
          Message.success(response.message);
        }
      });
    },
    // 删除账号
    async deleteAccount(val) {
      this.loadTable = true;
      await deleteAdmin(val).then((response) => {
        if (response.code == 200) {
          Message.success(response.message);
          this.fetchData({ type: "reload" });
        } else {
          Message.success(response.message);
        }
        setTimeout(() => {
          this.loadTable = false;
        }, 500);
      });
    },
    // 获取数据
    async fetchData(e) {
      if (e) {
        this.limit = e.limit;
        this.page = e.page;
      }
      this.loadTable = true;
      await getAllAdmin({ page: this.page, limit: this.limit })
        .then((res) => {
          if (e.type === "reload") {
            this.tableData = [];
            this.total = res.alltotal;
            setTimeout(() => {
              this.tableData = res.data;
              this.loadTable = false;
            }, 500);
            return false;
          }
          this.tableData = res.data;
          this.total = res.alltotal;
          setTimeout(() => {
            this.loadTable = false;
          }, 500);
        })
        .catch(() => {
          this.loadTable = false;
        });
    },
    // 框框显示
    changeAdd(val) {
      this.showAdd = this.showEditor = val;
      this.fetchData({ type: "reload" });
    },
  },
  mounted() {
    this.fetchData({ type: "normal" });
  },
};
</script>

<style scoped></style>
