<template>
  <div id="home">
    <el-container class="home_container">
      <!-- 头部区域 -->
      <el-header>
        <div class="header_title_img">
          <div class="img">
            <img src="https://icon.qiantucdn.com/20200826/1cfd8ac738547359599027dc9d3a3f9b2" />
          </div>

          <div class="title">电商后台管理系统</div>
        </div>
        <el-button type="info" @click="linout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse? '64px':'200px' ">
          <div class="fold" @click="foldList">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#3e94ed"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="Active"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id.toString()" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="handleActive('/'+subItem.path)"
              >
                <!-- 二级菜单模板区域 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单列表数据
      menuList: [],
      // 左侧菜单列表字体图标对象
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 左侧菜单列表是否折叠
      isCollapse: false,
      // 激活选中的链接地址
      Active: ''
    }
  },
  created() {
    this.getMenuList()
    if (this.$route.path === '/welcome') {
      this.Active = ''
    } else {
      this.Active = this.$route.fullPath
    }
  },
  methods: {
    // 退出按钮点击事件
    linout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 获取左侧菜单列表数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error('获取菜单数据失败！')
      }
      this.$message.success(res.meta.msg)
      this.menuList = res.data
    },
    // 左侧菜单列表折叠事件
    foldList() {
      this.isCollapse = !this.isCollapse
    },
    // 激活选中二级菜单事件
    handleActive(active) {
      this.Active = active
    }
  },
  watch: {
    $route(to, from) {
      this.Active = to.fullPath
    }
  }
}
</script>

<style lang="less" scoped>
#home {
  height: 100%;
  .home_container {
    height: 100%;
    .el-header {
      background-color: #373d41;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 20px 30px 0;
      .header_title_img {
        display: flex;
        align-items: center;
        .img {
        }
        .title {
          font-size: 25px;
          color: #fff;
          margin-left: 20px;
        }
      }
    }
    .el-container {
      .el-aside {
        background-color: #333744;
        .iconfont {
          font-size: 20px;
          margin-right: 15px;
        }
        .el-menu {
          border-right: 0;
        }
        .fold {
          background-color: #4a5064;
          font-size: 15px;
          padding: 5px 0;
          color: #fff;
          text-align: center;
          line-height: 24px;
          cursor: pointer;
          letter-spacing: 0.2em;
        }
      }
      .el-main {
        background-color: #eaedf1;
      }
    }
  }
}
</style>
