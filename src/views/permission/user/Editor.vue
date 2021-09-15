<template>
  <el-dialog :title="title" :visible="isShow" :width="size" top="20px" @close="isClose">
    <el-form :model="form">
      <el-form-item :label-width="formLabelWidth" :required="true" label="登录账号">
        <el-input v-model="form.account" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="用户头像">
        <el-input v-model="form.avatar" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="用户角色">
        <el-select v-model="form.role" placeholder="请选择用户角色" style="width: 300px">
          <el-option v-for="item in role" :key="item.id" :label="item.role_name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label-width="formLabelWidth" label="用户邮箱">
        <el-input v-model="form.email" placeholder="请输入用户邮箱"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="用户描述">
        <el-input v-model="form.usercop" placeholder="请输入用户邮箱"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="confirmAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editorAdmin, getRole } from "@/api/permission";
import { Message } from "element-ui";

export default {
  name: "Editor",
  props: {
    title: {
      required: true,
      type: String,
      default: "??添加",
    },
    size: {
      type: String,
      default: "50%",
    },
    data: {
      type: [Object, Array],
    },
  },
  data() {
    return {
      isShow: true,
      formLabelWidth: "120px",

      role: [],
      form: this.data,
    };
  },
  methods: {
    // 确认添加
    confirmAdd() {
      ["updated", "created", "role_name"].forEach((val) => {
        delete this.form[val];
      });
      editorAdmin({ data: this.form }).then((response) => {
        if (response.code == 200) {
          Message.success(response.message);
          this.$emit("changeAdd", false);
        }
      });
    },

    // 关闭提示
    isClose() {
      this.$confirm("确认关闭该弹窗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // eslint-disable-next-line no-unused-vars
        .then((_) => {
          this.$emit("changeAdd", false);
          // eslint-disable-next-line no-undef
          this.isShow = false;
        })
        // eslint-disable-next-line no-unused-vars
        .catch((_) => {
          this.isShow = true;
        });
    },
  },
  mounted() {
    getRole().then((response) => {
      this.role = response.data;
    });
  },
};
</script>

<style scoped></style>
