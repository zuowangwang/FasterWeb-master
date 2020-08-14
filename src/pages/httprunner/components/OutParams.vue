<template>
  <el-table
    highlight-current-row
    :data="tableData"
    style="width: 100%;"
    :border="false"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
    :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
  >
    <el-table-column label="变量名">
      <template slot-scope="scope">
        <el-input clearable v-model="scope.row.key" placeholder="整个用例输出的参数" size="medium"></el-input>
      </template>
    </el-table-column>

    <el-table-column label="描述">
      <template slot-scope="scope">
        <el-input clearable v-model="scope.row.desc" placeholder="变量简要描述" size="medium"></el-input>
      </template>
    </el-table-column>

    <el-table-column width="130px">
      <template slot-scope="scope">
        <el-row v-show="scope.row === currentRow">
          <el-button
            icon="el-icon-circle-plus-outline"
            size="mini"
            type="info"
            @click="handleEdit(scope.$index, scope.row)">
          </el-button>

          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            v-show="tableData.length > 1"
            @click="handleDelete(scope.$index, scope.row)">
          </el-button>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
    export default {
        name: "OutParams",
        props: {
            save: Boolean,
            outParams: {
                require: false
            }
        },
        watch: {
            outParams: function () {
                if (this.outParams.length !== 0) {
                    this.tableData = this.outParams;
                }
            },
            save: function () {
                this.$emit('outParams', this.tableData);
            }
        },
        methods: {
            cellMouseEnter(row) {
              this.currentRow = row;
            },

            cellMouseLeave(row) {
              this.currentRow = '';
            },

            handleEdit(index, row) {
                this.tableData.push({
                    key: '',
                    desc: ''
                });
            },

            handleDelete(index, row) {
                this.tableData.splice(index, 1);
            },
        },
        data() {
            return {
                currentRow: '',
                tableData: [{
                  key: '',
                  desc: ''
                }]
            }
        }
    }
</script>

<style scoped>

</style>
