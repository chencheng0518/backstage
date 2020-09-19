<template>
  <div id="orders">
    <!-- 面包屑导航区域 -->
    <Crumbs :crumbs="this.crumbs"></Crumbs>

    <!-- 卡片视图区域 -->

    <el-card>
      <!-- 搜索框和按钮区域 -->
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单数据区域 -->
      <el-table :data="orderList" border style="width: 100%">
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay !== '1'">未付款</el-tag>
            <el-tag type="danger" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" @click="handleAddress"></el-button>
            <el-button type="success" icon="el-icon-location" @click="handleLogistics"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="paramsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals"
      ></el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog title="修改地址" :visible.sync="dialogVisibleOrders" width="50%" @close="handleClose">
        <el-form
          :model="ruleFormOrders"
          :rules="rulesOrders"
          ref="OrdersRuleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <!-- 省市区县 -->
          <el-form-item label="省市区/县" prop="address">
            <el-cascader
              v-model="ruleFormOrders.address"
              :options="citydata"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>

          <!-- 详细地址 -->
          <el-form-item label="详细地址" prop="detailed">
            <el-input v-model="ruleFormOrders.detailed"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleOrders = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisibleOrders = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 物流信息对话框 -->

      <el-dialog title="物流信息" :visible.sync="dialogVisibleLogistics" width="50%">
        <!-- 时间线 -->
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logisticsList"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Crumbs from '../crumbs.vue'
import citydata from '../../assets/list/citydata.js'
export default {
  data() {
    return {
      // 面包屑导航区域
      crumbs: [
        {
          name: '订单管理',
          id: 0
        },
        {
          name: '订单列表',
          id: 1
        }
      ],

      // 订单数组
      orderList: [],

      // 订单数据总条数
      totals: 0,

      // 订单数据请求参数
      paramsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 修改地址表单数据的验证规则
      rulesOrders: {
        address: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        detailed: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 控制修改地址对话框的显示与隐藏
      dialogVisibleOrders: false,

      // 修改地址对话框的表单数据
      ruleFormOrders: {
        address: '',
        detailed: ''
      },
      // 级联选择器省市区/县数据
      citydata: citydata,

      // 控制物流信息对话框的显示与隐藏
      dialogVisibleLogistics: false,

      // 物流信息数据
      logisticsList: []
    }
  },
  components: {
    Crumbs
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.paramsInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据失败！')
      }
      this.orderList = res.data.goods
      this.totals = res.data.total
      this.$message.success('获取订单数据成功！')
    },

    // 监听 pagesize 每页显示条数发生变动时会触发 会接收一个参数，发生变动后的显示条数
    handleSizeChange(newPagesize) {
      this.paramsInfo.pagesize = newPagesize
      this.getOrderList()
    },

    // 监听 pagenum 当前页码发生变动时会触发 会接收一个参数 发生变动后的页码值
    handleCurrentChange(newPagesize) {
      this.paramsInfo.pagenum = newPagesize
      this.getOrderList()
    },

    // 点击按钮，打开修改地址对话框
    handleAddress() {
      this.dialogVisibleOrders = true
    },

    // 监听修改地址对话框的关闭事件
    handleClose() {
      this.$refs.OrdersRuleForm.resetFields()
    },

    // 点击按钮，打开物流信息对话框 并获取物流信息数据
    async handleLogistics() {
      this.dialogVisibleLogistics = true

      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败！')
      }
      this.logisticsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
