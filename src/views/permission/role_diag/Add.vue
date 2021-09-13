<template>
  <el-dialog :title="title" :visible="isShow" :width="size" top="20px" @close="isClose">
    <el-form :model="form">
      <el-form-item :label-width="formLabelWidth" :required="true" label="角色名称">
        <el-input v-model="form.name" autocomplete="off" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="角色标识">
        <el-input v-model="form.role" autocomplete="off" placeholder="角色标识名称"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="角色排序">
        <el-input-number v-model="form.sort" controls-position="right" :min="1" :max="1000"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="confirmAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRole } from "@/api/permission";
import { Message } from "element-ui";

export default {
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
      isShow: true,
      formLabelWidth: "120px",

      form: {
        name: "",
        role: "",
        sort: "",
      },
    };
  },
  methods: {
    // 确认添加
    confirmAdd() {
      addRole(this.form).then((response) => {
        if (response.code == 200) {
          Message.success("角色添加成功");
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
          console.log("取消");
        });
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
