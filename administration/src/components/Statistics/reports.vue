<template>
  <div id="reports">
    <!-- 面包屑导航区域 -->
    <Crumbs :crumbs="this.crumbs"></Crumbs>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import Crumbs from '../crumbs.vue'
import echarts from 'echarts'

import _ from 'lodash'
export default {
  data() {
    return {
      // 面包屑导航
      crumbs: [
        {
          name: '数据统计',
          id: 0
        },
        {
          name: '数据报表',
          id: 1
        }
      ],
      // 需要合并的对象
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  components: {
    Crumbs
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 获取数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取数据报表失败！')
    }
    // 指定图表的配置项和数据
    const list = _.merge(this.options, res.data) // 合并对象
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(list)
  }
}
</script>

<style lang="less" scoped>
</style>
