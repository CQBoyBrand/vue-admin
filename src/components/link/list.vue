<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>友情链接</el-breadcrumb-item>
        <el-breadcrumb-item>友链列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="links" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="linkName" label="网站名称" width="200" sortable></el-table-column>
        <el-table-column prop="linkAddress" label="网站地址" sortable></el-table-column>
        <el-table-column prop="linkAvatar" label="头像" sortable></el-table-column>
        <el-table-column prop="linkDescription" label="简介" sortable></el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delLink(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchDeleteLink" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageRow" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <!--编辑界面-->
      <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="网站名称" prop="name">
            <el-input v-model="editForm.linkName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="网站地址" prop="Address">
            <el-input  v-model="editForm.linkAddress" ></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="Avatar">
            <el-input  v-model="editForm.linkAvatar" ></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="Description">
            <el-input  v-model="editForm.linkDescription" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="网站名称" prop="linkName">
            <el-input v-model="addForm.linkName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="网站地址" prop="linkAddress">
            <el-input  v-model="addForm.linkAddress" ></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="linkAvatar">
            <el-input  v-model="addForm.linkAvatar" ></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="linkDescription">
            <el-input  v-model="addForm.linkDescription" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
  import {addLink, getLinkList, editLink, deleteLink, deleteLinks} from '../../api/api';
  export default{
    data(){
      return {
        filters: {
          name: ''
        },
        links: [],
        total: 0,//总条数
        pageRow:10,//每页显示条数
        page: 1,//当前页码
        listLoading: false,
        sels: [], //列表选中列

        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          linkName: [
            {required: true, message: '请输入网站名称', trigger: 'blur'}
          ],
          linkAddress: [
            {required: true, message: '请输入网站地址', trigger: 'blur'}
          ]
        },
        editForm: {
          linkId: '',
          linkName: '',
          linkAddress: '',
          linkAvatar: '',
          linkDescription:''
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          linkName: [
            {required: true, message: '请输入网站名称', trigger: 'blur'}
          ],
          linkAddress: [
            {required: true, message: '请输入网站地址', trigger: 'blur'}
          ]
        },
        addForm: {
          linkId: '',
          linkName: '',
          linkAddress: 'http://',
          linkAvatar: '',
          linkDescription:''
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getLinks();
      },
      //获取标签列表
      getLinks() {
        let para = {
          page: this.page
        };
        this.listLoading = true;
        //NProgress.start();
        this.$http.post(getLinkList,{"pageNum": para.page,"pageRow": this.pageRow}).then((res) => {
          this.total = res.data.total;
          this.links = res.data.linkList;
          this.listLoading = false;
          //NProgress.done();
        })
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
       //删除
       delLink: function (index, row) {
         this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
           this.listLoading = true;
           //NProgress.start();
           let para = {linkId: row.linkId};
           this.$http.post(deleteLink,para).then((res) => {
             this.listLoading = false;
             //NProgress.done();
             this.$message({
               message: '删除成功',
               type: 'success'
             });
             this.getLinks();
           });
         }).catch(() => {
         });
       },
       //显示编辑界面
       showEditDialog: function (index, row) {
         this.editFormVisible = true;
         this.editForm = Object.assign({}, row);
       },
       //编辑
       editSubmit: function () {
         this.$refs.editForm.validate((valid) => {
           if (valid) {
             this.$confirm('确认提交吗？', '提示', {}).then(() => {
               this.editLoading = true;
               //NProgress.start();
               let para = Object.assign({}, this.editForm);
               this.$http.post(editLink,para).then((res) => {
                 this.editLoading = false;
                 //NProgress.done();
                 this.$message({
                   message: '修改成功',
                   type: 'success'
                 });
                 this.$refs['editForm'].resetFields();
                 this.editFormVisible = false;
                 this.getLinks();
               });
             });
           }
         });
       },
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          linkId: '',
          linkName: '',
          linkAddress: 'http://',
          linkAvatar: 'http://',
          linkDescription:'此博主有点害羞，没有做自我介绍~'
        };
      },
      //新增
      addSubmit: function () {
        this.$http.post(addLink,{"linkName": this.addForm.linkName,"linkAddress": this.addForm.linkAddress,"linkAvatar": this.addForm.linkAvatar,"linkDescription": this.addForm.linkDescription}).then((res) => {
          // success
          this.addFormVisible = false;
          this.$message({
            message: '新增成功',
            type: 'success'
          });
          this.$refs['addForm'].resetFields();
          this.getLinks();
        }, (error) => {
          // error
        })
      },
      //批量删除
      batchDeleteLink: function () {
        var ids = this.sels.map(item => item.linkId);
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          //this.listLoading = true;
          //NProgress.start();
          let para = {linkId: ids};
          this.$http.post(deleteLinks,para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getLinks();
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getLinks();
    }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
</style>
