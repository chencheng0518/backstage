<template>
  <div id="categories">
    <!-- 面包屑导航区域 -->
    <Crumbs :crumbs="this.crumbs"></Crumbs>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类区域 -->
      <el-button style="margin-bottom:20px;" type="primary" @click="handleSort">添加分类</el-button>

      <!-- 表格区域 -->
      <tree-table
        index-text="#"
        show-index
        :expand-type="false"
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        border
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i v-if="scope.row.cat_deleted==='false'" class="el-icon-error"></i>
          <i v-else class="el-icon-success"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="parameter.pagenum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="parameter.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="categoriesTotal"
      ></el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="dialogVisibleSort"
        width="50%"
        @close="handleCloseSort"
      >
        <!-- 内容区域 -->
        <el-form
          class="demo-ruleForm"
          :model="ruleFormSort"
          :rules="ruleSort"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="ruleFormSort.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：" id="from">
            <!-- options：用来指定数据源 -->
            <!-- props：用来指定配置对象 -->
            <el-cascader
              v-model="cascaderList"
              :options="ParentList"
              :props="propConfig"
              @change="handleChange"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleSort = false">取 消</el-button>
          <el-button type="primary" @click="handleAddSort">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改分类对话框 -->
      <el-dialog title="修改分类" :visible.sync="dialogVisibleEdit" width="50%">
        <el-form
          class="demo-ruleForm"
          :model="editFrom"
          :rules="ruleSort"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="editFrom.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="determineEdit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Crumbs from '../crumbs.vue'
export default {
  data() {
    return {
      // 面包屑数组
      crumbs: [
        {
          name: '商品管理',
          id: 0
        },
        {
          name: '商品分类',
          id: 1
        }
      ],
      // 表格数组
      categoriesList: [],
      // 请求商品分类数据参数
      parameter: {
        type: 3, // 获取所有级别的分类
        pagenum: 1, // 当前页码值
        pagesize: 5 // 每页显示多少条数据
      },
      // 总条数
      categoriesTotal: 0,
      // 表格配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isOk',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation',
          align: 'center',
          headerAlign: 'center'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      dialogVisibleSort: false,
      // 添加分类表单数据
      ruleFormSort: {
        // 分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类等级
        cat_level: 0
      },
      // 添加分类表单的验证规则
      ruleSort: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '长度在 2 到 6 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类数据数组
      ParentList: [],
      // 选中项绑定值
      cascaderList: [],
      // 级联选择器的配置项
      propConfig: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 控制修改分类对话框的显示与隐藏
      dialogVisibleEdit: false,
      // 修改分类的表单数据
      editFrom: {
        cat_name: ''
      },
      // 分类id
      editId: null
    }
  },
  components: {
    Crumbs
  },
  created() {
    this.getCategories()
  },
  methods: {
    // 获取分类列表数组
    async getCategories() {
      const { data: res } = await this.$http.get('categories', {
        params: this.parameter
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败！')
      }
      // 赋值 分类数组
      this.categoriesList = res.data.result
      this.categoriesTotal = res.data.total
      this.$message.success('获取分类列表成功！')
    },

    // 监听pagesize 每页显示多少条数据
    handleSizeChange(newSize) {
      this.parameter.pagesize = newSize
      this.getCategories()
    },

    // 监听pagenum 当前的页码值
    handleCurrentChange(newPagenum) {
      this.parameter.pagenum = newPagenum
      this.getCategories()
    },

    // 监听添加分类对话框的关闭事件
    handleCloseSort() {
      this.$refs.ruleForm.resetFields()
      this.cascaderList = []
      this.ruleFormSort.cat_pid = 0
      this.ruleFormSort.cat_level = 0
    },

    // 点击按钮，展开添加分类对话框
    handleSort() {
      this.getParamsList()
      this.dialogVisibleSort = true
    },

    // 获取父级分类的数据列表
    async getParamsList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.ParentList = res.data
      this.$message.success('获取父级分类成功！')
    },

    // 级联选择项变动会触发这个函数
    handleChange() {
      // 如果cascaderList数组中的length大于0，证明选中了父级分类
      // 反之，就说明没有选择任何父级分类
      if (this.cascaderList.length > 0) {
        // 设置父级分类的id
        this.ruleFormSort.cat_pid = this.cascaderList[
          this.cascaderList.length - 1
        ]
        // 设置分类等级
        this.ruleFormSort.cat_level = this.cascaderList.length
      } else {
        // 设置父级分类的id
        this.ruleFormSort.cat_pid = 0
        // 设置分类等级
        this.ruleFormSort.cat_level = 0
      }
    },

    // 点击按钮，添加分类
    handleAddSort() {
      this.$refs.ruleForm.validate(async (value) => {
        if (!value) {
          return this.$message.info('请填写正确的表单数据')
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.ruleFormSort
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        let text = ''
        if (res.data.cat_level === 0) {
          text = '一级'
        } else if (res.data.cat_level === 1) {
          text = '二级'
        } else if (res.data.cat_level === 2) {
          text = '三级'
        }
        this.$message.success(`添加${text}分类成功！`)
        this.getCategories()
        this.dialogVisibleSort = false
      })
    },

    // 展开编辑分类对话框，根据id查询分类信息
    async handleEdit(scope) {
      this.editId = scope.cat_id
      this.dialogVisibleEdit = true
      const { data: res } = await this.$http.get(`categories/${scope.cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类信息失败！')
      }
      this.$message.success('获取分类信息成功！')
      this.editFrom.cat_name = res.data.cat_name
    },
    async determineEdit() {
      const { data: res1 } = await this.$http.put(
        `categories/${this.editId}`,
        this.editFrom
      )
      if (res1.meta.status !== 200) {
        return this.$message.error('修改分类信息失败！')
      }
      this.$message.success('修改分类信息成功！')
      this.getCategories()
      this.dialogVisibleEdit = false
    },
    // 点击按钮，删除分类
    async handleDelete(scope) {
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
      const { data: res } = await this.$http.delete(
        `categories/${scope.cat_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success(res.meta.msg)
      this.getCategories()
    }
  }
}
</script>

<style lang="less" scoped>
.el-icon-error {
  color: red;
}
.el-icon-success {
  color: #20b2aa;
}
.el-cascader {
  width: 100%;
}
</style>
