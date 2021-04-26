<template>
  <el-dialog
      title="换热站管理"
      :visible.sync="dialogVisible"
      :fullscreen="true"
      :before-close="handleClose">
    <section id="staTable">
      <header>
        <el-form :inline="true" :model="formInline" class="as-filter">
          <el-form-item>
            <el-input v-model="formInline.str" clearable class="filterStr" placeholder="名称/uid"
                      @keyup.enter.stop.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.net" clearable placeholder="一网/二网">
              <el-option
                  v-for="item in netOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.level" clearable placeholder="级别">
              <el-option
                  v-for="item in levelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" plain @click="onSearch">搜索</el-button>
            <el-button plain @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </header>
      <main>
        <el-table
            border
            stripe
            ref="proTable"
            :data="tableData"
            row-class-name="messageTable"
            style="width: 100%">
          <el-table-column
              type="index"
              :index="tableIndex"
              label="序号"
              width="55">
          </el-table-column>
          <el-table-column
              prop="name"
              label="站名">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" v-if="scope.row.name_editing"
                        @blur="editBlur(scope.row, 'name_editing_ob')" :id="'input_'+scope.row.id"></el-input>
              <article class="tabEdit" v-else>
                <span>{{ scope.row.name }}</span>
                <i class="el-icon-edit" @click="openEdit(scope.row, 'name_editing')"></i>
              </article>
            </template>
          </el-table-column>
          <el-table-column
              prop="uid"
              label="uid">
            <template slot-scope="scope">
              <el-input v-model="scope.row.uid" v-if="scope.row.uid_editing"
                        @blur="editBlur(scope.row, 'uid_editing_ob')" :id="'input_'+scope.row.id"></el-input>
              <article class="tabEdit" v-else>
                <span>{{ scope.row.uid }}</span>
                <i class="el-icon-edit" @click="openEdit(scope.row, 'uid_editing')"></i>
              </article>
            </template>
          </el-table-column>
          <el-table-column
              prop="net"
              label="一网/二网">
          </el-table-column>
          <el-table-column
              prop="level"
              label="级别">
          </el-table-column>
          <el-table-column
              prop="addr"
              label="位置">
            <template slot-scope="scope">
              {{ scope.row.address[0] }} - {{ scope.row.address[1] }}
            </template>
          </el-table-column>
          <el-table-column
              prop="id"
              label="创建时间">
            <template slot-scope="scope">
              {{ dateFormat(scope.row.id) }}
            </template>
          </el-table-column>
        </el-table>
      </main>
      <footer>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="formInline.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total=pageTotal>
        </el-pagination>
      </footer>
    </section>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import StationServer from "../tool/StationServer";

export default {
  name: "StationTable",

  data() {
    return {
      test: false,
      dialogVisible: false,
      formInline: {
        str: '',
        level: null,
        net: null,
        pageIndex: 0,
        pageSize: 10
      },
      currentPage: 1,
      netOptions: [
        {
          label: "一网",
          value: 1
        },
        {
          label: "二网",
          value: 2
        }
      ],
      levelOptions: [
        {
          label: "一级",
          value: 1
        },
        {
          label: "二级",
          value: 2
        },
        {
          label: "三级",
          value: 3
        }
      ],
      tableData: [],
      pageTotal: 0
    }
  },

  methods: {
    open() {
      this.getTableList()
      this.dialogVisible = true
    },

    getTableList() {
      StationServer.findPage(this.formInline).then(res => {
        this.pageTotal = res.count
        this.tableData = res.data.map(item => {
          item.name_editing = false
          item.uid_editing = false
          this.editBind(item, 'name_editing', 'uid_editing')
          return item
        })
      })
    },

    openEdit(row, field) {
      this.$nextTick().then(_ => {
        document.getElementById('input_' + row.id).focus()
      })
      row[field + '_ob'] = true
      this.tableData.splice(0, 0)
    },

    editBlur(row, field) {
      row[field] = false
      this.tableData.splice(0, 0)
    },

    editBind(item, ...args) {
      args.map(newField => {
        let self = this
        Object.defineProperty(item, newField + '_ob', {
          set(val) {
            self.tableData.forEach(item => {
              item.name_editing = false
              item.uid_editing = false
            })
            if (!val) self.editServer(item)
            this[newField] = val
          },
          get() {
            return this[newField]
          }
        })
      })

      return item
    },

    editServer(station) {
      StationServer.edit(station).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(_=> {
        this.$message({
          type: 'error',
          message: '修改失败!'
        })
        this.getTableList()
      })
    },

    onSearch() {
      this.formInline.pageIndex = 0
      this.currentPage = 1
      this.getTableList()
    },

    onReset() {
      this.formInline = {
        str: '',
        level: null,
        net: null,
        pageIndex: 0,
        pageSize: 10
      }
      this.getTableList()
    },

    handleClose() {
      this.dialogVisible = false
      this.$emit('close')
    },

    handleSizeChange(val) {
      this.formInline.pageSize = val
      this.formInline.pageIndex = 0
      this.currentPage = this.formInline.pageIndex + 1
      this.getTableList()
    },

    handleCurrentChange(val) {
      this.formInline.pageIndex = this.formInline.pageSize * (val - 1)
      this.currentPage = val
      this.getTableList()
    },

    tableIndex(index) {
      return index + 1
    },

    dateFormat(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss")
    }
  },

  created() {
    // console.log(this)
  }
}
</script>

<style lang="scss" scoped>
#staTable {
  & > header, & > footer {
    display: flex;
    justify-content: flex-end;
  }

  & > main {
    margin-bottom: 10px;
  }

  .tabEdit {
    display: flex;
    justify-content: space-between;
    align-items: center;

    i {
      &:hover {
        color: #00B5D0;
        cursor: pointer;
      }
    }
  }
}
</style>