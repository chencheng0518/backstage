<template>
  <div id="home">
    <el-button type="info" @click="linout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    linout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
