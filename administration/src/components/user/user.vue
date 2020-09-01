<template>
  <div id="user">
    <!-- 面包屑导航区域 -->
    <Crumbs :crumbs="this.crumbs"></Crumbs>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 输入框和添加用户按钮区域 -->
      <el-row :gutter="20">
        <!-- 输入框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="paramsInfo.query" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="AddDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="AddDialogVisible" width="50%" @close="AddDialogClose">
        <!-- 内容区域 -->
        <el-form :model="formInfo" :rules="fromRules" ref="AddFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formInfo.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="formInfo.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formInfo.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="formInfo.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="AddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 用户列表区域 -->
      <el-table :data="usersList" stripe border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="handleChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeUser(scope.row.id)"></el-button>
            <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top-start">
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsInfo.pagenum"
        :page-sizes="[1, 3, 5, 7]"
        :page-size="paramsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals"
      ></el-pagination>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户" :visible.sync="dialogVisible" width="50%" @close="handleClose">
        <!-- 内容区域 -->
        <el-form :model="editFrom" :rules="fromRules" ref="modifFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editFrom.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editFrom.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Crumbs from '../crumbs.vue'
export default {
  data() {
    // 自定义用户名验证规则
    var User = (rule, value, callback) => {
      // 4-16位字母,数字,汉字,下划线
      const regUser = /^([a-zA-Z0-9_\u4e00-\u9fa5]{4,16})$/
      // 验证用户名的正则表达式
      if (regUser.test(value)) {
        // 合法用户名
        return callback()
      }
      callback(new Error('请输入合法用户名'))
    }
    // 自定义密码验证规则
    var cipher = (rule, value, callback) => {
      // 必须以英文开头，大小写都可以,必须以数字或字母或下划线结尾(\w等同于[0-9a-zA-Z_])，同时长度在5-7之间，
      const regCipher = /^[a-zA-Z]\w{5,17}$/
      // 验证密码的正则表达式
      if (regCipher.test(value)) {
        // 合法密码
        return callback()
      }
      callback(new Error('请输入合法密码'))
    }
    // 自定义邮箱验证规则
    var mailbox = (rule, value, callback) => {
      const regMailbox = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+.)+[A-Za-z]{2,6}$/
      // 验证邮箱的正则表达式
      if (regMailbox.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号验证规则
    var phone = (rule, value, callback) => {
      const regPhone = /^1[3-9]\d{9}$/
      // 验证手机号的正则表达式
      if (regPhone.test(value)) {
        // 合法手机号
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      // 面包屑数据
      crumbs: [
        {
          name: '用户管理',
          id: 0
        },
        {
          name: '用户列表',
          id: 1
        }
      ],
      // 获取用户列表的参数
      paramsInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 2 // 每页显示条数
      },
      // 用户列表数据
      usersList: [],
      // 总条数
      totals: 0,
      // 添加用户对话框的显示与隐藏
      AddDialogVisible: false,
      // 添加用户的表单数据
      formInfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      fromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: User, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: cipher, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: mailbox, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: phone, trigger: 'blur' }
        ]
      },
      // 修改用户对话框的显示与隐藏
      dialogVisible: false,
      // 查询到的用户信息对象
      editFrom: {}
    }
  },
  components: {
    Crumbs
  },
  created() {
    this.getUsersList()
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.paramsInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.usersList = res.data.users
      this.totals = res.data.total
      this.$message.success(res.meta.msg)
    },
    // 监听每页显示的条数
    handleSizeChange(newPagesize) {
      this.paramsInfo.pagesize = newPagesize
      this.getUsersList()
    },
    // 监听当前页码
    handleCurrentChange(newPagenum) {
      this.paramsInfo.pagenum = newPagenum
      this.getUsersList()
    },
    // 监听用户状态的改变
    async handleChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('修改用户状态失败！')
      }
      this.$message.success('修改用户状态成功！')
    },
    // 监听添加用户对话框的关闭事件
    AddDialogClose() {
      this.$refs.AddFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    handleUser() {
      this.$refs.AddFormRef.validate(async (value) => {
        if (!value) return
        const { data: res } = await this.$http.post('users', this.formInfo)
        if (res.meta.status !== 201) return this.$message.error('创建用户失败')
        this.$message.success(res.meta.msg)
        this.AddDialogVisible = false
      })
    },
    // 展示修改用户的对话框
    async handleEdit(id) {
      // 根据id查询用户信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editFrom = res.data
      this.dialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    handleClose() {
      this.$refs.modifFormRef.resetFields()
    },
    // 点击按钮，修改用户信息
    handleEditUser() {
      var index = this.usersList.findIndex(
        (v) => v.username === this.editFrom.username
      )

      if (
        this.editFrom.email === this.usersList[index].email &&
        this.editFrom.mobile === this.usersList[index].mobile
      ) {
        return (this.dialogVisible = false)
      } else {
        this.$refs.modifFormRef.validate(async (value) => {
          if (!value) return
          const { data: res } = await this.$http.put(
            'users/' + this.editFrom.id,
            {
              email: this.editFrom.email,
              mobile: this.editFrom.mobile
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户信息失败')
          }
          this.$message.success(res.meta.msg)
          this.getUsersList()
          this.dialogVisible = false
        })
      }
    },
    // 点击按钮，删除用户信息事件
    async removeUser(id) {
      const confirm = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') return this.$message.info('已取消删除该用户')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除该用户失败！')
      }
      this.$message.success('已删除该用户')
      this.getUsersList()
    }
  }
}
</script>()

<style lang="less" scoped>
</style>
