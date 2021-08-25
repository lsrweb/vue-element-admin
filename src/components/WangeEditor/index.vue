<template>
  <div class="wangEditor">
    <div :id="tinymceId">
      <p>请输入</p>
    </div>
  </div>
</template>

<script>
import wangEditor from "wangeditor";
import { uploadFiles, uploadImages } from "@/api/remote-search";
import { Message } from "element-ui";

export default {
  name: "WangEditor",
  props: {
    id: {
      type: String,
      default: function () {
        return "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "");
      },
    },
    value: {
      type: String,
      default: "",
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    menubar: {
      type: String,
      default: "file edit insert view format table",
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360,
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto",
    },
  },
  data() {
    return {
      tinymceId: this.id,

      editor: null,
      editorData: "",
    };
  },
  mounted() {
    const editor = new wangEditor(`#${this.tinymceId}`);
    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.height = 200;
    editor.config.uploadVideoServer = "http://127.0.0.1:8000/api/backend/upload/files/global";
    editor.config.uploadImgServer = "http://127.0.0.1:8000/api/backend/upload/images/global";
    editor.config.showMenuTooltips = true;
    editor.config.uploadImgMaxLength = 5;
    editor.config.uploadFileName = "file";
    editor.config.menuTooltipPosition = "down";
    editor.config.onchange = (newHtml) => {
      this.$emit("input", newHtml);
      this.editorData = newHtml;
    };

    editor.config.uploadImgHooks = {
      // 上传图片之前
      // eslint-disable-next-line no-unused-vars
      before: (xhr, data, formdata) => {},
      // 图片上传并返回了结果，图片插入已成功
      success: function (xhr) {
        console.log("success", xhr);
      },
      // 图片上传并返回了结果，但图片插入时出错了
      fail: function (xhr, editor, resData) {
        console.log("fail", resData);
      },
      // 上传图片出错，一般为 http 请求的错误
      error: function (xhr, editor, resData) {
        console.log("error", xhr, resData);
      },
      // 上传图片超时
      // eslint-disable-next-line no-unused-vars
      timeout: function (xhr) {
        console.log("timeout");
      },
      customInsert: function (insertImgFn, result) {
        // result 即服务端返回的接口
        console.log("customInsert", result);

        // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
        insertImgFn(`${process.env.VUE_APP_IMAGE_URL}${result.data}`);
      },
    };
    editor.config.customUploadImg = function (files, insert) {
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append(`file${i + 1}`, files[i]);
      }
      uploadImages(formData).then((response) => {
        if (response.code == 200) {
          Message.success("上传成功");
          response.data.forEach((value) => {
            insert(`${process.env.VUE_APP_IMAGE_URL}${value}`);
          });
        }
      });
    };
    editor.config.customUploadVideo = function (files, insert) {
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append(`files`, files[i]);
      }
      uploadFiles(formData).then((response) => {
        insert(`${process.env.VUE_APP_IMAGE_URL}${response.data}`);
      });
    };

    // 创建编辑器
    editor.create();
    this.editor = editor;
  },
  methods: {
    showData() {
      let data = this.editor.txt.html();
      alert(data);
    },
  },
};
</script>

<style scoped></style>
