<template>
  <el-container>
    <el-header style="background: #fff; padding: 0; height: 50px">
      <div class="nav-api-header">
        <div style="padding-top: 10px; margin-left: 10px">
          <el-button
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

          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteNode">删除分组</el-button>

          <el-button
            :disabled="currentNode === '' "
            type="info"
            size="small"
            icon="el-icon-refresh-right"
            style="margin-left: 0px"
            @click="renameNode"
          >重命名</el-button>

          <el-upload
            class="upload-demo"
            :action="fileupload"
            :show-file-list="false"
            accept=".xlsx, .xls, .jpg, .png"
            multiple
            :limit="1"
            :headers="uploadheader"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :before-upload="UploadBefore"
            :data="filedata"
            style="display: inline"
          >
            <el-button
              size="small"
              type="primary"
              icon="el-icon-upload"
              title="只能上传jpg/png/xlsx/xls文件"
              @click="handleClickUpload"
            >点击上传</el-button>
          </el-upload>
          <div style="display: inline">
            <el-button
              v-show="testData.count !== 0 "
              style="margin-left: 20px"
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="delSelectiontestdata"
              title="批量删除"
            ></el-button>
          </div>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-container>
        <el-aside style="margin-top: 10px;">
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
                ref="tree3"
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
        <el-main style="padding: 0; margin-left: 10px; margin-top: 10px;">
          <!-- <el-header style="margin-left: -10px; margin-top: 8px; height: 50px;"> -->
          <div style="overflow: hidden">
            <el-row :gutter="50">
              <el-col :span="6">
                <el-input
                  placeholder="请输入文件名称"
                  v-if="testData.count > 11"
                  clearable
                  v-model="search"
                >
                  <el-button slot="append" icon="el-icon-search" @click="getTestdataList"></el-button>
                </el-input>
              </el-col>
              <el-col :span="7">
                <!-- <el-pagination
                                        :page-size="11"
                                        v-show="testData.count !== 0 "
                                        background
                                        @current-change="handleCurrentChange"
                                        :current-page.sync="currentPage"
                                        layout="total, prev, pager, next, jumper"
                                        :total="testData.count"
                                    >
                </el-pagination>-->
              </el-col>
            </el-row>
          </div>
          <!-- </el-header>  -->
          <div>
            <el-table
              v-loading="loading"
              element-loading-text="正在玩命加载"
              highlight-current-row
              :data="testData.results"
              :show-header="testData.results.length !== 0 "
              stripe
              height="600px"
              @cell-mouse-enter="cellMouseEnter"
              @cell-mouse-leave="cellMouseLeave"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>

              <el-table-column label="文件名">
                <template slot-scope="scope">
                  <div>{{scope.row.name}}</div>
                </template>
              </el-table-column>
              <el-table-column label="更新时间">
                <template slot-scope="scope">
                  <div>{{scope.row.update_time | datetimeFormat}}</div>
                </template>
              </el-table-column>
              <el-table-column label="上传时间">
                <template slot-scope="scope">
                  <div>{{scope.row.create_time | datetimeFormat}}</div>
                </template>
              </el-table-column>

              <el-table-column>
                <template slot-scope="scope">
                  <el-row v-show="currentRow === scope.row">
                    <el-button
                      v-show="testData.count !== 0"
                      type="success"
                      icon="el-icon-download"
                      circle
                      size="mini"
                      @click="handleDownTestdata(scope.row.id,scope.row.name)"
                      title="下载"
                    ></el-button>
                    <el-button
                      v-show="testData.count !== 0"
                      type="warning"
                      icon="el-icon-lock"
                      circle
                      size="mini"
                      @click="handleLockTestdata(scope.row.id)"
                      title="锁定"
                    ></el-button>
                    <el-button
                      v-show="testData.count !== 0"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                      @click="handleDelTestdata(scope.row.id)"
                      title="删除"
                    ></el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>

            <div style="float:right;margin-top:20px;margin-right:40px;">
              <el-pagination
                :page-size="11"
                v-show="testData.count !== 0 "
                background
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                layout="total, prev, pager, next, jumper"
                :total="testData.count"
              ></el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import store from "../../store/state";
