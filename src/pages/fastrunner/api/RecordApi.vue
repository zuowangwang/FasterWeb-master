<template>
  <el-container>
    <el-header style="background: #fff; padding: 0; ">
      <div class="nav-api-header">
        <div style="padding-top: 10px; margin-left: 10px">
          <el-button
            :disabled="addAPIFlag"
            type="primary"
            size="small"
            icon="el-icon-circle-plus"
            @click="dialogVisible = true"
          >新建分组</el-button>

          <el-dialog title="新建分组" :visible.sync="dialogVisible" width="30%" align="center">
            <el-form
              :model="nodeForm"
              :rules="rules"
              ref="nodeForm"
              label-width="100px"
              class="project"
            >
              <el-form-item label="节点名称" prop="name">
                <el-input v-model="nodeForm.name"></el-input>
              </el-form-item>
            </el-form>

            <el-radio-group v-model="radio" size="small">
              <el-radio-button label="根节点"></el-radio-button>
              <el-radio-button label="子节点"></el-radio-button>
            </el-radio-group>

            <span slot="footer" class="dialog-footer">
              <el-button size="small" @click="dialogVisible = false">取 消</el-button>
              <el-button size="small" type="primary" @click="handleConfirm('nodeForm')">确 定</el-button>
            </span>
          </el-dialog>

          <el-button
            :disabled="currentNode === '' || addAPIFlag "
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteNode"
          >删除分组</el-button>

          <el-button
            :disabled="currentNode === '' || addAPIFlag "
            type="info"
            size="small"
            icon="el-icon-refresh-right"
            @click="renameNode"
            style="margin-left: 0px"
          >重命名</el-button>

          <el-button
            :disabled="currentNode === '' || addAPIFlag "
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="initResponse = true"
            style="margin-left: 0px"
          >添加接口</el-button>
          <upload-excel-component
            :currentNodes="currentNode"
            :addAPIFlags="addAPIFlag"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          />
          <el-button
            v-if="!addAPIFlag"
            style="margin-left: 20px"
            type="primary"
            icon="el-icon-caret-right"
            circle
            size="mini"
            @click="run = !run"
            title="批量运行"
          ></el-button>

          <el-button
            v-if="!addAPIFlag"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="del = !del"
            title="批量删除"
          ></el-button>&nbsp;环境:
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

          <el-button
            :disabled="!addAPIFlag"
            type="text"
            style="position: absolute; right: 30px;"
            @click="addAPIFlag=false"
          >返回列表</el-button>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside style="margin-top: 10px;" v-show="!addAPIFlag">
        <div class="nav-api-side">
          <div class="api-tree">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText"
              size="medium"
              clearable
              prefix-icon="el-icon-search"
            ></el-input>
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
          </div>
        </div>
      </el-aside>

      <el-main style="padding: 0;">
        <api-body
          v-show="addAPIFlag"
          :nodeId="currentNode.id"
          :project="$route.params.id"
          :response="response"
          v-on:addSuccess="handleAddSuccess"
          :config="currentConfig"
          :host="currentHost"
        ></api-body>

        <api-list
          v-show="!addAPIFlag"
          v-on:api="handleAPI"
          :node="currentNode !== '' ? currentNode.id : '' "
          :project="$route.params.id"
          :config="currentConfig"
          :host="currentHost"
          :del="del"
          ref="ApiList"
          :back="back"
          :run="run"
        ></api-list>
      </el-main>
      <el-dialog :title="testCaseTitle" width="80%" :visible.sync="tableHeaderVisible">
        <div class="table-content">
          <el-table :data="tableData" border highlight-current-row style="overfllow-y:scroll">
            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <div class="total" style="font-size:18px;">共计:{{tableData.length-1}}条</div>
          <el-button @click="tableHeaderVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadSuccess()">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
