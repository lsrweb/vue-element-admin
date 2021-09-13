<template>
  <el-dialog :title="title" :visible="isShow" :width="size" top="20px" @close="isClose">
    <el-form v-loading="loadEditor" :model="form">
      <el-form-item :label-width="formLabelWidth" label="节点类型">
        <el-radio-group v-model="type" @change="radioChange">
          <el-radio-button label="father">父级节点</el-radio-button>
          <el-radio-button label="children">子级节点</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="type == 'children'" :label-width="formLabelWidth" :required="true" label="选择父级节点">
        <el-select v-model="form.pid" v-loading="loadingFather" placeholder="请选择父级节点">
          <el-option v-for="(data, index) in fatherNode" :key="index" :label="data.title" :value="data.id">
            <span style="float: left">{{ data.title }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="节点组件">
        <el-input v-model="form.component" :disabled="type == 'father'" placeholder="节点文件位置"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="节点排序">
        <el-input v-model="form.sort" placeholder="节点排序"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="节点标题">
        <el-input v-model="form.title" placeholder="节点标题"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="节点名称">
        <el-input v-model="form.name" placeholder="节点名称"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" label="节点访问">
        <el-input v-model="form.path" placeholder="节点访问路径"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="节点图标">
        <el-select v-model="form.icon" placeholder="请选择节点图标" style="width: 300px">
          <el-option v-for="(data, index) in SvgIcons" :key="index" :label="data" :value="data">
            <span style="float: left">{{ data }}</span>
            <svg-icon :iconClass="data" style="float: right; color: #8492a6; font-size: 13px"></svg-icon>
          </el-option>
        </el-select>
        <!--        <svg-icon :iconClass="form.icon" style="color: #8492a6; font-size: 24px; margin-left: 20px"></svg-icon>-->
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="是否重定向">
        <el-radio-group v-model="form.redirect" size="small">
          <el-radio border label="true">是</el-radio>
          <el-radio border label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="忽略路由显示">
        <el-radio-group v-model="form.alwaysShow" size="small">
          <el-radio border label="true">是</el-radio>
          <el-radio border label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" label="固定标签栏">
        <el-radio-group v-model="form.affix" size="small">
          <el-radio border label="true">是</el-radio>
          <el-radio border label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" :required="true" v-if="type == 'children'" label="节点按钮权限">
        <el-select v-model="button" allow-create default-first-option filterable multiple placeholder="请选择按钮权限标签" @change="changeButton" style="width: 300px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isClose">取 消</el-button>
      <el-button type="primary" @click="confirmAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SvgIcons from "@/icons/svg-icons";
import { changeRouter, getFatherRouter, getRouterInfo } from "@/api/permission";
import { Message } from "element-ui";

export default {
  name: "Editor",
  props: {
    id: {
      type: Number,
      default: 0,
    },
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
      loadingFather: true,
      loadEditor: true,
      isShow: true,
      form: {},
      formLabelWidth: "120px",
      type: "father",
      // 获取父级节点
      fatherNode: [],
      button: [],
      SvgIcons,
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
    };
  },
  methods: {
    changeButton(e) {
      console.log(e);
    },
    radioChange(e) {
      if (e == "children") {
        this.form.pid = "";
      } else {
        this.form.pid = 0;
      }
    },
    async confirmAdd() {
      let data = this.form;
      data.button = this.button.join(",");
      if (this.type == "children" && this.form.pid == "") {
        Message.info("请选择父级节点");
        return false;
      }
      ["created_router", "updated_router"].forEach((value) => {
        delete this.form[value];
      });

      await changeRouter(data).then((response) => {
        if (response.code == 200) {
          Message.success(response.message);
          this.$emit("fetchData");
          this.$emit("changeEditor", false);
        } else {
          Message.success(response.message);
        }
      });
    },
    isClose() {
      this.$confirm("确认关闭该弹窗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // eslint-disable-next-line no-unused-vars
        .then((_) => {
          this.$emit("changeEditor", false);
          // eslint-disable-next-line no-undef
          this.isShow = false;
        })
        // eslint-disable-next-line no-unused-vars
        .catch((_) => {
          this.isShow = true;
        });
    },

    // 数据获取
    async fetchData() {
      await getRouterInfo(this.id).then((response) => {
        if (response.data.routerInfo.pid == 0) {
          this.type = "father";
        } else {
          this.type = "children";
        }
        this.form = response.data.routerInfo;
        this.button = response.data.buttonPermission.split(",");
        this.loadingFather = false;
      });
      await getFatherRouter().then((res) => {
        this.fatherNode = res.data;
        setTimeout(() => {
          this.loadingFather = false;
          this.loadEditor = false;
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
