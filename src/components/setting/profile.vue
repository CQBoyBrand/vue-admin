<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form ref="userInfoForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.useranme" disabled></el-input>
        </el-form-item>
        <el-form-item prop="nickName" label="昵称">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item prop="weibo" label="新浪微博">
          <el-input v-model="form.weibo"></el-input>
        </el-form-item>
        <el-form-item prop="github" label="Github">
          <el-input v-model="form.github"></el-input>
        </el-form-item>
        <el-form-item prop="introduce" label="简介">
          <el-input type="textarea" :rows="6" v-model="form.introduce" placeholder="请介绍下你自己呗~~~"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="save">修改并保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import { getUserInfo, changeUserInfo } from "../../api/api"

  export default {
    data() {
      return {
        save: false,
        form: {
          useranme: '',
          nickName: '',
          email: '',
          weibo:'',
          github:"",
          introduce:''
        },
        rules: {
          nickName: [
            {required: true, message: '请输入昵称', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          weibo: [
            {required: true, message: '请输入微博地址', trigger: 'blur'},
          ],
          github: [
            {required: true, message: '请输入Github地址', trigger: 'blur'},
          ],
          introduce: [
            {required: true, message: '请简介下你自己呗~~~~', trigger: 'blur'}
          ]
        },
      }
    },
    created(){
      var reg = new RegExp('"',"g");
      var userName = sessionStorage.getItem("login-user");
      userName = userName.replace(reg, "");
      this.form.useranme = userName;
      this.$http.post(getUserInfo, {"userName": this.form.useranme}).then((res) => {
        // success
        var userData = res.data.userInfo[0];
        this.form.nickName = userData.nickName;
        this.form.weibo = userData.weibo;
        this.form.email = userData.email;
        this.form.github = userData.github;
        this.form.introduce = userData.introduce;

      }, (error) => {
        // error
      })
    },
    methods: {
      onSubmit() {
        var that = this;
        this.$refs.userInfoForm.validate((valid) => {
          if (valid) {
            var args = {"userName": this.form.useranme, "nickName": this.form.nickName,"email": this.form.email,"weibo": this.form.weibo,"github": this.form.github,"introduce": this.form.introduce,};
            this.save = true;
            this.$http.post(changeUserInfo, args).then((res) => {
              // success
              //提示信息
              this.$message({
                message: res.data.message
              });
              this.save = false;

            }, (error) => {
              // error
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted() {
      var user = sessionStorage.getItem('access-user');
      if (user) {
        user = JSON.parse(user);
        this.form.useranme = user.username;
        this.form.name = user.name || '';
        this.form.email = user.email || '';
      }
    }
  }
</script>
