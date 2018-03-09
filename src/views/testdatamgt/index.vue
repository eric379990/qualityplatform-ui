<template>
  <div class="app-container calendar-list-container">
    <el-row type="flex" justify="left">
        <el-clo :span="5">
            <div style="margin-top:7px">请选择接口：</div>
        </el-clo>
        <el-clo :span="3" :offset="10">
            <el-select v-model="value" filterable placeholder="search" size="small">
            <el-option v-for="item in apiOptions" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left; color: #8492a6; font-size: 13px">{{ item.description }}</span>
                <span style="float: right">{{ item.label }}</span>
            </el-option>
            </el-select>
            <el-button type="primary" v-on:click="getApiDataInfo" size="small">查询</el-button>
        </el-clo>
    </el-row>
    <br/>
    <el-row type="flex" justify="left">
        <el-col :span="6">
            <el-button class="filter-item" v-if="tableColumnActionShow" size="mini" @click="handleCreate" type="primary" icon="el-icon-edit">新建</el-button>
        </el-col>
        <el-col :span="12" :offset="12">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50, 100, 300]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.length">
            </el-pagination>
        </el-col>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column :key='item.prop' min-width='110px' v-for='item in tableColumnData' :label="item" :prop="item" v-if="!tableColumnHiden.includes(item)">
            <template slot-scope="scope">
                <template v-if="scope.row.edit">
                    <div style="width: 80px;">
                        <el-input autosize :rows="2" size="mini" v-model="scope.row[item]"></el-input>
                    </div>
                </template>
                <span v-else>{{ scope.row[item] }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" v-if="tableColumnActionShow" label="Actions" width="200">
            <template slot-scope="scope">
                <el-button-group>
                    <el-button justify="start" v-if="scope.row.edit" type="success" @click="confirmEdit(scope.row)" size="mini" icon="el-icon-circle-check-outline">OK</el-button>
                    <el-button v-else type="primary" @click='handleRowEdit(scope.row)' size="mini" icon="el-icon-edit">Edit</el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchApiList, fetchApiParameterDataInfo, saveApiDataInfo } from '@/api/testdatamgt'

export default {
  name: 'inlineEditTable',
  data() {
    return {
      tableColumnData: [],
      tableColumnHiden: ['_id', 'row', 'functionid'],
      tableColumnActionShow: false,
      tableData: [],
      apiOptions: [],
      value: null,
      currentPage: 1,
      pagesize: 20,
      listLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getApiList()
  },
  methods: {
    getApiList() {
      fetchApiList().then(response => {
        this.apiOptions = response
      })
    },
    getApiDataInfo() {
      this.tableColumnData = []
      this.tableData = []
      this.loading = true
      this.tableColumnActionShow = true
      fetchApiParameterDataInfo({ id: this.value }).then((res) => {
        for (const item of res) {
          for (const key of Object.keys(item)) {
            if (!this.tableColumnData.includes(key)) {
              this.tableColumnData.push(key)
            }
          }
          item.edit = false
        }
        this.tableData = res
        this.loading = false
      })
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    handleSizeChange: function(size) {
      this.pagesize = size
    },
    handleRowEdit(row) {
      row.edit = !row.edit
    },
    confirmEdit(row) {
      row.edit = false
      saveApiDataInfo(row)
    },
    handleCreate() {
      const temp = this.tableData
      this.tableData = [{ 'edit': true }, ...temp]
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>