export default {
  name: "TestData",
  mounted() {
    this.$nextTick(function () {
      this.getTestdataList();
      this.getTree();
    });
  },
  data() {
    return {
      fileupload: this.$api.uploadFile(),
      fileList: [],
      filedata: {
        project: this.$route.params.id,
        name: "",
        relation: 1,
      },
      testData: {
        count: 0,
        results: [],
      },
      uploadheader: {
        Authorization: `JWT ${store.token}`,
      },
      selectTestData: [],
      search: "",
      currentRow: "",
      currentPage: 1,
      loading: true,
      dialogVisible: false,
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
      filterText: "",
      dataTree: [],
      currentNode: "",
      treeId: "",
      maxId: "",
      expand: "&#xe65f;",
    };
  },
  methods: {
    handleLockTestdata(id) {
      this.$confirm(
        "此操作将锁定此文件,之后无法更新或者删除，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.$api
          .lockFile(
            {
              project: this.$route.params.id,
            },
            {
              project: this.$route.params.id,
              lock_type: 1,
              file_id: id,
            }
          )
          .then((resp) => {
            if (resp.status === 201) {
              this.$notify.success("文件锁定成功");
            }
            if (resp.status === 204) {
              this.$notify.success("文件解锁成功");
            }
          });
      });
    },
    handleDragEnd() {
      this.updateTree(false);
    },
    getTree() {
      this.$api
        .getTree(this.$route.params.id, { params: { type: 3 } })
        .then((resp) => {
          this.dataTree = resp["tree"];
          this.treeId = resp["id"];
          this.maxId = resp["max"];
        });
    },
    updateTree(mode) {
      this.$api
        .updateTree(this.treeId, {
          mode: mode,
          body: this.dataTree,
          node: this.currentNode.id,
          type: 3,
        })
        .then((resp) => {
          if (resp["success"]) {
            this.dataTree = resp["tree"];
            this.maxId = resp["max"];
            this.$notify.success("更新成功");
          } else {
            this.$notify.error(resp["msg"]);
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

    deleteNode() {
      this.$confirm("此操作将永久删除该节点下所有测试文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.currentNode === "") {
          this.$notify.info("请选择一个节点");
        } else {
          if (this.currentNode.children.length !== 0) {
            this.$notify.warning("此节点有子节点，不可删除！");
          } else {
            this.remove(this.currentNode, this.data);
            this.updateTree(true);
          }
        }
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
    cellMouseEnter(row) {
      this.currentRow = row;
    },

    cellMouseLeave(row) {
      this.currentRow = "";
    },

    handleExceed(files, fileList) {
      this.$notify.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },

    /**
     * @return {boolean}
     */
    UploadBefore(file) {
      if (this.currentNode === "") {
        this.$notify.error("请在左侧选择一个上传节点");
        return false;
      } else {
        this.filedata.name = file.name;
        this.filedata.relation = this.currentNode.id;
      }
    },
    handleClickUpload() {},
    uploadSuccess(response) {
      this.fileList = [];
      this.$notify.success("文件上传成功");
      this.getTestdataList();
    },

    uploadError(error) {
      if (error.status === 401) {
        this.$notify.error("请先登录");
        this.$router.replace({
          name: "Login",
        });
      } else if (error.status === 403) {
        this.$notify.error({
          title: "detail",
          message: "您没有执行该操作的权限。",
        });
      } else if (error.status === 406) {
        this.$notify.error({
          title: "detail",
          message: "该文件被已被锁定，无法更新或删除。",
        });
      } else {
        this.$notify.error("文件上传失败");
      }
    },

    delSelectiontestdata() {
      if (this.selectTestData.length !== 0) {
        this.$confirm("此操作将永久删除勾选的文件，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$api
            .delAllTestdata(
              { project: this.$route.params.id },
              this.selectTestData
            )
            .then((resp) => {
              this.$notify.success("批量删除文件完成");
              this.getTestdataList();
            });
        });
      } else {
        this.$notify.warning("请至少勾选一个文件");
      }
    },
    handleSelectionChange(val) {
      this.selectTestData = val;
    },
    handleCurrentChange(val) {
      this.$api
        .getTestdataListPaginationBypage({
          params: {
            page: this.currentPage,
            project: this.filedata.project,
            search: this.search,
          },
        })
        .then((resp) => {
          this.testData = resp;
        });
    },
    handleDownTestdata(index, filename) {
      this.$api
        .downloadTestdata({
          fileType: 1,
          id: index,
          project: this.$route.params.id,
        })
        .then((resp) => {
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
    handleDelTestdata(index) {
      this.$confirm("此操作将永久删除该测试文件，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api
          .deleteTestdata(index, { params: { project: this.$route.params.id } })
          .then((resp) => {
            this.$notify.success("文件删除成功");
            this.getTestdataList();
          });
      });
    },
    getTestdataList() {
      this.$api
        .testdataList({
          params: {
            project: this.filedata.project,
            search: this.search,
            node: this.currentNode === "" ? "" : this.currentNode.id,
          },
        })
        .then((resp) => {
          this.testData = resp;
          this.loading = false;
        });
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree3.filter(val);
    },
    currentNode() {
      this.getTestdataList();
    },
  },
};
</script>

<style scoped>
</style>
