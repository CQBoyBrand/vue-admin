<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>文章管理</el-breadcrumb-item>
        <el-breadcrumb-item>文章列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="文章标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getArticleByTitle">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="articles" highlight-current-row v-loading="listLoading"
                style="width: 100%;">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column type="expand">
          <template scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="[标签]">
                <el-tag type="primary">{{ props.row.tagName }}</el-tag>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="[摘要]">
                <span>{{ props.row.artAbstract }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="artTitle" label="文章标题" width="300" sortable></el-table-column>
        <el-table-column prop="artType" label="分类" width="150" sortable></el-table-column>
        <el-table-column prop="artCdate" label="发布日期"  sortable></el-table-column>
        <el-table-column prop="published" label="状态" sortable>
          <template scope="scope">
            {{filtrState(scope.row.published)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button v-if="scope.row.published == 1" type="danger" @click="changeState(scope.$index,scope.row, scope.published = 0)" size="small">私密</el-button>
            <el-button v-if="scope.row.published == 0" type="danger" @click="changeState(scope.$index,scope.row, scope.published = 1)" size="small">公开</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageRow" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
  import {getArticleList, changeStatus, getArticleByTitle} from "../../api/api"
  export default{
    data(){
      return {
        filters: {
          name: ''
        },
        articles: [],
        total: 0,
        page: 1,
        pageRow: 10,//每页显示条数
        published:0,
        listLoading: false,

        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            {required: true, message: '请输入书名', trigger: 'blur'}
          ],
          author: [
            {required: true, message: '请输入作者', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入简介', trigger: 'blur'}
          ]
        },
        editForm: {
          id: 0,
          name: '',
          author: '',
          publishAt: '',
          description: ''
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入书名', trigger: 'blur'}
          ],
          author: [
            {required: true, message: '请输入作者', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入简介', trigger: 'blur'}
          ]
        },
        addForm: {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        }
      }
    },
    methods: {
      //文章状态过滤
      filtrState(val){
        if(val == 0 ){
          return "私密"
        }
        if(val == 1 ){
          return "公开"
        }
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getArticles();
      },
      //获取文章列表
      getArticles() {
        let para = {
          pageNum: this.page,
          pageRow: this.pageRow
        };
        this.listLoading = true;
        this.$http.post(getArticleList,para).then((res) => {
          this.total = res.data.total;
          this.articles = res.data.artList;
          this.listLoading = false;
        })
      },
      //根据标题获取文章
      getArticleByTitle() {
        let para = {
          artTitle: this.filters.name,
          pageNum: this.page,
          pageRow: this.pageRow
        };
        this.listLoading = true;
        this.$http.post(getArticleByTitle,para).then((res) => {
          this.total = res.data.total;
          this.articles = res.data.artList;
          this.listLoading = false;
        })
      },
      //修改文章状态
      changeState: function (index, row, published) {
        this.$confirm('确认修改该记录状态吗?', '提示', {type: 'warning'}).then(() => {
          this.listLoading = true;
          let para = {artId: row.artId,published: published};
          this.$http.post(changeStatus, para).then((res) => {
            this.listLoading = false;
            this.$message({
              message: res.data.message,
              type: 'success'
            });
            this.getArticles();
          });
        }).catch(() => {
        });
      },
      //编辑按钮
      showEditDialog: function (index, row) {
        this.$router.push({path: '/article/publish',query: {artId: row.artId}})
      }
    },
    mounted() {
      this.getArticles();
    }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
</style>