import ApiBody from "./components/ApiBody";
import ApiList from "./components/ApiList";
import store from "../../../store/state";
import UploadExcelComponent from "@/components/UploadExcel.vue";
export default {
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
  },
  components: {
    ApiBody,
    ApiList,
    UploadExcelComponent,
  },

  computed: {
    initResponse: {
      get() {
        return this.addAPIFlag;
      },
      set(value) {
        this.addAPIFlag = value;
        this.response = {
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
        };
      },
    },
  },
  data() {
    return {
      configOptions: [],
      hostOptions: [],
      currentConfig: "请选择",
      currentHost: "请选择",
      back: false,
      del: false,
      run: false,
      tableHeaderVisible: false,
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
      nodeForm: {
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入节点名称", trigger: "blur" },
          { min: 1, max: 50, message: "最多不超过50个字符", trigger: "blur" },
        ],
      },
      radio: "根节点",
      testCaseTitle:'',
      addAPIFlag: false,
      treeId: "",
      maxId: "",
      dialogVisible: false,
      currentNode: "",
      data: "",
      filterText: "",
      expand: "&#xe65f;",
      dataTree: [],
      uploadheader: {
        Authorization: `JWT ${store.token}`,
      },
      tableData: [],
      tableHeader: [],
    };
  },
 inject: ['reload'], //注入
 methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (isLt1M) {
        return true;
      }

      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning",
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.tableHeaderVisible = true;
      this.tableData = results;
      this.tableHeader = header;
    },
    chineseChar2englishChar(chineseChar) {
      // 将单引号‘’都转换成'，将双引号“”都转换成"
      var str = chineseChar.replace(/\’|\‘/g, "'").replace(/\“|\”/g, '"');
      // 将中括号【】转换成[]，将大括号｛｝转换成{}
      str = str
        .replace(/\【/g, "[")
        .replace(/\】/g, "]")
        .replace(/\｛/g, "{")
        .replace(/\｝/g, "}");
      // 将逗号，转换成,，将：转换成:
      str = str.replace(/，/g, ",").replace(/：/g, ":");
      return str;
    },
    uploadSuccess(response) {
      let keyArry = {};
      let dataObj = {};
      let params = {};
      params.nodeId = this.currentNode.id;
      params.project = this.$route.params.id;
      params.bulk_add = true;
      let keyList = this.tableData[0];
      let urlList = this.tableData;
      try {
        for (var b = 1; b <= urlList.length; b++) {
          let request = {};
          let hooks = {};
          var objs = Object.keys(urlList[b]).reduce((newData, key) => {
            let newKey = keyList[key] || key;
            if(newKey!='times'){
               urlList[b][key] = this.chineseChar2englishChar(urlList[b][key]);
            }
            if (
              newKey == "json" ||
              newKey == "form" ||
              newKey == "params" ||
              newKey == "files"
            ) {
              //  request[newKey]= JSON.parse(urlList[b][key])
              if (newKey == "json") {
                request["json"] = JSON.parse(urlList[b][key]);
              } else if (newKey == "form") {
                request["form"] = JSON.parse(urlList[b][key]);
              } else if (newKey == "params") {
                request["params"] = JSON.parse(urlList[b][key]);
              } else if (newKey == "files") {
                request["files"] = JSON.parse(urlList[b][key]);
              }
            } else {
              if (
                newKey == "header" ||
                newKey == "extract" ||
                newKey == "variables"
              ) {
                if (newKey == "header") {
                  newData["header"] = JSON.parse(urlList[b][key]);
                } else if (newKey == "extract") {
                  newData["extract"] = JSON.parse(urlList[b][key]);
                } else if (newKey == "variables") {
                  newData["variables"] = JSON.parse(urlList[b][key]);
                }
              } else if (newKey == "validate") {
                newData[newKey] = JSON.parse(urlList[b][key]);
              } else if (
                newKey == "setup_hooks" ||
                newKey == "teardown_hooks"
              ) {
                if (newKey == "setup_hooks") {
                  hooks["setup_hooks"] = eval("(" + urlList[b][key] + ")");
                } else if (newKey == "teardown_hooks") {
                  hooks["teardown_hooks"] = eval("(" + urlList[b][key] + ")");
                }
              } else {
                newData[newKey] = urlList[b][key];
              }
            }
            newData["hooks"] = hooks;
            newData["request"] = request;
            return newData;
          }, {});
          dataObj["temp" + b] = objs;
        }
      } catch (error) {
        //   this.$notify.error('文件格式错误,请重新上传')
      } finally {
        //上传数据集合
        params.interfaces = dataObj;
        this.$api.addAPI(params).then((res) => {
          if (res.success) {
            this.$notify.success("测试用例上传成功");
            this.tableHeaderVisible = false;
            this.$refs.ApiList.getAPIList()//列表刷新
            //  this.reload() //局部刷新
          }
        });
      }
    },
    handleDragEnd() {
      this.updateTree(false);
    },
    handleAddSuccess() {
      this.back = !this.back;
      this.addAPIFlag = false;
    },

    handleAPI(response) {
      this.addAPIFlag = true;
      this.response = response;
    },

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

    updateTree(mode) {
      this.$api
        .updateTree(this.treeId, {
          body: this.dataTree,
          node: this.currentNode.id,
          mode: mode,
          type: 1,
        })
        .then((resp) => {
          if (resp["success"]) {
            this.dataTree = resp["tree"];
            this.maxId = resp["max"];
            this.$notify.success("更新成功");
            //  this.reload() //局部刷新
          } else {
            this.$message.error(resp["msg"]);
          }
        });
    },

    deleteNode() {
      this.$confirm("此操作将永久删除该节点下所有接口, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.currentNode === "") {
          this.$notify.info("请选择一个节点");
        } else {
          if (this.currentNode.children.length !== 0) {
            this.$notify.error("此节点有子节点，不可删除！");
          } else {
            this.remove(this.currentNode, this.data);
            this.updateTree(true);
          }
        }
      });
    },

    renameNode() {
      this.$prompt("请输入节点名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "节点名称不能为空",
      }).then(({ value }) => {
        const parent = this.data.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex((d) => d.id === this.currentNode.id);
        children[index]["label"] = value;
        this.updateTree(false);
      });
    },

    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.append(this.currentNode);
          this.updateTree(false);
          this.dialogVisible = false;
        }
      });
    },

    handleNodeClick(node, data) {
      let title = data.parent.label? data.parent.label+'模块 '+node.label+'子模块 导入测试用例':node.label+'模块   导入测试用例'
      this.testCaseTitle = this.$store.state.headTitle+', '+title
      this.addAPIFlag = false;
      this.currentNode = node;
      this.data = data;
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    remove(data, node) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },

    append(data) {
      const newChild = {
        id: ++this.maxId,
        label: this.nodeForm.name,
        children: [],
      };
      if (
        data === "" ||
        this.dataTree.length === 0 ||
        this.radio === "根节点"
      ) {
        this.dataTree.push(newChild);
        return;
      }
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
  },
  name: "RecordApi",
  mounted() {
    this.getTree();
    this.getConfig();
    this.getHost();
  },
};
</script>

<style scoped>
.el-dialog__body {
  padding-bottom: 0 !important;
}
.table-content {
  width: 100%;
  height: 55vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
.dialog-footer>.total{
  line-height: 40.23px;
  width: 120px;
  margin-right: 20px;
  display: inline-block;
}
</style>
