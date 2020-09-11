<template>
  <el-container>
    <el-header style="background: #fff; padding: 0; ">
      <div class="nav-api-header">
        <div style="padding-top: 10px; margin-left: 10px">
          &nbsp;环境:
          <el-select placeholder="请选择" size="small" v-model="currentHost" style="width: 120px">
            <el-option
              v-for="item in hostOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>&nbsp;配置:
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="currentConfig">
            <el-option
              v-for="item in configOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
      </div>
    </el-header>
    <div style="margin-left: 10px">
      <div>
        <div>
          <el-input style="width: 60%" placeholder="请输入接口名称" v-model="name" clearable>
            <template slot="prepend">接口信息录入</template>
          </el-input>
          <el-button slot="append" type="primary" @click="handleSave">Save</el-button>
          <el-button
            style="margin-left: 0px"
            type="success"
            @click="reverseStatus"
            v-loading="loading"
            :disabled="loading"
          >Send</el-button>
        </div>

        <div>
          <el-input
            style="width: 60%; margin-top: 10px"
            placeholder="请输入接口请求地址"
            v-model="url"
            clearable
          >
            <el-select style="width: 125px" slot="prepend" v-model="method">
              <el-option
                v-for="item of httpOptions"
                :label="item.label"
                :value="item.label"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-input>

          <el-tooltip effect="dark" content="循环次数" placement="bottom">
            <el-input-number
              v-model="times"
              controls-position="right"
              :min="1"
              :max="20"
              style="width: 12%"
              :precision="0"
            ></el-input-number>
          </el-tooltip>
        </div>
      </div>
      <div class="tabList">
        <el-dialog
          title
          :visible.sync="dialogVisible"
          width="width"
          :before-close="dialogBeforeClose"
        >
          <el-tree
            @node-click="handleNodeClick"
            :data="dataTree"
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
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="openHandleClik()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="request">
        <el-dialog
          v-if="dialogTableVisible"
          :visible.sync="dialogTableVisible"
          :before-close="handleClose"
          width="70%"
        >
          <report :summary="summary"></report>
        </el-dialog>

        <el-tabs style="margin-left: 20px;" v-model="activeTag">
          <el-tab-pane label="Header" name="first">
            <headers
              :save="save"
              v-on:header="handleHeader"
              :header="response ? response.body.header: [] "
            ></headers>
          </el-tab-pane>

          <el-tab-pane label="Request" name="second">
            <request
              :save="save"
              v-on:request="handleRequest"
              :request="response ? response.body.request: []"
            ></request>
          </el-tab-pane>

          <el-tab-pane label="Extract" name="third">
            <extract
              :save="save"
              v-on:extract="handleExtract"
              :extract="response ? response.body.extract : []"
            ></extract>
          </el-tab-pane>

          <el-tab-pane label="Validate" name="fourth">
            <validate
              :save="save"
              v-on:validate="handleValidate"
              :validate="response ? response.body.validate: []"
            ></validate>
          </el-tab-pane>

          <el-tab-pane label="Variables" name="five">
            <variables
              :save="save"
              v-on:variables="handleVariables"
              :variables="response ? response.body.variables : []"
            ></variables>
          </el-tab-pane>

          <el-tab-pane label="Hooks" name="six">
            <hooks
              :save="save"
              v-on:hooks="handleHooks"
              :hooks="response ? response.body.hooks: []"
            ></hooks>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-container>
</template>

<script>
import Headers from "../../../httprunner/components/Headers";
import Request from "../../../httprunner/components/Request";
import Extract from "../../../httprunner/components/Extract";
import Validate from "../../../httprunner/components/Validate";
import Variables from "../../../httprunner/components/Variables";
import Hooks from "../../../httprunner/components/Hooks";
import Report from "../../../reports/DebugReport";

