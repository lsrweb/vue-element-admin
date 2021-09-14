<template>
  <!-- 角色管理 -->
  <div class="role">
    <div class="btn_group">
      <el-button :plain="true" icon="el-icon-plus" size="mini" type="primary" @click="showAdd = true">添加角色</el-button>
    </div>
    <div class="main_table">
      <el-table :data="tableData" stripe style="width: 65%; margin: 25px" border v-loading="tableLoad">
        <el-table-column prop="id" label="ID" width="60" align="center"> </el-table-column>
        <el-table-column prop="role" label="角色标识" width="180" align="center"> </el-table-column>
        <el-table-column prop="role_name" label="角色名称" width="180" align="center"> </el-table-column
        ><el-table-column label="节点创建日期" prop="created_router" width="220">
          <template slot-scope="scope">
            {{ new Date(Number(scope.row.created)).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="节点更新日期" prop="updated_router" width="220">
          <template slot-scope="scope">
            {{ new Date(Number(scope.row.update)).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" plain size="mini" @click="[(showEditor = true), (getRow = scope.row)]" style="margin-right: 5px">编辑</el-button>
            <el-popconfirm cancel-button-text="取消" confirm-button-text="确认" icon="el-icon-info" icon-color="red" title="确认删除?" @confirm="deleteRouter(scope.row.id)">
              <el-button slot="reference" icon="el-icon-delete" plain size="mini" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="showAdd">
      <Add @changeAdd="changeAdd" title="角色添加" />
    </div>
    <div v-if="showEditor">
      <Editor :form="getRow" @changeAdd="changeAdd" title="角色修改" />
    </div>
  </div>
</template>

<script>
import { deleteRole, getRole } from "@/api/permission";
import Add from "./role_diag/Add";
import Editor from "./role_diag/Editor";
import { Message } from "element-ui";

export default {
  name: "Role",
  components: {
    Add,
    Editor,
  },
  data() {
    return {
      tableData: [],
      getRow: [],

      tableLoad: true,
      showAdd: false,
      showEditor: false,
    };
  },
  methods: {
    async deleteRouter(id) {
      await deleteRole(id).then((response) => {
        if (response.code == 200) {
          Message.success(response.message);
          this.fetchData();
        }
      });
    },

    // 弹窗关闭加载数据
    changeAdd(val) {
      this.showAdd = this.showEditor = val;
      this.fetchData();
    },
    // 获取角色数据
    async fetchData() {
      this.tableLoad = true;
      await getRole().then((response) => {
        this.tableData = response.data;

        setTimeout(() => {
          this.tableLoad = false;
        }, 500);
      });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
