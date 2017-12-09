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
        <el-input type="hidden" v-model="ruleForm.artId"></el-input>
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
        <el-form-item>
          <el-col :span="24" class="thumb">
            <el-form-item label="缩略图地址" prop="artThumb">
              <el-input v-model="ruleForm.artThumb"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="摘要" prop="artAbstract" required>
          <el-input type="textarea" v-model="ruleForm.artAbstract"></el-input>
        </el-form-item>
        <el-form-item label="" prop="artContent" style="height: 100%;">
          <div class="indexContainer">
            <div class="maskContainer" v-if="dilogStatus">
              <div class="contentContainer">
                <div class="closeBtnContainer" @click="closeMaskFn"></div>
                <textarea class="showAreaContainer" v-model="msgShow" readonly></textarea>
              </div>
            </div>
            <div class="editorContainer">
              <markdown
                :mdValuesP="ruleForm.artContent"
                :fullPageStatusP="false"
                :editStatusP="true"
                :previewStatusP="true"
                :navStatusP="true"
                :icoStatusP="true"
                @childevent="childEventHandler"
              ></markdown>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button type="primary" v-if="publishShow" @click="submitForm('ruleForm')">立即发布</el-button>
             <el-button type="primary" v-if="editShow" @click="saveChange('ruleForm')">保存编辑</el-button>
            </el-col>
            <el-col v-if="publishShow" :span="12">
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
  import {addArticle ,getTag , getArtDetailById, editArticle} from "../../api/api"
  import markdown from '../../components/article/markdown'
  import Vue from "vue"
  export default {
    components: {
      markdown
    },
    data() {
      return {
        msgShow:'我要显示的内容',
        dilogStatus:false,
        publishShow: true,//发布按钮显示
        editShow: false,//编辑按钮隐藏
        ruleForm: {
          artId:'',
          artTitle: '',
          artType: '',
          artCdate: '',
          tagList: [],
          artTag: '',
          artAbstract: '',
          published: 0,//1：公开；0：私密
          artContent: '',
          artThumb: ''
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
          ],
          artThumb: [
            { required: true, message: '请填写缩略图地址', trigger: 'change' }
          ]
        }
      };
    },
    watch:{
      ruleForm: 'getArtDetail'
    },
    methods: {
      childEventHandler:function(res){
        // res会传回一个data,包含属性mdValue和htmlValue，具体含义请自行翻译
        this.ruleForm.artContent = res.mdValue;
      },
      getMdValueFn:function(){
        this.msgShow=this.msg.mdValue;
        this.dilogStatus=true;
      },
      getHtmlValueFn:function(){
        this.msgShow=this.msg.htmlValue;
        this.dilogStatus=true;

      },
      closeMaskFn:function(){
        this.msgShow='';
        this.dilogStatus=false;
      },
      //日期格式化
      setDate(val) {
        this.ruleForm.artCdate = val;
      },
      //表单提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(addArticle,this.ruleForm).then((res) => {
              if(res.data.code == 0){
                this.$message({
                  message: res.data.message
                });
                this.$router.push({path: '/article/list'})
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //编辑保存
      saveChange(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(editArticle,this.ruleForm).then((res) => {
              if(res.data.code == 0){
                this.$message({
                  message: res.data.message
                });
                this.$router.push({path: '/article/list'})
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getArtDetail(){
        this.$http.post(getArtDetailById,{artId: this.$route.query.artId}).then((res) => {
          this.ruleForm.artTitle = res.data.article[0].artTitle;
          this.ruleForm.artType = res.data.article[0].artType;
          this.ruleForm.artThumb = res.data.article[0].artThumb;
          this.ruleForm.artCdate = res.data.article[0].artCdate;
          this.ruleForm.artAbstract = res.data.article[0].artAbstract;
          this.ruleForm.artTag = res.data.article[0].artTag;
          this.ruleForm.artContent = res.data.article[0].artContent;
        })
      }
    },
    created (){
      //获取标签
      this.$http.get(getTag).then((res) => {
        this.ruleForm.tagList = res.data.tagList;
      })
      //changeArticle
      if(this.$route.query.artId){
        this.ruleForm.artId = this.$route.query.artId;
        this.publishShow = false;
        this.editShow = true;
        this.getArtDetail()
      }
    },
  }
</script>
<style lang="scss" scoped>
  .title,.thumb {margin-left: -100px;}
  /*编辑器样式*/
  .show{
    position: absolute;
    left: 0;
    top: 0;
  }
  .indexContainer {
    width: 100%;
    height: 400px;
    background: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .btnsContainer{
    position: absolute;
    z-index: 10;
    left: 65px;
    top: 5px;
    height: 25px;
    min-width: 300px;
  // background: pink;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  .btn{
    display: inline-block;
    border:1px solid #ccc;
    margin-right: 10px;
    box-sizing: border-box;
    padding: 0 10px;
    background: #fff;
    font-size: 12px;
    height: 25px;
    line-height: 25px;
    cursor:pointer;
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none; /* you could also put this in a class */
    -webkit-user-select:none;/* and add the CSS class here instead */
    -ms-user-select:none;
    user-select:none;/**禁止选中文字*/
  &:active{
     opacity: 0.8;
     background: lightblue;
   }
  }
  }
  .maskContainer{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    height: 100vh;
    width: 100vw;
    background: rgba(0,0,0,0.5);
  // z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  .contentContainer{
    width: 60%;
    height: 60%;
    background: #fefefe;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
  .showAreaContainer{
    height: 100%;
    width: 100%;
    outline: none;
    background: #eee;
    display: block;
    resize: none;
    padding: 10px;
    box-sizing: border-box;
  }
  .closeBtnContainer{
    position: absolute;
    height: 30px;
    width: 30px;
    right: -40px;
    top: -40px;
    border:1px solid #fff;
    border-radius: 50%;
  &::before{
     content: '';
     position: absolute;
     width: 70%;
     height: 2px;
     display: block;
     background: #fff;
     left: 15%;
     top: calc(50% - 1px);
     transform: rotate(45deg);
     -webkit-transform: rotate(45deg);
     -moz-transform: rotate(45deg);
   }
  &::after{
     content: '';
     position: absolute;
     width: 70%;
     height: 2px;
     display: block;
     background: #fff;
     left: 15%;
     top: calc(50% - 1px);
     transform: rotate(-45deg);
     -webkit-transform: rotate(-45deg);
     -moz-transform: rotate(-45deg);
   }
  }
  }
  }

  .editorContainer {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
  }
</style>