export default {
  components: {
    Headers,
    Request,
    Extract,
    Validate,
    Variables,
    Hooks,
    Report,
  },
  //   props: {
  //     host: {
  //       require: false,
  //     },
  //     nodeId: {
  //       require: false,
  //     },
  //     project: {
  //       require: false,
  //     },
  //   },
  mounted() {
    this.getTree();
    this.getConfig();
    this.getHost();
  },
  methods: {
    getTree() {
      this.$api
        .getTree(this.$route.params.id, { params: { type: 1 } })
        .then((resp) => {
          this.dataTree = resp["tree"];
          this.treeId = resp["id"];
          this.maxId = resp["max"];
        });
    },
    getConfig() {
      this.$api.getAllConfig(this.$route.params.id).then((resp) => {
        this.configOptions = resp;
        this.configOptions.push({
          name: "请选择",
        });
      });
    },

    handleDragEnd() {
      this.updateTree(false);
    },
    updateTree(mode) {
      this.$api
        .updateTree(this.treeId, {
          ody: this.dataTree,
          node: this.currentNode.id,
          mode: mode,
          type: 1,
        })
        .then((resp) => {
          if (resp["success"]) {
            this.dataTree = resp["tree"];
            this.maxId = resp["max"];
            this.$notify.success("更新成功");
          } else {
            this.$message.error(resp["msg"]);
          }
        });
    },
    dialogBeforeClose() {
      this.dialogVisible = false;
    },
    getHost() {
      this.$api
        .hostList({ params: { project: this.$route.params.id } })
        .then((resp) => {
          this.hostOptions = resp.data["results"];
          this.hostOptions.push({
            name: "请选择",
          });
        });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    reverseStatus() {
      this.save = !this.save;
      this.run = true;
    },
    handleSave() {
      this.dialogVisible = true;
    },
    openHandleClik() {
      this.save = !this.save;
      this.run = false;
      this.dialogVisible = false;
    },
    handleHeader(header) {
      this.header = header;
    },
    handleRequest(request) {
      this.request = request;
    },
    handleValidate(validate) {
      this.validate = validate;
    },
    handleExtract(extract) {
      this.extract = extract;
    },
    handleVariables(variables) {
      this.variables = variables;
    },
    handleHooks(hooks) {
      this.hooks = hooks;

      if (!this.run) {
        if (this.id === "") {
          this.addAPI();
        } else {
          this.updateAPI();
        }
      } else {
        this.runAPI();
        this.run = false;
      }
    },

    handleNodeClick(node, data) {
      this.addAPIFlag = false;
      this.currentNode = node;
      this.nodeId = node.id;
      this.data = data;
    },
    validateData() {
      if (this.url === "") {
        this.$notify.error("接口请求地址不能为空");
        return false;
      }

      if (this.name === "") {
        this.$notify.error("接口名称不能为空");
        return false;
      }
      return true;
    },
    updateAPI() {
      if (this.validateData()) {
        this.$api
          .updateAPI(this.id, {
            header: this.header,
            request: this.request,
            extract: this.extract,
            validate: this.validate,
            variables: this.variables,
            hooks: this.hooks,
            url: this.url,
            method: this.method,
            name: this.name,
            times: this.times,
          })
          .then((resp) => {
            if (resp.success) {
              this.$notify.success(resp.msg);
              this.$emit("addSuccess");
            } else {
              this.$notify.error(resp.msg);
            }
          });
      }
    },

    runAPI() {
      if (this.validateData()) {
        this.loading = true;
        this.$api
          .runSingleAPI({
            header: this.header,
            request: this.request,
            extract: this.extract,
            validate: this.validate,
            variables: this.variables,
            hooks: this.hooks,
            url: this.url,
            method: this.method,
            name: this.name,
            times: this.times,
            project: this.$route.params.id,
            config: this.currentConfig,
            host: this.currentHost,
          })
          .then((resp) => {
            this.summary = resp;
            this.dialogTableVisible = true;
            this.loading = false;
          })
          .catch((resp) => {
            this.loading = false;
          });
      }
    },

    addAPI() {
      if (this.validateData()) {
        this.$api
          .addAPI({
            header: this.header,
            request: this.request,
            extract: this.extract,
            validate: this.validate,
            variables: this.variables,
            hooks: this.hooks,
            url: this.url,
            method: this.method,
            name: this.name,
            times: this.times,
            nodeId: this.nodeId,
            project: this.$route.params.id,
          })
          .then((resp) => {
            if (resp.success) {
              this.$notify.success(resp.msg);
              this.$emit("addSuccess");
            } else {
              this.$notify.error(resp.msg);
            }
          });
      }
    },
    clickClose(){
      this.dialogVisible=false
    }
  },
  data() {
    return {
      configOptions: [],
      hostOptions: [],
      currentConfig: "请选择",
      currentHost: "请选择",
      loading: false,
      times: 1,
      name: "",
      url: "",
      id: "",
      response: {
        id: "",
        body: {
          name: "",
          times: 1,
          url: "",
          method: "POST",
          header: [
            {
              key: "",
              value: "",
              desc: "",
            },
          ],
          request: {
            data: [
              {
                key: "",
                value: "",
                desc: "",
                type: 1,
              },
            ],
            params: [
              {
                key: "",
                value: "",
                desc: "",
                type: 1,
              },
            ],
            json_data: "",
          },
          validate: [
            {
              expect: "",
              actual: "",
              comparator: "equals",
              type: 1,
            },
          ],
          variables: [
            {
              key: "",
              value: "",
              desc: "",
              type: 1,
            },
          ],
          extract: [
            {
              key: "",
              value: "",
              desc: "",
            },
          ],
          hooks: [
            {
              setup: "",
              teardown: "",
            },
          ],
        },
      },
      header: [],
      request: {},
      extract: [],
      validate: [],
      variables: [],
      hooks: [],
      method: "GET",
      dialogVisible: false,
      save: false,
      run: false,
      summary: {},
      activeTag: "second",
      dataTree: [],
      dialogFormVisible: false,
      dialogTableVisible: false,
      treeId: "",
      maxId: "",
      radio1: 1,
      httpOptions: [
        {
          label: "GET",
        },
        {
          label: "POST",
        },
        {
          label: "PUT",
        },
        {
          label: "DELETE",
        },
        {
          label: "HEAD",
        },
        {
          label: "OPTIONS",
        },
        {
          label: "PATCH",
        },
      ],
    };
  },
  name: "ApiAdd",
};
</script>
<style scoped>
.request {
  margin-top: 15px;
  border: 1px solid #ddd;
}
</style>
