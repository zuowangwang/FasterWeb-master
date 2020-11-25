<template>
  <el-container>
    <el-header style="padding: 0; height: 50px">
      <div style="padding-left: 10px">
        <el-row :gutter="50">
          <el-col :span="0.5">
            <el-checkbox
              v-if="apiData.count > 0"
              v-model="checked"
              style="padding-top: 14px; padding-left: 2px"
            ></el-checkbox>
          </el-col>

          <el-col :span="7" style="margin-left: 0px">
            <el-input
              placeholder="请输入接口名称"
              clearable
              v-model="search"
              @clear="closeList()"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getAPIList"
              ></el-button>
            </el-input>
          </el-col>

          <!-- <el-col :span="7" style="margin-left: -10px">
            <el-button type="primary" size="medium" @click="closeList">清空</el-button>
          </el-col>-->
        </el-row>
      </div>
    </el-header>

    <el-container>
      <el-main style="padding: 0; margin-left: 10px">
        <el-dialog
          v-if="dialogTableVisible"
          :visible.sync="dialogTableVisible"
          width="70%"
        >
          <report :summary="summary"></report>
        </el-dialog>

        <el-dialog
          title="Run API Tree"
          :visible.sync="dialogTreeVisible"
          width="40%"
        >
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
            <el-button size="small" @click="dialogTreeVisible = false"
              >取 消</el-button
            >
            <el-button size="small" type="primary" @click="runTree"
              >确 定</el-button
            >
          </span>
        </el-dialog>

        <div
          style="position: fixed; bottom: 0; right: 0; left: 460px; top: 160px"
        >
          <el-table
            v-loading="loading"
            element-loading-text="正在玩命加载"
            highlight-current-row
            height="600px"
            ref="multipleTable"
            :data="apiData.results"
            :show-header="false"
            :cell-style="{ paddingTop: '4px', paddingBottom: '4px' }"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column align="center">
              <template slot-scope="scope">
                <div
                  class="block block_post"
                  v-if="scope.row.method.toUpperCase() === 'POST'"
                >
                  <span
                    class="block-method block_method_post block_method_color"
                    >POST</span
                  >
                  <div class="block-summary">
                    <span class="block-summary-description">{{
                      scope.row.name
                    }}</span>
                    <span class="block_url">{{ scope.row.url }}</span>
                  </div>
                </div>

                <div
                  class="block block_get"
                  v-if="scope.row.method.toUpperCase() === 'GET'"
                >
                  <span class="block-method block_method_get block_method_color"
                    >GET</span
                  >
                  <div class="block-summary">
                    <span class="block-summary-description">{{
                      scope.row.name
                    }}</span>
                    <span class="block_url">{{ scope.row.url }}</span>
                  </div>
                </div>

                <div
                  class="block block_put"
                  v-if="scope.row.method.toUpperCase() === 'PUT'"
                >
                  <span class="block-method block_method_put block_method_color"
                    >PUT</span
                  >
                  <div class="block-summary">
                    <span class="block-summary-description">{{
                      scope.row.name
                    }}</span>
                    <span class="block_url">{{ scope.row.url }}</span>
                  </div>
                </div>

                <div
                  class="block block_delete"
                  v-if="scope.row.method.toUpperCase() === 'DELETE'"
                >
                  <span
                    class="block-method block_method_delete block_method_color"
                    >DELETE</span
                  >
                  <div class="block-summary">
                    <span class="block-summary-description">{{
                      scope.row.name
                    }}</span>
                    <span class="block_url">{{ scope.row.url }}</span>
                  </div>
                </div>

                <div
                  class="block block_patch"
                  v-if="scope.row.method.toUpperCase() === 'PATCH'"
                >
                  <span
                    class="block-method block_method_patch block_method_color"
                    >PATCH</span
                  >
                  <div class="block-summary">
                    <span class="block-summary-description">{{
                      scope.row.name
                    }}</span>
                    <span class="block_url">{{ scope.row.url }}</span>
                  </div>
                </div>

                <div
                  class="block block_head"
                  v-if="scope.row.method.toUpperCase() === 'HEAD'"
                >
                  <span
                    class="block-method block_method_head block_method_color"
                    >HEAD</span
                  >
                  <div class="block-summary">
                    <span class="block-summary-description">{{
                      scope.row.name
                    }}</span>
                    <span class="block_url">{{ scope.row.url }}</span>
                  </div>
                </div>

                <div
                  class="block block_options"
                  v-if="scope.row.method.toUpperCase() === 'OPTIONS'"
                >
                  <span class="block-summary-description">{{
                    scope.row.name
                  }}</span>
                  <span class="block_url">{{ scope.row.url }}</span>
                  <span
                    class="block-method block_method_options block_method_color"
                    >OPTIONS</span
                  >
                </div>
              </template>
            </el-table-column>

            <el-table-column width="230">
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
                    type="warning"
                    icon="el-icon-document-copy"
                    circle
                    size="mini"
                    @click="handleSaveAPI(scope.row)"
                    title="另存为"
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
          <div style="float: right; margin-top: 20px; margin-right: 40px">
            <el-pagination
              style="margin-top: 5px"
              :page-size="11"
              v-show="apiData.count !== 0"
              background
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              layout="total, prev, pager, next, jumper"
              :total="apiData.count"
            ></el-pagination>
          </div>
        </div>

        <div class="tabList">
          <el-dialog
            title
            :visible.sync="dialogVisibleInfo"
            width="width"
            :before-close="dialogBeforeClose"
          >
            <el-tree
              @node-click="handleNodeClick"
              :data="dataTrees"
              node-key="id"
              :default-expand-all="false"
              :expand-on-click-node="false"
              draggable
              highlight-current
              :filter-node-method="filterNode"
              ref="tree2"
              @node-drag-end="handleDragEnd"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                  <i class="iconfont" v-html="expand"></i>
                  &nbsp;&nbsp;{{ node.label }}
                </span>
              </span>
            </el-tree>
            <div slot="footer">
              <el-button @click="dialogVisibleInfo = false">取 消</el-button>
              <el-button type="primary" @click="openHandleClik()"
                >确 定</el-button
              >
            </div>
          </el-dialog>
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
    move: Boolean,
    back: Boolean,
    nodelabel:String,
    node: {
      require: true,
    },
    project: {
      require: true,
    },
    del: Boolean,
    downloads: Boolean,
    DownloadAsApi: Boolean,
  },
  data() {
    return {
      checked: false,
      trigger:false,
      search: "",
      dialogVisibleInfo: false,
      infoSaveId: "",
      dataTrees: [],
      infoSaveObj: {},
      nodeId: "",
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
      list: [],
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
    
    DownloadAsApi(){
      let DateTime = new Date();
      let todaytime = DateTime.getFullYear()+"-" + (DateTime.getMonth()+1) + "-" + DateTime.getDate()
      +" " + DateTime.getHours() +"：" + DateTime.getMinutes();
      let filename = this.nodelabel+' api '+todaytime+'.xls'
      let relation = parseInt(this.node)
      let project = parseInt(this.project)
      let params = {
          relation,
          project ,
      }
      this.$api.DownloadAsApi(params).then((resp) => {
          let url = window.URL.createObjectURL(new Blob([resp.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          this.$notify.error("文件下载失败");
        });
      

    },
    downloads() {
      let that = this;
      let data = [{ name: "", url: "" }, {}];
      
      data.forEach((item, index) => {
        if (index == 0) {
          item["id"] = "id";
          item["name"] = "name";
          item["method"] = "method";
          item["url"] = "url";
          item["header"] ="header"
          item["times"] = "times";
          item["json"] ="json"
          item["form"] ="form";
          item["params"] ="params";
          item["files"] = 'files';
          item["extract"] ='extract'
          item["validate"] = 'validate';
          item["variables"] ='variables'
          item["setup_hooks"] = 'setup_hooks';
          item["teardown_hooks"] = 'teardown_hooks';
        } else {
          item["id"] ="0";
          item["name"] = "测试模板";
          item["method"] = "POST";
          item["url"] = "/api/rendering/user/userLogin";
          item["header"] ='{"header":{"Content-Type":"application/json","Accept":"application/json,text/plain"}}';
          item["times"] = "1";
          item["json"] ='{"userName":"RD_zuowangwang_test2","password":"2edf692c26918cc7d11def6ab41bbdffdbecce52"}';
          item["form"] = '{"data":{},"desc":{}}';
          item["params"] = '{"params":{},"desc":{}}';
          item["files"] = '{"files":{},"desc":{}}';
          item["extract"] ='{"extract":[{"userName":"content.data.userName"}],"desc":{"userName":"备注"}}';
          item["validate"] = '{"validate":[{"eq":["content.code",200]}]}';
          item["variables"] ='{"variables":[{"zzzz":"zzzz"}],"desc":{"zzzz":"备注"}}';
          item["setup_hooks"] = '["${cc1()}"]';
          item["teardown_hooks"] = '["${cc2()}"]';
        }
      });
      this.list = data;
      console.log(this.list);
      this.downloadWorld();
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

    move() {
      if (this.selectAPI.length !== 0) {
        this.dialogVisibleInfo = true;
        
        
      } else {
        this.$notify.warning({
          message: "请至少选择一个接口",
        });
      }
    },





  },

  methods: {
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    downloadWorld() {
      let that = this;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "api的id",
          "必填-接口名称",
          "必填-请求方式",
          "必填-请求地址",
          "请求头",
          "循环次数",
          "Request请求值-json(request请求值，四个值，如果其中一个有值，其他的都要给默认值:{})",
          "Request请求值-form",
          "Request请求值-params",
          "Request请求值-files",
          "提取",
          "校验",
          "临时变量",
          "预执行脚本",
          "后执行脚本",
        ];
        const filterVal = [
          "id",
          "name",
          "method",
          "url",
          "header",
          "times",
          "json",
          "form",
          "params",
          "files",
          "extract",
          "validate",
          "variables",
          "setup_hooks",
          "teardown_hooks",
        ];
        // that.conversionList(that.apiData.results)
        const data = that.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "测试用例模版",
        });
        that.$refs.multipleTable.clearSelection();
      });
    },
    conversionList(data) {
      data.forEach((item, index) => {
        item["id"] = item.id;
        item["name"] = item.name;
        item["method"] = item.method;
        item["url"] = item.url;
        item["header"] = JSON.stringify(item.body.header);
        item["times"] = item.body.times;
        item["json"] =
          JSON.stringify(item.body.request.json_data) ||
          JSON.stringify(item.body.request.json);
        item["form"] = JSON.stringify(item.body.request.form) || "";
        item["params"] = JSON.stringify(item.body.request.params) || "";
        item["files"] = JSON.stringify(item.body.request.files) || "";
        item["extract"] = JSON.stringify(item.body.extract) || "";
        item["validate"] = JSON.stringify(item.body.validate) || "";
        item["variables"] = JSON.stringify(item.body.variables) || "";
        item["setup_hooks"] = JSON.stringify(item.body.hooks.setup_hooks) || "";
        item["teardown_hooks"] =
          JSON.stringify(item.body.hooks.eardown_hooks) || "";
      });
      this.list = data;
    },
    handleDragEnd() {
      // this.updateTree(false);
    },
    openHandleClik() {
      // this.addAPI();
      
      let data = this.infoSaveObj;
      let datalist  = this.selectAPI;
      let project=''
      let relation = this.nodeId
      let id=''
      let ids = []
      if (data.id && datalist.length == 0){
          ids.push(data.id)
          project = data.project
      }else if (datalist.length>1){
          for (let i in datalist){
          ids.push(datalist[i].id)
          project = datalist[0].project
      }
      }
      let params = {
        project,
        relation,
        ids
      }
      this.$api.SavaAsApi(params).then(res => {
        // console.log(res)
        if (res.data.code == '0044'){
          this.$notify.success("更新成功");
          this.trigger = true;
          this.dialogVisibleInfo = false;
          this.checked = false;
          this.getAPIList();

        }

      })
    },
   
    handleNodeClick(node, data) {
      this.addAPIFlag = false;
      this.currentNode = node;
      this.nodeId = node.id;
      this.data = data;
    },
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
    getTrees() {
      this.$api
        .getTree(this.$route.params.id, { params: { type: 1 } })
        .then((resp) => {
          this.dataTrees = resp["tree"];
          this.treeId = resp["id"];
          this.maxId = resp["max"];
        });
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
      if(this.trigger){
        //触发了下一页 切换tab初始化页码
        this.currentPage=1
      }
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
      this.trigger = true //触发下一页
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
    //移动切换分组并保存
    handleSaveAPI(data) {
      this.infoSaveObj = data;
      this.dialogVisibleInfo = true;
    },

    dialogBeforeClose() {
      this.dialogVisibleInfo = false;
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
    this.getTrees();
  },
};
</script>

<style scoped>
.block-summary {
  flex: 1;
  height: 35px;
  overflow: hidden;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.block-summary-description {
  flex: 1;
  font-size: 12px;
  text-align: left;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*规定段落中的文本不进行换行 */
}
.block-summary > .block_url {
  font-size: 12px;
  flex: 1;
  text-align: left;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*规定段落中的文本不进行换行 */
}
</style>
