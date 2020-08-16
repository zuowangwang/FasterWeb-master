<template>
  <el-container>
    <el-header style="padding: 0; height: 50px;">
      <div style=" padding-left: 10px;">
        <el-row :gutter="50">
          <el-col :span="0.5">
            <el-checkbox
              v-if="apiData.count > 0"
              v-model="checked"
              style="padding-top: 14px; padding-left: 2px"
            ></el-checkbox>
          </el-col>

          <el-col :span="7" style="margin-left: 0px">
            <el-input placeholder="请输入接口名称" clearable  v-model="search" @clear='closeList()'>
              <el-button slot="append" icon="el-icon-search" @click="getAPIList"></el-button>
            </el-input>
          </el-col>

          <!-- <el-col :span="7" style="margin-left: -10px">
            <el-button type="primary" size="medium" @click="closeList">清空</el-button>
          </el-col> -->
        </el-row>
      </div>
    </el-header>

    <el-container>
      <el-main style="padding: 0; margin-left: 10px;">
        <el-dialog v-if="dialogTableVisible" :visible.sync="dialogTableVisible" width="70%">
          <report :summary="summary"></report>
        </el-dialog>

        <el-dialog title="Run API Tree" :visible.sync="dialogTreeVisible" width="40%">
          <div>
            <div>
              <el-row :gutter="2">
                <el-col :span="8">
                  <el-switch
                    style="margin-top: 10px"
                    v-model="asyncs"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="异步执行"
                    inactive-text="同步执行"
                  ></el-switch>
                </el-col>
                <el-col :span="10">
                  <el-input
                    size="small"
                    v-show="asyncs"
                    clearable
                    placeholder="请输入报告名称"
                    v-model="reportName"
                    :disabled="false"
                  ></el-input>
                </el-col>
              </el-row>
            </div>
            <div style="margin-top: 20px">
              <el-input
                placeholder="输入节点名称进行过滤"
                v-model="filterText"
                size="medium"
                clearable
                prefix-icon="el-icon-search"
              ></el-input>

              <el-tree
                :filter-node-method="filterNode"
                :data="dataTree"
                show-checkbox
                node-key="id"
                :expand-on-click-node="false"
                check-on-click-node
                :check-strictly="true"
                :highlight-current="true"
                ref="tree"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                    <i class="iconfont" v-html="expand"></i>
                    &nbsp;&nbsp;{{ node.label }}
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogTreeVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="runTree">确 定</el-button>
          </span>
        </el-dialog>

        <div style="position: fixed; bottom: 0; right:0; left: 460px; top: 160px">
          <el-table
            v-loading="loading"
            element-loading-text="正在玩命加载"
            highlight-current-row
            height="600px"
            ref="multipleTable"
            :data="apiData.results"
            :show-header="false"
            :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
            style="width: 100%;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column align="center">
              <template slot-scope="scope">
                <div class="block block_post" v-if="scope.row.method.toUpperCase() === 'POST' ">
                  <span class="block-method block_method_post block_method_color">POST</span>
                  <span class="block-summary-description">{{scope.row.name}}</span>
                  <span class="block-method block_url">{{scope.row.url}}</span>
                </div>

                <div class="block block_get" v-if="scope.row.method.toUpperCase() === 'GET' ">
                  <span class="block-method block_method_get block_method_color">GET</span>
                  <span class="block-summary-description">{{scope.row.name}}</span>
                  <span class="block-method block_url">{{scope.row.url}}</span>
                </div>

                <div class="block block_put" v-if="scope.row.method.toUpperCase() === 'PUT' ">
                  <span class="block-method block_method_put block_method_color">PUT</span>
                  <span class="block-summary-description">{{scope.row.name}}</span>
                  <span class="block-method block_url">{{scope.row.url}}</span>
                </div>

                <div class="block block_delete" v-if="scope.row.method.toUpperCase() === 'DELETE' ">
                  <span class="block-method block_method_delete block_method_color">DELETE</span>
                  <span class="block-summary-description">{{scope.row.name}}</span>
                  <span class="block-method block_url">{{scope.row.url}}</span>
                </div>

                <div class="block block_patch" v-if="scope.row.method.toUpperCase() === 'PATCH' ">
                  <span class="block-method block_method_patch block_method_color">PATCH</span>
                  <span class="block-summary-description">{{scope.row.name}}</span>
                  <span class="block-method block_url">{{scope.row.url}}</span>
                </div>

                <div class="block block_head" v-if="scope.row.method.toUpperCase() === 'HEAD' ">
                  <span class="block-method block_method_head block_method_color">HEAD</span>
                  <span class="block-summary-description">{{scope.row.name}}</span>
                  <span class="block-method block_url">{{scope.row.url}}</span>
                </div>

                <div
                  class="block block_options"
                  v-if="scope.row.method.toUpperCase()=== 'OPTIONS' "
                >
                  <span class="block-summary-description">{{scope.row.name}}</span>
                  <span class="block-method block_url">{{scope.row.url}}</span>
                  <span class="block-method block_method_options block_method_color">OPTIONS</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column width="200">
              <template slot-scope="scope">
                <el-row>
                  <el-button
                    type="info"
                    icon="el-icon-edit"
                    circle
                    size="mini"
                    @click="handleRowClick(scope.row)"
                    title="编辑"
                  ></el-button>
                  <el-button
                    type="primary"
                    icon="el-icon-caret-right"
                    circle
                    size="mini"
                    @click="handleRunAPI(scope.row.id)"
                    title="运行"
                  ></el-button>
                  <el-button
                    type="success"
                    icon="el-icon-document"
                    circle
                    size="mini"
                    @click="handleCopyAPI(scope.row.id)"
                    title="复制"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    size="mini"
                    @click="handleDelApi(scope.row.id)"
                    title="删除"
                  ></el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <div style="float:right;margin-top:20px;margin-right:40px">
            <el-pagination
              style="margin-top: 5px;"
              :page-size="11"
              v-show="apiData.count !== 0 "
              background
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              layout="total, prev, pager, next, jumper"
              :total="apiData.count"
            ></el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Report from "../../../reports/DebugReport";

