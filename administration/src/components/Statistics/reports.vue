<template>
  <div id="reports">
       <!-- 面包屑导航区域 -->
   <Crumbs :crumbs="this.crumbs"></Crumbs>
  </div>
</template>

<script>
import Crumbs from '../crumbs.vue'
export default {
  data() {
    return {
      crumbs: [
        {
          name: '数据统计',
          id: 0
        },
        {
          name: '数据报表',
          id: 1
        }
      ]
    }
  },
  components: {
    Crumbs
  }
}
</script>

<style lang="less" scoped>
</style>
