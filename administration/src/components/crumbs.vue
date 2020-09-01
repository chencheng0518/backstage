<template>
  <div id="crumbs">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in crumbs" :key="item.id">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ['crumbs'],
  created() {}
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
    font-size: 17px;
}
</style>
