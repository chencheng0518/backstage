<template>
  <div id="params">
    <!-- 面包屑导航区域 -->
    <Crumbs :crumbs="this.crumbs"></Crumbs>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>

      <!-- 选择商品，级联选择框区域 -->
      <p>
        请选择商品分类：
        <el-cascader
          v-model="cascaderList"
          :options="ParentList"
          :props="propConfig"
          @change="handleChange"
          clearable
        ></el-cascader>
      </p>

      <!-- 动态参数，静态属性区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :disabled="isDisable" label="动态参数" name="many">
          <!-- 添加参数区域 -->
          <el-button type="primary" @click=" dialogVisibleParams = true">添加参数</el-button>
          <!-- 表格区域 -->
          <el-table :data="dynamicList" style="width: 100%" border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  :key="i"
                  v-for="(tag,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(i,scope.row)"
                >{{tag}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>

            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>

            <el-table-column prop="attr_name" label="参数名称"></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="haandleEditAdd(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane :disabled="isDisable" label="静态属性" name="only">
          <!-- 添加属性区域 -->
          <el-button type="primary" @click=" dialogVisibleParams = true">添加属性</el-button>

          <!-- 表格区域 -->
          <el-table :data="statiList" style="width: 100%" border>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  :key="i"
                  v-for="(tag,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(i,scope.row)"
                >{{tag}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>

            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>

            <el-table-column prop="attr_name" label="参数名称"></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="haandleEditAdd(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数属性对话框 -->
    <el-dialog
      :title="'添加'+this.paramsText"
      :visible.sync="dialogVisibleParams"
      width="50%"
      @close="handleCloseParams"
    >
      <el-form
        :model="ruleFormParams"
        :rules="rulesParams"
        ref="ruleParams"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="this.paramsText" prop="attr_name">
          <el-input v-model="ruleFormParams.attr_name" wi></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleParams = false">取 消</el-button>
        <el-button type="primary" @click="handleAddParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数属性对话框 -->
    <el-dialog
      :title="'修改'+this.paramsText"
      :visible.sync="dialogVisibleParamsEdit"
      width="50%"
      @close="EdithandleCloseParams"
    >
      <el-form
        :model="ruleFormParamsEdit"
        :rules="rulesParamsEdit"
        ref="ruleParamsEdit"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="this.paramsText" prop="attr_name">
          <el-input v-model="ruleFormParamsEdit.attr_name" wi></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleParamsEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleAddParamsEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Crumbs from '../crumbs.vue'
export default {
  data() {
    return {
      // 面包屑数据
      crumbs: [
        {
          name: '商品管理',
          id: 0
        },
        {
          name: '分类参数',
          id: 1
        }
      ],
      // 选中项绑定值
      cascaderList: [],
      // 级联选择器的配置项
      propConfig: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 分类数据数组
      ParentList: [],
      // 参数属性绑定的样式属性
      activeName: 'many',
      // 动态参数列表
      dynamicList: [],
      // 静态属性列表
      statiList: [],
      // 控制添加参数属性对话框的显示与隐藏
      dialogVisibleParams: false,
      // 添加参数对话框的表单数据
      ruleFormParams: {
        attr_name: ''
      },
      // 添加参数对话框的表单验证对象
      rulesParams: {
        attr_name: [
          {
            required: true,
            message: '请输入文字',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改参数属性对话框的显示与隐藏
      dialogVisibleParamsEdit: false,
      // 修改参数属性对话框的表单数据
      ruleFormParamsEdit: {
        attr_name: '',
        attr_id: null
      },
      // 修改参数属性对话框的表单验证对象
      rulesParamsEdit: {
        attr_name: [
          {
            required: true,
            message: '请输入文字',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    Crumbs
  },
  created() {
    this.getParamList()
  },
  computed: {
    // 如果按钮需要被禁用，则返回true，否则返回false
    isDisable() {
      if (this.cascaderList.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    sortId() {
      if (this.cascaderList.length !== 3) {
        return null
      }
      return this.cascaderList[2]
    },
    paramsText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    // 获取商品分类数据
    async getParamList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.ParentList = res.data
    },
    // 级联选择项变动会触发这个函数
    handleChange() {
      this.getSortParams()
    },
    // tab 被选中时触发
    async handleClick() {
      this.getSortParams()
    },

    // 获取分类参数列表
    async getSortParams() {
      // 证明选中的不是三级分类
      if (this.cascaderList.length !== 3) {
        this.cascaderList = []
        this.dynamicList = []
        this.statiList = []
        return
      }

      const { data: res } = await this.$http.get(
        `categories/${this.sortId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制按钮与输入框的显示隐藏
        item.inputVisible = false
        // 文本框中输入的内容
        item.inputValue = ''
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      if (this.activeName === 'many') {
        this.dynamicList = res.data
      } else {
        this.statiList = res.data
      }
    },

    // 监听添加参数属性对话框的显示与隐藏
    handleCloseParams() {
      this.$refs.ruleParams.resetFields()
    },

    // 点击按钮 添加参数或属性
    handleAddParams() {
      const confrim = this.$refs.ruleParams.validate(async (value) => {
        if (!value) return this.$message.error('请正确填写表单数据')
        const { data: res } = await this.$http.post(
          `categories/${this.sortId}/attributes`,
          {
            attr_name: this.ruleFormParams.attr_name,
            attr_sel: this.activeName
          }
        )
        console.log(res)
        if (res.meta.status !== 201) {
          this.dialogVisibleParams = false
          return this.$message.error('添加参数失败！')
        }
        this.getSortParams()
        this.dialogVisibleParams = false
        this.$message.success('添加参数成功！')
      })
    },

    // 重置修改参数后属性对话框的表单数据
    EdithandleCloseParams() {
      this.$refs.ruleParamsEdit.resetFields()
    },

    // 点击按钮修改参数数据
    handleAddParamsEdit() {
      this.$refs.ruleParamsEdit.validate(async (value) => {
        if (!value) {
          return this.$message.error('请输入正确的表单数据')
        }
        const { data: res } = await this.$http.put(
          `categories/${this.sortId}/attributes/${this.ruleFormParamsEdit.attr_id}`,
          {
            attr_name: this.ruleFormParamsEdit.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败')
        }
        this.$message.success('修改参数成功！')
        this.getSortParams()
        this.dialogVisibleParamsEdit = false
      })
    },

    // 点击展开修改参数数据对话框
    async haandleEditAdd(cId) {
      this.dialogVisibleParamsEdit = true
      // 根据id查询参数
      const { data: res } = await this.$http.get(
        `categories/${this.sortId}/attributes/${cId}`,
        {
          attr_sel: this.activeName
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.ruleFormParamsEdit.attr_name = res.data.attr_name
      this.ruleFormParamsEdit.attr_id = res.data.attr_id
      this.$message.success('获取参数成功！')
    },

    // 点击删除参数属性
    async removeParams(id) {
      const confirm = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$message.info('用户取消了删除！')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.sortId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getSortParams()
    },

    // 点击按钮，展开文本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面元素被重新渲染之后，才会指定回调函数的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 文本框失去了焦点，或摁下了enter键都会触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有reture 则证明输入的内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.setAttrVals(row)
    },
    // 将对attr_vals的操作，保存到数据库
    async setAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.sortId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('添加参数失败！')
      }
      this.$message.success('修改参数项成功！')
    },

    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.setAttrVals(row)
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 0 10px 0 0;
}
.el-input {
  width: 100px;
}
</style>
