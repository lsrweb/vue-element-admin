<template>
  <!-- 角色管理 -->
  <div class="role">
    <div class="btn_group">
      <el-button :plain="true" icon="el-icon-plus" size="mini" type="primary" @click="showAdd = true">添加角色</el-button>
    </div>
    <div class="main_table">
      <el-table v-loading="tableLoad" :data="tableData" border stripe style="width: 85%; margin: 25px">
        <el-table-column align="center" label="ID" prop="id" width="60"></el-table-column>
        <el-table-column align="center" label="角色标识" prop="role" width="180"></el-table-column>
        <el-table-column align="center" label="角色名称" prop="role_name" width="180"></el-table-column>
        <el-table-column label="节点创建日期" prop="created_router" width="220">
          <template slot-scope="scope">
            {{ new Date(Number(scope.row.created)).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="节点更新日期" prop="updated_router" width="220">
          <template slot-scope="scope">
            {{ new Date(Number(scope.row.update)).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" plain size="mini" @click="[(showEditor = true), (getRow = scope.row)]">编辑</el-button>
            <el-popconfirm cancel-button-text="取消" confirm-button-text="确认" icon="el-icon-info" icon-color="red" title="确认删除?" @confirm="deleteRouter(scope.row.id)">
              <el-button slot="reference" icon="el-icon-delete" plain size="mini" type="danger" style="margin-left: 5px">删除</el-button>
            </el-popconfirm>
            <el-button icon="el-icon-edit" plain size="mini" style="margin-left: 5px" type="primary" @click="[(id = scope.row.id), getRoleRouter(scope.row.id)]">路由权限编辑</el-button>
            <el-button icon="el-icon-edit" plain size="mini" style="margin-left: 5px" type="primary" @click="[(id = scope.row.id), getRoleButton()]">查看 / 编辑 按钮权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="showAdd">
      <Add title="角色添加" @changeAdd="changeAdd" />
    </div>
    <div v-if="showEditor">
      <Editor :form="getRow" title="角色修改" @changeAdd="changeAdd" />
    </div>
    <!--  权限编辑  -->
    <div class="permission">
      <el-dialog :visible.sync="showPermission" title="修改路由权限">
        <el-tree ref="tree" v-loading="loadingTree" element-loading-text="正在构建结构" :check-strictly="true" :data="tree" :default-checked-keys="checkArray" :expand-on-click-node="false" :props="defaultProps" :show-checkbox="true" accordion node-key="id" @check="clickDeal" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="showPermission = false">取 消</el-button>
          <el-button type="primary" @click="confirmChangeRole">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="showButtonPer" title="修改路由权限">
        <el-form :model="form">
          <el-form-item label="路由权限" :label-width="'120px'">
            <el-select v-model="form.value" placeholder="请选择要查看按钮权限的路由" @change="changeButtonPer">
              <div>
                <el-option v-for="item in router" :key="item.id" :label="item.title" :value="item.id">
                  <span style="float: left">{{ item.title }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                </el-option>
              </div>
              <div>
                <pagination v-show="total > 0" :limit.sync="limit" :page.sync="page" :pageSizes="[10, 20]" :total="total" @pagination="fetchData" />
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="按钮权限" :label-width="'120px'">
            <el-select v-loading="loadButton" v-model="button" multiple filterable allow-create default-first-option placeholder="请选择对应路由以查看按钮权限">
              <!--              <el-option v-for="item in options" :key="item.value" :label="item" :value="item"> </el-option>-->
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showButtonPer = false">取 消</el-button>
          <el-button type="primary" @click="confirmChangeButton">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deleteRole, getRole, getRoleRouter, resetRouter, getButtonPermission, getRouter, changeButtonPermission } from "@/api/permission";
import Add from "./role_diag/Add";
import Editor from "./role_diag/Editor";
import Pagination from "@/components/Pagination";
import { Message } from "element-ui";
import { getTree } from "@/utils";

export default {
  name: "Role",
  components: {
    Add,
    Editor,
    Pagination,
  },
  data() {
    return {
      id: null,
      form: {
        value: null,
      },
      routerId: null,
      total: 0,
      page: 1,
      limit: 10,

      tableData: [],
      getRow: [],
      tree: [],
      checkArray: [],
      router: [],

      button: [],
      options: [],

      tableLoad: true,
      showAdd: false,
      showPermission: false,
      showButtonPer: false,
      showEditor: false,
      loadingTree: true,
      loadButton: true,

      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  methods: {
    updated() {
      // 给多选树设置默认值
      this.$refs.tree.setCheckedKeys(this.checkArray);
    },
    clickDeal(currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中

      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj);
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true);
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj.children.length !== 0) {
          this.uniteChildSame(currentObj, false);
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      this.$refs.tree.setChecked(treeList.id, isSelected);
      for (let i = 0; i < treeList.children.length; i++) {
        this.uniteChildSame(treeList.children[i], isSelected);
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      let currentNode = this.$refs.tree.getNode(currentObj);
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true);
        this.selectedParent(currentNode.parent);
      }
    },
    // 确认修改
    async confirmChangeRole() {
      const nodeList = Array.from(new Set([...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()])).sort((a, b) => {
        return a - b;
      });
      if (nodeList == "" || nodeList == []) {
        Message.info("请选择对应权限");
        return false;
      }

      await resetRouter(nodeList, this.id).then((response) => {
        if (response.code == 200) {
          this.showPermission = false;
          Message.success(response.message);
        }
      });
    },
    async confirmChangeButton() {
      const button = this.button.join(",");
      await changeButtonPermission(button, this.routerId).then((response) => {
        console.log(response);
        if (response.code == 200) {
          this.showButtonPer = false;
          Message.success(response.message);
        } else {
          Message.success(response.message);
        }
      });
    },
    // 获取按钮权限
    async changeButtonPer(val) {
      this.loadButton = true;
      this.routerId = val;
      this.showButtonPer = true;

      await getButtonPermission(this.id, val)
        .then((response) => {
          if (response.code == 200) {
            this.showButtonPer = true;
            if (response.data[0]) {
              this.button = response.data;
            } else {
              this.button = ["未设置按钮权限"];
            }
            setTimeout(() => {
              this.loadButton = false;
            }, 500);
          }
        })
        .catch(() => {
          this.button = [];
          setTimeout(() => {
            this.loadButton = false;
          }, 500);
        });
    },

    // 按钮权限获取
    async getRoleButton(e) {
      if (e) {
        this.limit = e.limit;
        this.page = e.page;
      }
      await getRouter({ page: this.page, limit: this.limit }).then((response) => {
        this.total = response.total;
        this.router = response.data;
        this.showButtonPer = true;
        this.loadButton = false;
      });
    },
    // 获取路由
    async getRoleRouter(val) {
      await getRoleRouter(val).then((response) => {
        if (response.code == 200) {
          this.tree = getTree(response.data);
          this.showPermission = true;
          response.data.forEach((val) => {
            if (val.check) {
              this.checkArray.push(val.id);
            }
          });
          setTimeout(() => {
            this.updated();
          }, 250);
          setTimeout(() => {
            this.loadingTree = false;
          }, 500);
          return;
        }
        Message.info(response.message);
      });
    },
    // 删除角色
    async deleteRouter(id) {
      await deleteRole(id).then((response) => {
        if (response.code == 200) {
          Message.success(response.message);
          this.fetchData();
        } else {
          Message.info(response.message);
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
