<template>
  <div id="login">
    <div class="login_detail">
      <!-- 头像区域 -->
      <div class="head_portrait">
        <img src="../../assets/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="form" :model="loginFrom" :rules="loginFromRules" class="login_from">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginFrom.password"
            prefix-icon="iconfont icon-lock_fill"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="from_btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFromRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 重置表单按钮
    resetLoginFrom() {
      console.log(this)
      this.$refs.form.resetFields()
    },
    // 登录按钮
    login() {
      this.$refs.form.validate(async (valide) => {
        if (!valide) return
        const { data: res } = await this.$http.post('login', this.loginFrom)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        // 1、将登录成功之后的token，保存到客户端 sessionStorage 中
        // 1.1、项目中除了登录之外的其他API接口，必须在登录过后，拿到token了才能访问
        // 1.2、token 只应在当前网站打开期间生效，所以 将token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2、通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
#login {
  background-color: #2b4b6b;
  height: 100%;
  .login_detail {
    width: 550px;
    height: 400px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .head_portrait {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_from {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 20px;
      .from_btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
