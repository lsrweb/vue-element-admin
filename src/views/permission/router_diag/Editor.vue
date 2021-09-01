<template>
  <el-dialog :title="title" :visible="isShow" :width="size" top="20px" @close="isClose">
    <div class="radio" style="padding-left: 120px; margin-bottom: 20px">
      <el-radio v-model="type" border label="father" @change="changeRouterType">添加父级节点</el-radio>
      <el-radio v-model="type" border label="children" @change="changeRouterType">添加子级节点</el-radio>
    </div>
    <el-form :model="form">
      <el-form-item v-if="type == 'children'" :label-width="formLabelWidth" :required="true" label="选择父级节点">
        <el-select v-model="form.router_father" v-loading="loadingFather" placeholder="请选择父级节点">
          <el-option v-for="(data, index) in fatherNode" :key="index" :label="data.title" :value="data.id">
            <span style="float: left">{{ data.title }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="节点名称">
        <el-input v-model="form.router_name" autocomplete="off" placeholder="请用英文单词表示!"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="节点图标">
        <el-select v-model="form.router_icon" placeholder="请选择节点图标">
          <el-option v-for="(data, index) in SvgIcons" :key="index" :label="data" :value="data">
            <span style="float: left">{{ data }}</span>
            <svg-icon :iconClass="data" style="float: right; color: #8492a6; font-size: 13px"></svg-icon>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="节点组件位置">
        <el-input v-model="form.router_component" :disabled="type == 'father'" autocomplete="off" placeholder="请对应至前端组件位置进行填写"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="节点访问">
        <el-input v-model="form.router_path" autocomplete="off" placeholder="节点访问路径,一般情况下请对应至节点组件位置"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="节点排序">
        <el-input v-model="form.router_sort" autocomplete="off" placeholder="节点排序,数字越大,排序考上"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="节点标题">
        <el-input v-model="form.router_title" autocomplete="off" placeholder="用于显示后台左侧菜单文字"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="节点按钮权限">
        <el-select v-model="form.page_button" allow-create default-first-option filterable multiple placeholder="请选择按钮权限标签">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="是否重定向">
        <el-radio-group v-model="form.router_redirect" size="small">
          <el-radio border label="true">是</el-radio>
          <el-radio border label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="忽略路由显示">
        <el-radio-group v-model="form.router_alwaysShow" size="small">
          <el-radio border label="true">是</el-radio>
          <el-radio border label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="固定标签栏">
        <el-radio-group v-model="form.router_affix" size="small">
          <el-radio border label="true">是</el-radio>
          <el-radio border label="false">否</el-radio>
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
import { addRouter, getFatherRouter } from "@/api/permission";
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
      // 父级节点加载进度
      loadingFather: true,
      SvgIcons,
      // 获取父级节点
      fatherNode: [],
      // 默认按钮权限
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
      // 默认添加父级节点
      type: "father",
      // 节点添加
      form: {
        router_father: "0",
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
    // 节点type 选择
    changeRouterType(e) {
      switch (e) {
        case "father":
          this.form.router_component = "Layout";
          this.form.router_father = "0";
          break;
        case "children":
          this.form.router_component = "";
          this.form.router_father = "";
          getFatherRouter().then((res) => {
            this.fatherNode = res.data;
            this.loadingFather = false;
            console.log(this.form);
          });
          break;
      }
    },

    // 确认添加
    confirmAdd() {
      const form = {
        router_father: this.form.router_father,
        router_name: this.form.router_name,
        router_icon: this.form.router_icon,
        router_component: this.form.router_component,
        router_path: this.form.router_path,
        router_sort: this.form.router_sort,
        router_title: this.form.router_title,
        router_redirect: this.form.router_redirect,
        router_alwaysShow: this.form.router_alwaysShow,
        router_affix: this.form.router_affix,
        page_button: this.form.page_button.join(","),
      };
      addRouter({ data: form }).then((response) => {
        if (response.code == 200) {
          Message.success("节点添加成功");
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
  mounted() {
    this.form.router_component = "Layout";
  },
};
</script>

<style scoped></style>
