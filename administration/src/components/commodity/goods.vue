<template>
  <div id="goods">
    <!-- 面包屑导航区域 -->
    <Crumbs :crumbs="this.crumbs"></Crumbs>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 输入框和添加商品按钮区域 -->
      <el-row :gutter="20">
        <!-- 输入框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="paramsInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="GetList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="handlePages">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="ListData" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column label="创建时间" width="170px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit()"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeUser(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsInfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="paramsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import Crumbs from '../crumbs.vue'
export default {
  data() {
    return {
      // 面包屑导航数据
      crumbs: [
        {
          name: '商品管理',
          id: 0
        },
        {
          name: '商品列表',
          id: 1
        }
      ],

      // 商品列表请求参数
      paramsInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 10
      },

      // 总条数
      totals: null,

      // 商品列表数据
      ListData: []
    }
  },
  components: {
    Crumbs
  },
  created() {
    this.GetList()
  },
  methods: {
    // 获取商品列表数据
    async GetList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.paramsInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.ListData = res.data.goods
      this.totals = res.data.total
      this.$message.success('获取商品列表成功！')
    },

    // 监听 pagesize 每页显示条数发生变动时会触发 会接收一个参数，发生变动后的显示条数
    handleSizeChange(newPagesize) {
      this.paramsInfo.pagesize = newPagesize
      this.GetList()
    },

    // 监听 pagenum 当前页码发生变动时会触发 会接收一个参数 发生变动后的页码值
    handleCurrentChange(newPagesize) {
      this.paramsInfo.pagenum = newPagesize
      this.GetList()
    },

    // 展开修改商品列表对话框
    handleEdit() {},

    // 点击按钮，根据id删除对应的商品列表
    async removeUser(id) {
      const confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$message.info('用户取消了删除')
      }
      // 确认删除该商品列表
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除该商品列表失败！')
      }
      this.$message.success('删除该商品列表成功！')
      this.GetList()
    },

    // 点击跳转到添加商品页面
    handlePages() {
      this.$router.push({ path: '/addItem' })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