export default {
  components: {
    Report,
  },
  name: "ApiList",
  props: {
    host: {
      require: true,
    },
    config: {
      require: true,
    },
    run: Boolean,
    back: Boolean,
    node: {
      require: true,
    },
    project: {
      require: true,
    },
    del: Boolean,
  },
  data() {
    return {
      checked: false,
      search: "",
      reportName: "",
      asyncs: false,
      filterText: "",
      loading: true,
      expand: "&#xe65f;",
      dataTree: {},
      dialogTreeVisible: false,
      dialogTableVisible: false,
      summary: {},
      selectAPI: [],
      currentRow: "",
      currentPage: 1,
      apiData: {
        count: 0,
        results: [],
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },

    run() {
      this.asyncs = false;
      this.reportName = "";
      this.getTree();
    },
    back() {
      this.getAPIList();
    },
    node() {
      this.search = "";
      this.getAPIList();
    },
    checked() {
      if (this.checked) {
        this.toggleAll();
      } else {
        this.toggleClear();
      }
    },

    del() {
      if (this.selectAPI.length !== 0) {
        this.$confirm("此操作将永久删除API，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$api.delAllAPI({ data: this.selectAPI }).then((resp) => {
            this.getAPIList();
          });
        });
      } else {
        this.$notify.warning({
          message: "请至少选择一个接口",
        });
      }
    },
  },

  methods: {
    handleCopyAPI(id) {
      this.$prompt("请输入接口名称", "提示", {
        confirmButtonText: "确定",
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: "接口名称不能为空",
      }).then(({ value }) => {
        this.$api
          .copyAPI(id, {
            name: value,
          })
          .then((resp) => {
            if (resp.success) {
              this.$notify.success("复制API成功");
              this.getAPIList();
            } else {
              this.$notify.error(resp.msg);
            }
          });
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    runTree() {
      this.dialogTreeVisible = false;
      const relation = this.$refs.tree.getCheckedKeys();
      if (relation.length === 0) {
        this.$notify.warning({
          message: "请至少选择一个节点",
        });
      } else {
        this.$api
          .runAPITree({
            host: this.host,
            project: this.project,
            relation: relation,
            async: this.asyncs,
            name: this.reportName,
            config: this.config,
          })
          .then((resp) => {
            if (resp.hasOwnProperty("status")) {
              this.$notify.info({
                message: resp.msg,
                duration: 1500,
              });
            } else {
              this.summary = resp;
              this.dialogTableVisible = true;
            }
          });
      }
    },
    getTree() {
      this.$api
        .getTree(this.$route.params.id, { params: { type: 1 } })
        .then((resp) => {
          this.dataTree = resp.tree;
          this.dialogTreeVisible = true;
        });
    },

    handleSelectionChange(val) {
      this.selectAPI = val;
    },

    toggleAll() {
      this.$refs.multipleTable.toggleAllSelection();
    },

    toggleClear() {
      this.$refs.multipleTable.clearSelection();
    },
    // 查询api列表
    getAPIList() {
      this.$api
        .apiList({
          params: {
            node: this.node,
            project: this.project,
            search: this.search,
            page: this.currentPage,
          },
        })
        .then((res) => {
          this.apiData = res;
          this.loading = false;
        });
    },
    closeList() {
      this.search = "";
      this.$api
        .apiList({
          params: {
            node: this.node,
            project: this.project,
            search: this.search,
            page: this.currentPage,
          },
        })
        .then((res) => {
          this.apiData = res;
          this.loading = false;
        });
    },
    handleCurrentChange(val) {
      this.$api
        .getPaginationBypage({
          params: {
            page: this.currentPage,
            node: this.node,
            project: this.project,
            search: this.search,
          },
        })
        .then((res) => {
          this.apiData = res;
        });
    },

    //删除api
    handleDelApi(index) {
      this.$confirm("此操作将永久删除该API，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api.delAPI(index).then((resp) => {
          if (resp.success) {
            this.$notify.success("删除API成功");
            this.getAPIList();
          } else {
            this.$notify.error(resp.msg);
          }
        });
      });
    },

    // 编辑API
    handleRowClick(row) {
      this.$api.getAPISingle(row.id).then((resp) => {
        if (resp.success) {
          this.$emit("api", resp);
        } else {
          this.$notify.error(resp.msg);
        }
      });
    },
    // 运行API
    handleRunAPI(id) {
      this.loading = true;
      this.$api
        .runAPIByPk(id, {
          params: {
            host: this.host,
            config: this.config,
          },
        })
        .then((resp) => {
          this.summary = resp;
          this.dialogTableVisible = true;
          this.loading = false;
        })
        .catch((resp) => {
          this.loading = false;
        });
    },

    cellMouseEnter(row) {
      this.currentRow = row;
    },

    cellMouseLeave(row) {
      this.currentRow = "";
    },
  },
  mounted() {
    this.getAPIList();
  },
};
</script>

<style scoped>
.block-method{
  width: 80px;
}
.block-summary-description{
  text-align: left;
  padding-left: 20px;
  width: 150px;
  overflow: hidden;/*超出部分隐藏*/
  text-overflow:ellipsis;/* 超出部分显示省略号 */
  white-space: nowrap;/*规定段落中的文本不进行换行 */
}
.block_url{
  flex: 1;
  text-align: left;
  overflow: hidden;/*超出部分隐藏*/
  text-overflow:ellipsis;/* 超出部分显示省略号 */
  white-space: nowrap;/*规定段落中的文本不进行换行 */
}
</style>
