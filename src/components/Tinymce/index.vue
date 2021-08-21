<template>
  <div :class="{ fullscreen: fullscreen }" class="tinymce-container" :style="{ width: containerWidth }">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
    </div>
  </div>
</template>

<script>
import editorImage from "./components/EditorImage";
import plugins from "./plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";
const tinymceCDN = "https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js";
// eslint-disable-next-line no-unused-vars
import { upload, uploadFiles } from "@/api/remote-search";

export default {
  name: "Tinymce",
  components: { editorImage },
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
      video: "",

      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
        es: "es_MX",
        ja: "ja",
      },
    };
  },
  computed: {
    language() {
      return this.languageTypeList[this.$store.getters.language];
    },
    containerWidth() {
      const width = this.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    },
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ""));
      }
    },
    language() {
      this.destroyTinymce();
      this.$nextTick(() => this.initTinymce());
    },
  },
  mounted() {
    this.init();
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    init() {
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message);
          return;
        }
        this.initTinymce();
      });
    },
    initTinymce() {
      const that = this;
      const _this = this;
      window.tinymce.init({
        language: this.language,
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: "panel-body ",
        object_resizing: false,
        // 设置上传图片接口
        images_upload_url: "http://localhost:8000/api/backend/upload/image/global",
        images_upload_base_path: process.env.VUE_APP_IMAGE_URL,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: "_blank",
        link_title: false,
        nonbreaking_force_tab: true,
        file_picker_types: "media",
        init_instance_callback: (editor) => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;
            this.$emit("input", editor.getContent());
          });
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", (e) => {
            _this.fullscreen = e.state;
          });
        },

        convert_urls: false,
        // eslint-disable-next-line no-unused-vars
        file_picker_callback: function (cb, value, meta) {
          let input = document.createElement("input");
          input.setAttribute("type", "file");
          input.onchange = function () {
            that.loadingChange = true;
            let file = this.files[0];
            const formData = new FormData();
            formData.append("files", file);

            uploadFiles(formData)
              .then((res) => {
                if (res.data) {
                  that.video = res.data;
                  cb(`${process.env.VUE_APP_IMAGE_URL}${that.video}`); // 将url显示在弹框输入框中
                }
              })
              .catch(() => {
                cb();
              });
          };
          input.click();
        },
        media_url_resolver: function (data, resolve) {
          if (_this.video) {
            try {
              let videoUri = encodeURI(data.url);
              let embedHtml = `<p>
            <span
                class="mce-object mce-object-video"
                data-mce-selected="1"
                data-mce-object="video"
                data-mce-p-width="100%"
                data-mce-p-height="auto"
                data-mce-p-controls="controls"
                data-mce-p-controlslist="nodownload"
                data-mce-p-allowfullscreen="true"
                data-mce-p-src="${videoUri}" >
                <video src="${data.url}" width="100%" height="100%" controls="controls" controlslist="nodownload">
                </video>
            </span>
        </p>
        <p style="text-align: left;"></p>`;
              resolve({ html: embedHtml });
            } catch (e) {
              resolve({ html: "" });
            }
          }
        },
        // file_picker_callback: (cb, value, meta) => {
        //   if (meta.filetype == "media") {
        //     let input = document.createElement("input");
        //     input.setAttribute("type", "file");
        //     let that = this;
        //     input.onchange = function () {
        //       that.loadingChange = true;
        //       let file = this.files[0];
        //       if (file.size / 1024 / 1024 > 10) {
        //         Message.error({
        //           message: "请上传小于10Mb的视频",
        //         });
        //         that.changeLoading = false;
        //         return false;
        //       }
        //       const formData = new FormData();
        //       formData.append("file", file);
        //       formData.append("type", "video");
        //
        //       upload(formData)
        //         .then((res) => {
        //           if (res.data && res.code == 200) {
        //             that.video = res.data;
        //             cb(`${process.env.IMAGE_URL}${that.video}`); // 将url显示在弹框输入框中
        //             that.loadingChange = false;
        //             that.$notify({
        //               title: "视频上传成功",
        //               message: "视频上传成功!",
        //               duration: 2000,
        //             });
        //           }
        //         })
        //         .catch(() => {
        //           cb();
        //         });
        //     };
        //     input.click();
        //   }
        //   if (meta.filetype == "image") {
        //     let input = document.createElement("input");
        //     input.setAttribute("type", "file");
        //     let that = this;
        //     input.onchange = function () {
        //       let file = this.files[0]; // 选取第一个文件
        //       const formData = new FormData();
        //       formData.append("file", file);
        //       upload(formData).then((res) => {
        //         that.video = res.data;
        //         cb(`${process.env.VUE_APP_IMAGE_URL}${res.data}`);
        //       });
        //     };
        //     input.click();
        //   }
        // },
        images_upload_handler(blobInfo, success, failure, progress) {
          progress(0);
          progress(100);
        },
      });
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }

      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      arr.forEach((v) => window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${v}" >`));
    },
  },
};
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
