<template>
  <el-dialog :title="title" :visible="isShow" :width="size" top="20px" @close="isClose">
    <el-form :model="form">
      <el-form-item :label-width="formLabelWidth" :required="true" label="登录账号">
        <el-input v-model="form.account" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="账号登录密码">
        <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="用户头像">
        <el-button type="primary" plain size="medium" icon="el-icon-upload" @click="showAvatar = true">{{ step == 1 ? "上传头像" : "重新修改" }}</el-button>
        <Cropper :value="showAvatar" field="file" url="/backend/upload/image/global" @close="closeAvatar" @crop-upload-success="successUpload"></Cropper>
        <el-avatar v-if="showHeader" :src="env + form.avatar" style="display: block; width: 150px; height: 150px; margin-top: 20px"></el-avatar>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="用户角色">
        <el-select v-model="form.role" placeholder="请选择用户角色" style="width: 300px">
          <el-option v-for="item in role" :key="item.id" :label="item.role_name" :value="item.id"></el-option>
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
import { addAdmin, getRole } from "@/api/permission";
import { Message } from "element-ui";
import Cropper from "@/components/ImageCropper";
import { forInObjectIsEmpty } from "@/utils";

export default {
  components: {
    Cropper,
  },
  name: "Add",
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
  },
  data() {
    return {
      env: process.env.VUE_APP_IMAGE_URL,
      step: 1,

      isShow: true,
      showAvatar: false,
      showHeader: false,
      formLabelWidth: "120px",

      // 节点添加
      form: {
        account: "",
        username: "",
        avatar: "",
        role: "",
        email: "",
        usercop: "",
        password: "",
      },
      role: [],
    };
  },
  methods: {
    // 确认添加
    confirmAdd() {
      const book = { account: "请输入账号", username: "请输入用户名", avatar: "请上传头像", role: "请选择管理员角色", password: "请输入用户密码" };
      const isOk = forInObjectIsEmpty(this.form, book);
      if (isOk) {
        addAdmin({ data: this.form }).then((response) => {
          if (response.code == 200) {
            Message.success(response.message);
            this.$emit("changeAdd", false);
          }
        });
      }
    },

    closeAvatar() {
      this.showAvatar = false;
    },
    successUpload(val) {
      this.step = 2;
      this.form.avatar = val;
      this.showHeader = true;
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
