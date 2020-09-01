<template>
  <div id="categories">
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
          name: '商品管理',
          id: 0
        },
        {
          name: '商品分类',
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
