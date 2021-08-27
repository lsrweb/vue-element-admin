<template>
  <div class="test">
    <el-button type="primary" size="mini" icon="el-icon-plus" v-permission="['add']" plain>添加</el-button>
    <el-button type="danger" size="mini" icon="el-icon-delete" v-permission="['delete']" plain>删除</el-button>
    <el-button type="primary" size="mini" icon="el-icon-view" v-permission="['look']" plain>查看</el-button>
    <el-button type="primary" size="mini" icon="el-icon-edit" v-permission="['change']" plain>修改</el-button>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      test: "",
    };
  },
  methods: {},
};
</script>
