<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
        There Is Nothing~~~~~
    </el-col>
  </el-row>
</template>
<style>

  .chart-container .el-col {
    padding: 30px 20px;
  }
</style>

<script>

  export default {
    data() {
      return {

      };
    }
  }
</script>
