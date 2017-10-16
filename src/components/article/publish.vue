<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        <el-breadcrumb-item>发布文章</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item>
          <el-col :span="11" class="title">
            <el-form-item label="文章标题" prop="artTitle">
              <el-input v-model="ruleForm.artTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属分类" prop="artType">
              <el-select v-model="ruleForm.artType" placeholder="请选择分类">
                <el-option label="Home" value="Home"></el-option>
                <el-option label="Code" value="Code"></el-option>
                <el-option label="Note" value="Note"></el-option>
                <el-option label="About" value="About"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="添加标签" prop="artTag">
              <el-select v-model="ruleForm.artTag" placeholder="请选择标签">
                <el-option v-for="option in ruleForm.tagList" :key="option.tagId" :label="option.tagName" :value="option.tagId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="摘要" prop="artAbstract" required>
          <el-input type="textarea" v-model="ruleForm.artAbstract"></el-input>
        </el-form-item>
        <el-form-item label="" prop="artContent" style="height: 100%">
          <mavonEditor v-model="ruleForm.artContent"></mavonEditor>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button type="primary" @click="submitForm('ruleForm')">立即发布</el-button>

            </el-col>
            <el-col :span="12">
              <el-form-item label="发布时间" prop="artCdate" required>
                <el-date-picker @change="setDate" v-model="ruleForm.artCdate" type="datetime" placeholder="选择日期时间"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

</template>
<script>
  import { mavonEditor } from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css';
  export default {
    components: {
      mavonEditor
    },
    data() {
      return {
        ruleForm: {
          artTitle: '',
          artType: '',
          artCdate: '',
          tagList: [],
          artTag: '',
          artAbstract: '',
          published: 0,//1：公开；0：私密
          artContent: ''
        },
        rules: {
          artTitle: [
            { required: true, message: '请输入文章标题', trigger: 'blur' }
          ],
          artType: [
            { required: true, message: '请选择文章分类', trigger: 'change' }
          ],
          artTag: [
            { required: true, message: '请选择文章标签', trigger: 'change' }
          ],
          artContent: [
            { required: true, message: '请输入文章内容', trigger: 'change' }
          ],
          artAbstract: [
            { required: true, message: '请输入文章摘要', trigger: 'change' }
          ],
          artCdate: [
            { required: true, message: '请选择日期时间', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      //日期格式化
      setDate(val) {
        this.ruleForm.artCdate = val;
      },
      //表单提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/api/saveArticle',this.ruleForm).then((res) => {
              if(res.data.code == 0){
                this.$message({
                  message: res.data.message
                });
                this.$router.push({path: '/article/list'})
              }
              console.log("Res="+JSON.stringify(res));
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted (){
      this.$http.get('/api/getTagList').then((res) => {
        this.ruleForm.tagList = res.data.tagList;
      })
    }
  }
</script>
<style>
  .title {margin-left: -100px;}
</style>
