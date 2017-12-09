<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form ref="ChangepwdForm" class="demo-ruleForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model="form.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="form.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd">
          <el-input type="password" v-model="form.confirmPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
  import { changePwd } from "../../api/api";
  export default{
    data(){
      return {
        form: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: '',
          userName: ''
        },
        rules: {
          oldPwd: [
            {required: true, message: '请输入原始密码', trigger: 'blur'},
          ],
          newPwd: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
          ],
          confirmPwd: [
            {required: true, message: '请输入确认新密码', trigger: 'blur'},
          ]
        },
      }
    },
    created(){
      var reg = new RegExp('"',"g");
      var userName = sessionStorage.getItem("login-user");
      userName = userName.replace(reg, "");
      this.form.userName = userName;
    },
    methods:{
      onSubmit() {
        this.$refs.ChangepwdForm.validate((valid) => {
          if (valid) {
            let newPwd = this.form.newPwd;
            let confirmPwd = this.form.confirmPwd;
            if(newPwd != confirmPwd){
              this.$message({
                message: "两次输入的新密码不一致"
              });
              return false;
            }else {
              this.logining = true;
              this.$http.post(changePwd, {"userName": this.form.userName, "oldPwd": this.form.oldPwd,"newPwd": this.form.newPwd, "confirmPwd": this.form.confirmPwd}).then((res) => {
                // success
                this.logining = false;
                //提示信息
                this.$message({
                  message: res.data.message
                });
                if(res.data.code === 4){
                  this.form.oldPwd = '';
                  this.form.newPwd = '';
                  this.form.confirmPwd = '';
                }
              }, (error) => {
                // error
              })
            }
          } else {
            return false;
          }
        });
      }
    }
  }
</script>
