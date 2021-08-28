<template>
  <el-dialog :title="title" :visible="isShow" :width="size" @close="isClose" top="20px">
    <el-form :model="form">
      <el-form-item label="节点名称" :label-width="formLabelWidth" :required="true">
        <el-input v-model="form.router_name" placeholder="请用英文单词表示!" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="节点图标" :required="true" :label-width="formLabelWidth">
        <el-select v-model="form.router_icon" placeholder="请选择节点图标">
          <el-option :label="data" :value="data" v-for="(data, index) in SvgIcons" :key="index">
            <span style="float: left">{{ data }}</span>
            <svg-icon :icon-class="data" style="float: right; color: #8492a6; font-size: 13px"></svg-icon>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="节点组件位置" :label-width="formLabelWidth" :required="true">
        <el-input v-model="form.router_component" placeholder="请对应至前端组件位置进行填写" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="节点访问" :label-width="formLabelWidth" :required="true">
        <el-input v-model="form.router_path" placeholder="节点访问路径,一般情况下请对应至节点组件位置" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="节点排序" :label-width="formLabelWidth" :required="true">
        <el-input v-model="form.router_sort" placeholder="节点排序,数字越大,排序考上" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="节点标题" :label-width="formLabelWidth" :required="true">
        <el-input v-model="form.router_title" placeholder="用于显示后台左侧菜单文字" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="节点标题" :label-width="formLabelWidth" :required="true">
        <el-select v-model="form.page_button" multiple filterable allow-create default-first-option placeholder="请选择按钮权限标签">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否重定向" :label-width="formLabelWidth" :required="true">
        <el-radio-group v-model="form.router_redirect" size="small">
          <el-radio label="true" border>是</el-radio>
          <el-radio label="false" border>否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="忽略路由显示" :label-width="formLabelWidth" :required="true">
        <el-radio-group v-model="form.router_alwaysShow" size="small">
          <el-radio label="true" border>是</el-radio>
          <el-radio label="false" border>否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="固定标签栏" :label-width="formLabelWidth" :required="true">
        <el-radio-group v-model="form.router_affix" size="small">
          <el-radio label="true" border>是</el-radio>
          <el-radio label="false" border>否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="confirmAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SvgIcons from "@/icons/svg-icons";

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
      SvgIcons,
      options: [
        {
          value: "add",
          label: "添加",
        },
        {
          value: "delete",
          label: "删除",
        },
        {
          value: "change",
          label: "修改",
        },
      ],

      form: {
        router_name: "",
        router_icon: "",
        router_component: "",
        router_path: "",
        router_sort: "",
        router_title: "",
        router_redirect: "false",
        router_alwaysShow: "false",
        router_affix: "false",
        page_button: "",
      },
    };
  },
  methods: {
    // 确认添加
    confirmAdd() {
      console.log(this.form);
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
};
</script>

<style scoped></style>
