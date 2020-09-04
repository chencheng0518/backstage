<template>
  <div id="roles">
    <!-- 面包屑导航区域 -->
    <Crumbs :crumbs="this.crumbs"></Crumbs>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="RolesDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="RolesDialogVisible"
        width="50%"
        @close="handleCloseRolse"
      >
        <!-- 内容区域 -->
        <el-form
          :model="RolesRuleForm"
          :rules="RolesRules"
          ref="RolesRuleRefs"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="RolesRuleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="RolesRuleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="RolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 角色列表数据区域 -->
      <el-table :data="RolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',index1 === 0 ? 'bdtop' : '','vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag closable @close="removeById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="18">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop','vcenter']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeById(scope.row,item2.id)"
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeById(scope.row,item3.id)"
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteRoles(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="handlePower(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改角色信息对话框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="handleCloseEdit"
      >
        <!-- 内容区域 -->
        <el-form
          :model="RolesRuleFormEdit"
          :rules="RolesRules"
          ref="RolesRuleRefsEdit"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="RolesRuleFormEdit.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="RolesRuleFormEdit.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="dialogVisiblePower"
        width="50%"
        @close="handleClosePower"
      >
        <!-- 树状控件 -->
        <el-tree
          ref="treeRefs"
          :default-checked-keys="keysList"
          :data="treeList"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          default-expand-all
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblePower = false">取 消</el-button>
          <el-button type="primary" @click="handleAddPower">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Crumbs from '../crumbs.vue'
import loginVue from '../../pages/login/login.vue'
export default {
  data() {
    return {
      crumbs: [
        {
          name: '权限管理',
          id: 0
        },
        {
          name: '角色列表',
          id: 1
        }
      ],
      // 角色列表数据
      RolesList: [],
      // 控制添加角色对话框的显示与隐藏
      RolesDialogVisible: false,
      // 添加角色的表单数据
      RolesRuleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的验证规则对象
      RolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '长度在 2 到 6 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '长度在 2 到 6 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 控制 修改角色信息对话框的显示与隐藏
      editDialogVisible: false,
      // 修改角色信息的表单数据
      RolesRuleFormEdit: {
        roleName: '',
        roleDesc: ''
      },
      // 控制分配权限对话框的显示与隐藏
      dialogVisiblePower: false,
      // 树状权限表
      treeList: [],
      // 树状控件配置选项
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的权限数组
      keysList: [],
      // 当前角色id
      roleId: ''
    }
  },
  components: {
    Crumbs
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表数据失败！')
      }
      this.RolesList = res.data
      this.$message.success('获取角色列表数据成功！')
    },
    // 监听添加角色对话框的关闭事件
    handleCloseRolse() {
      this.$refs.RolesRuleRefs.resetFields()
    },
    // 点击按钮，添加新角色
    handleAddRoles() {
      this.$refs.RolesRuleRefs.validate(async (value) => {
        if (!value) return this.$message.error('请填写表单数据')
        const { data: res } = await this.$http.post('roles', this.RolesRuleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }
        this.getRolesList()
        this.$message.success(res.meta.msg)
        this.RolesDialogVisible = false
      })
    },
    // 点击按钮，根据id查询角色信息事件
    async handleEdit(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！')
      }
      this.RolesRuleFormEdit = res.data
      this.$message.success('查询角色信息成功')
    },
    // 监听修改角色信息对话框的关闭事件
    handleCloseEdit() {
      this.$refs.RolesRuleRefsEdit.resetFields()
    },
    // 点击按钮，修改角色信息
    AddRoles() {
      var index = this.RolesList.findIndex(
        (v) => v.roleName === this.RolesRuleFormEdit.roleName
      )
      if (
        this.RolesRuleFormEdit.roleName === this.RolesList[index].roleName &&
        this.RolesRuleFormEdit.roleDesc === this.RolesList[index].roleDesc
      ) {
        return (this.editDialogVisible = false)
      } else {
        this.$refs.RolesRuleRefsEdit.validate(async (value) => {
          if (!value) return
          const { data: res } = await this.$http.put(
            'roles/' + this.RolesRuleFormEdit.roleId,
            {
              roleName: this.RolesRuleFormEdit.roleName,
              roleDesc: this.RolesRuleFormEdit.roleDesc
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('修改角色信息失败')
          }
          this.$message.success(res.meta.msg)
          this.getRolesList()
          this.editDialogVisible = false
        })
      }
    },
    // 点击按钮，删除角色
    async handleDeleteRoles(id) {
      const confirm = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') return this.$message.info('已取消删除该角色')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      this.editDialogVisible = false
      this.getRolesList()
      this.$message.success('删除该角色成功！')
    },
    // 点击权限按钮，根据id删除对应的权限
    async removeById(role, rightId) {
      const confirm = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirm !== 'confirm') {
        return this.$message.info('用户已取消删除该权限！')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
      role.children = res.data
      this.$message.success('删除该权限成功！')
    },
    // 监听分配权限对话框的关闭事件
    handleClosePower() {
      this.keysList = []
    },
    // 点击按钮，打开分配权限对话框
    async handlePower(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限树状表失败！')
      }
      this.treeList = res.data
      this.$message.success(res.meta.msg)
      this.dialogVisiblePower = true
      this.loopTree(role, this.keysList)
    },
    // 循环递归拿到 对应角色的权限id
    loopTree(role, arr) {
      if (!role.children) return arr.push(role.id)
      role.children.forEach((v) => {
        this.loopTree(v, arr)
      })
    },
    // 点击为角色分配权限
    async handleAddPower() {
      const PowerArr = [
        ...this.$refs.treeRefs.getCheckedKeys(),
        ...this.$refs.treeRefs.getHalfCheckedKeys()
      ]
      const strId = PowerArr.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: strId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.getRolesList()
      this.$message.success(res.meta.msg)
      this.dialogVisiblePower = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #ddd;
}
.bdbottom {
  border-bottom: 1px solid #ddd;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
