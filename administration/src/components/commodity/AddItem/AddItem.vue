<template>
  <div class="addItem">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }" id="item">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="消息提示的文案" type="info" show-icon :closable="false" center></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="Active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- form表单区域 -->

      <el-form
        :model="AddruleForm"
        :rules="Addrules"
        ref="AddruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs tab-position="left" @tab-click="handleTab" :before-leave="leaveTab">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="AddruleForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格(元)" prop="goods_price">
              <el-input v-model="AddruleForm.goods_price" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品重量(kg)" prop="goods_weight">
              <el-input v-model="AddruleForm.goods_weight" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="AddruleForm.goods_number" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="AddruleForm.goods_cat"
                :options="CascaderList"
                :props="propConfig"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item :label="item.attr_name" v-for="(item,i) in manyList" :key="i">
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox :label="item" v-for="(item,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyList" :key="i">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              class="upload-demo"
              :action="picURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headerUrl"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <!-- 富文本编辑器组件 -->

            <quill-editor style="height:200px" v-model="AddruleForm.goods_introduce"></quill-editor>

            <!-- 添加商品 -->

            <el-button type="primary" style="margin-top:80px" @click="addCommodity">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片对话框 -->
    <el-dialog title="预览图片" :visible.sync="dialogVisiblePreview" width="50%">
      <img :src="previewImg" style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 步骤条选中效果
      Active: 0,

      // 添加商品表单数据
      AddruleForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },

      // 添加商品验证规则
      Addrules: {
        // 商品名称
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        // 商品价格
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        // 商品重量
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        // 商品数量
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        // 商品分类
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },

      // 级联选择器数据
      CascaderList: [],
      // 级联选择器的配置项
      propConfig: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      // 商品参数数组
      manyList: [],

      // 商品属性数组
      onlyList: [],

      // 上传图片需要的请求头参数
      headerUrl: {
        Authorization: window.sessionStorage.getItem('token')
      },

      // 上传图片的地址
      picURL: 'http://server.sineava.top/api/private/v1/upload',

      // 预览图片数组
      previewImg: '',

      // 控制预览图片对话框的显示与隐藏
      dialogVisiblePreview: false
    }
  },
  computed: {
    sortId() {
      if (this.AddruleForm.goods_cat.length !== 3) {
        return null
      }
      return this.AddruleForm.goods_cat[2]
    }
  },
  created() {
    this.getCascader()
  },
  methods: {
    // 点击选中tab项会触发
    async handleTab(e) {
      this.Active = Number(e.index)
      // 获取商品参数数据
      if (this.Active === 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.sortId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyList = res.data
        // 获取商品属性数据
      } else if (this.Active === 2) {
        const { data: res } = await this.$http.get(
          `categories/${this.sortId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        this.onlyList = res.data
      }
    },
    // 获取级联选择器的数据
    async getCascader() {
      const { data: res } = await this.$http.get('categories')
      this.CascaderList = res.data
    },

    // 级联选择项变动会触发这个函数
    handleChange() {
      if (this.AddruleForm.goods_cat.length !== 3) {
        return (this.AddruleForm.goods_cat = [])
      }
    },

    // 阻止tab页签切换
    leaveTab(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.AddruleForm.goods_cat.length !== 3) {
        this.$message.error('请选中商品分类数据')
        return false
      }
    },

    // 处理图片的预览效果
    handlePreview(file) {
      this.previewImg = file.response.data.url
      this.dialogVisiblePreview = true
    },

    // 点击删除图片
    handleRemove(file) {
      // 1、获取将要删除的图片的临时路径
      const removeImg = file.response.data.tmp_path

      // 2、从pics数组中，找到这个图片对应的索引值
      const i = this.AddruleForm.pics.findIndex((i) => i.pic === removeImg)

      // 3、根据索引删除pics对应的图片信息 splice
      this.AddruleForm.pics.splice(i, 1)
    },

    // 图片上传成功后的函数
    handleSuccess(response) {
      // 1、拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2、将图片信息对象，push到pics数组中
      this.AddruleForm.pics.push(picInfo)
    },

    // 点击按钮，添加商品
    addCommodity() {
      this.$refs.AddruleForm.validate(async (value) => {
        if (!value) {
          return this.$message.error('请填写正确的表单数据')
        }

        // 添加商品的业务逻辑

        // 1、深拷贝 添加商品表单数据AddruleForm
        const froms = _.cloneDeep(this.AddruleForm)
        froms.goods_cat = froms.goods_cat.join(',')

        // 处理动态参数
        this.manyList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.AddruleForm.attrs.push(newInfo)
        })

        // 处理静态属性
        this.onlyList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.AddruleForm.attrs.push(newInfo)
        })
        froms.attrs = this.AddruleForm.attrs

        // 发起请求添加商品
        // 商品名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', froms)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
#item {
  .is-link {
    font-weight: 400 !important;
  }
}
.el-breadcrumb {
  font-size: 17px;
}
.el-alert {
  background-color: #f4f4f5 !important;
  height: 40px;
  margin: 10px 0 30px 0;
}
.el-tabs {
  margin-top: 30px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
