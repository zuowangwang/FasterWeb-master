<template>
<<<<<<< HEAD
    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 20px">
                    <el-button
                        v-show="reportData.count !== 0"
                        style="margin-left: 10px"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        size="mini"
                        @click="delSelectionReports"
                        title="批量删除"
                    ></el-button>
                </div>
            </div>
        </el-header>
        <el-container>
            <el-header style="padding-top: 10px;margin-left: 10px;">
                <div>
                    <el-row>
                        <el-col :span="5" v-if="reportData.count > 11">
                            <el-input placeholder="请输入报告名称" clearable v-model="search" size="small">
                                <el-button slot="append" icon="el-icon-search" @click="getReportList" size="small" title="搜索"></el-button>
                            </el-input>
                        </el-col>

                        <el-col :span="7">
                            <el-pagination
                                :page-size="11"
                                v-show="reportData.count !== 0 "
                                background
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage"
                                layout="total, prev, pager, next, jumper"
                                :total="reportData.count"
                            >
                            </el-pagination>
                        </el-col>
                    </el-row>
                </div>
            </el-header>

            <el-container>
                <el-main style="padding: 0; margin-left: 10px;">
                    <div style="position: fixed; bottom: 0px; right:0; left: 178px; top: 150px;">
                        <el-table
                            v-loading="loading"
                            size="medium"
                            element-loading-text="正在玩命加载"
                            highlight-current-row
                            :data="reportData.results"
                            :show-header="reportData.results.length !== 0 "
                            stripe
                            height="600px"
                            @cell-mouse-enter="cellMouseEnter"
                            @cell-mouse-leave="cellMouseLeave"
                            @selection-change="handleSelectionChange"
                            show-overflow-tooltip
                        >
                            <el-table-column type="selection" width="50"></el-table-column>

                            <el-table-column label="类型" width="80" align="center">
                                <template slot-scope="scope">
                                    <el-tag color="#2C3E50" style="color: white" size="small">{{ scope.row.type }}</el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column label="报告名称">
                                <template slot-scope="scope">
                                    <div>{{scope.row.name}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column label="状态" width="60" align="center">
                                <template slot-scope="scope">
                                    <div
                                        :class="{'pass': scope.row.summary.success, 'fail':!scope.row.summary.success}"
                                        v-text="scope.row.summary.success === true ? 'Pass' :'Fail'"
                                    ></div>
                                </template>
                            </el-table-column>

                            <el-table-column label="测试时间" width="150" align="center">
                                <template slot-scope="scope">
                                    <div>{{scope.row.summary.time.start_at|timestampToTime}}</div>
                                </template>
                            </el-table-column>

                            <el-table-column label="用时" width="100" align="center">
                                <template slot-scope="scope">
                                    <div v-text="scope.row.summary.time.duration.toFixed(3)+' 秒'"></div>
                                </template>
                            </el-table-column>

                            <el-table-column width="60" label="总计" align="center">
                                <template slot-scope="scope">
                                    <el-tag size="small">{{ scope.row.summary.stat.testsRun }}</el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column width="60" label="通过" align="center">
                                <template slot-scope="scope">
                                    <el-tag type="success" size="small"> {{ scope.row.summary.stat.successes }}</el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column width="60" label="失败" align="center">
                                <template slot-scope="scope">
                                    <el-tag type="danger" size="small">{{ scope.row.summary.stat.failures }}</el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column width="60" label="异常" align="center">
                                <template slot-scope="scope">
                                    <el-tag type="warning" size="small">{{ scope.row.summary.stat.errors }}</el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column width="60" label="跳过" align="center">
                                <template slot-scope="scope">
                                    <el-tag type="info" size="small">{{ scope.row.summary.stat.skipped }}</el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column label="系统信息" width="135" align="center">
                                <template slot-scope="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>{{ scope.row.summary.platform.python_version}}</p>
                                        <p>Platform: {{ scope.row.summary.platform.platform }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium">HttpRunner: {{ scope.row.summary.platform.httprunner_version }}</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>

                            <el-table-column width="150" align="center">
                                <template slot-scope="scope">
                                    <el-row v-show="currentRow === scope.row">
                                        <el-button
                                            type="info"
                                            icon="el-icon-view"
                                            circle size="mini"
                                            @click="handleWatchReports(scope.row.id)"
                                            title="查看"
                                        >
                                        </el-button>
                                        <el-button
                                            type="success"
                                            icon="el-icon-download"
                                            circle size="mini"
                                            @click="handleDownExcelReport(scope.row.id,scope.row.name)"
                                            title="下载"
                                        >
                                        </el-button>
                                        <el-button
                                            type="danger"
                                            icon="el-icon-delete"
                                            circle size="mini"
                                            @click="handleDelReports(scope.row.id)"
                                            title="删除"
                                        >
                                        </el-button>
                                    </el-row>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </el-container>

</template>

<script>
    import store from '../../store/state'
    export default {
        data() {
            return {
                search: '',
                selectReports: [],
                currentRow: '',
                currentPage: 1,
                reportData: {
                    count: 0,
                    results: []
                },
                loading: true
            }
        },
        methods: {
            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },

            handleWatchReports(index) {
                var newwindow = window.open('');
                window.focus();
                this.$api.watchSingleReports(index, {params:{project:this.$route.params.id}}).then(resp => {
                    newwindow.focus();
                    newwindow.document.open();
                    newwindow.document.write(resp.data);
                    newwindow.document.close();
                })
            },

            handleSelectionChange(val) {
                this.selectReports = val;
            },

            handleCurrentChange(val) {
                this.$api.getReportsPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.$route.params.id,
                        search: this.search
                    }
                }).then(resp => {
                    this.reportData = resp;
                })
            },

            handleDelReports(index) {
                this.$confirm('此操作将永久删除该测试报告，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteReports(index,{params:{project:this.$route.params.id}}).then(resp => {
                        this.$notify.success('删除报告成功');
                        this.getReportList();
                    })
                })
            },

            delSelectionReports() {
                if (this.selectReports.length !== 0) {
                    this.$confirm('此操作将永久删除勾选的测试报告，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllReports(this.selectReports,{project:this.$route.params.id}).then(resp => {
                            this.$notify.success('批量删除报告成功');
                            this.getReportList();
                        })
                    })
                } else {
                    this.$notify.warning('请至少勾选一个测试报告');
                }
            },
            handleDownExcelReport(index,filename) {
                this.$api.downloadTestdata({
                    "fileType": 2,
                    "id": index,
                    "project": this.$route.params.id
                }).then(resp => {
                    let url = window.URL.createObjectURL(new Blob([resp.data]));
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.setAttribute('download', filename+'.xlsx');
                    document.body.appendChild(link);
                    link.click();
                }).catch(error => {
                    this.$notify.error('文件下载失败')
                })
            },
            getReportList() {
                this.$api.reportList({
                    params: {
                        project: this.$route.params.id,
                        search: this.search
                    }
                }).then(resp => {
                    this.reportData = resp;
                    this.loading = false;
                })
            },
        },
        name: "ReportList",
        mounted() {
            this.getReportList();
        }
    }
</script>

<style scoped>
    .pass {
        font-weight: bold;
        color: #13ce66;
        font-size: 12px;
    }
    .fail {
        font-weight: bold;
        color: red;
        font-size: 12px;
    }

=======
  <el-container>
    <el-header style="background: #fff; padding: 0; height: 50px">
      <div class="nav-api-header">
        <div style="padding-top: 10px; margin-left: 20px">
          <el-button
            v-show="reportData.count !== 0"
            style="margin-left: 10px"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="delSelectionReports"
            title="批量删除"
          ></el-button>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-header style="padding-top: 10px;margin-left: 10px;">
        <div>
          <el-row>
            <el-col :span="5">
              <el-input
                placeholder="请输入报告名称"
                clearable
                v-model="search"
                size="small"
                @clear="closeList()"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="getReportList"
                  size="small"
                  title="搜索"
                ></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
      </el-header>

      <el-container>
        <el-main style="padding: 0; margin-left: 10px;">
          <!-- <div style="position: fixed; bottom: 0px; right:0; left: 178px; top: 150px;"> -->
          <div>
            <el-table
              v-loading="loading"
              size="medium"
              element-loading-text="正在玩命加载"
              highlight-current-row
              :data="reportData.results"
              :show-header="reportData.results.length !== 0 "
              stripe
              @cell-mouse-enter="cellMouseEnter"
              @cell-mouse-leave="cellMouseLeave"
              @selection-change="handleSelectionChange"
              show-overflow-tooltip
            >
              <el-table-column type="selection" width="50"></el-table-column>

              <el-table-column label="类型" width="80" align="center">
                <template slot-scope="scope">
                  <el-tag color="#2C3E50" style="color: white" size="small">{{ scope.row.type }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column label="报告名称">
                <template slot-scope="scope">
                  <div>{{scope.row.name}}</div>
                </template>
              </el-table-column>

              <el-table-column label="状态" width="60" align="center">
                <template slot-scope="scope">
                  <div
                    :class="{'pass': scope.row.summary.success, 'fail':!scope.row.summary.success}"
                    v-text="scope.row.summary.success === true ? 'Pass' :'Fail'"
                  ></div>
                </template>
              </el-table-column>

              <el-table-column label="测试时间" width="200" align="center">
                <template slot-scope="scope">
                  <div>{{scope.row.summary.time.start_at|timestampToTime}}</div>
                </template>
              </el-table-column>

              <el-table-column label="用时" width="100" align="center">
                <template slot-scope="scope">
                  <div v-text="scope.row.summary.time.duration.toFixed(3)+' 秒'"></div>
                </template>
              </el-table-column>

              <el-table-column width="60" label="总计" align="center">
                <template slot-scope="scope">
                  <el-tag size="small">{{ scope.row.summary.stat.testsRun }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column width="60" label="通过" align="center">
                <template slot-scope="scope">
                  <el-tag type="success" size="small">{{ scope.row.summary.stat.successes }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column width="60" label="失败" align="center">
                <template slot-scope="scope">
                  <el-tag type="danger" size="small">{{ scope.row.summary.stat.failures }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column width="60" label="异常" align="center">
                <template slot-scope="scope">
                  <el-tag type="warning" size="small">{{ scope.row.summary.stat.errors }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column width="60" label="跳过" align="center">
                <template slot-scope="scope">
                  <el-tag type="info" size="small">{{ scope.row.summary.stat.skipped }}</el-tag>
                </template>
              </el-table-column>

              <el-table-column label="系统信息" width="200" align="center">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>{{ scope.row.summary.platform.python_version}}</p>
                    <p>Platform: {{ scope.row.summary.platform.platform }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag
                        size="medium"
                      >HttpRunner: {{ scope.row.summary.platform.httprunner_version }}</el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column width="150" align="center">
                <template slot-scope="scope">
                  <el-row v-show="currentRow === scope.row">
                    <el-button
                      type="info"
                      icon="el-icon-view"
                      circle
                      size="mini"
                      @click="handleWatchReports(scope.row.id)"
                      title="查看"
                    ></el-button>
                    <el-button
                      type="success"
                      icon="el-icon-download"
                      circle
                      size="mini"
                      @click="handleDownExcelReport(scope.row.id,scope.row.name)"
                      title="下载"
                    ></el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                      @click="handleDelReports(scope.row.id)"
                      title="删除"
                    ></el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
            <div style="float:right;margin-top:20px;margin-right:40px">
              <el-pagination
                :page-size="11"
                v-show="reportData.count !== 0 "
                background
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                layout="total, prev, pager, next, jumper"
                :total="reportData.count"
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
  data() {
    return {
      search: "",
      selectReports: [],
      currentRow: "",
      currentPage: 1,
      reportData: {
        count: 0,
        results: [],
      },
      loading: true,
    };
  },
  methods: {
    cellMouseEnter(row) {
      this.currentRow = row;
    },

    cellMouseLeave(row) {
      this.currentRow = "";
    },

    handleWatchReports(index) {
      var newwindow = window.open("");
      window.focus();
      this.$api
        .watchSingleReports(index, {
          params: { project: this.$route.params.id },
        })
        .then((resp) => {
          newwindow.focus();
          newwindow.document.open();
          newwindow.document.write(resp.data);
          newwindow.document.close();
        });
    },

    handleSelectionChange(val) {
      this.selectReports = val;
    },

    handleCurrentChange(val) {
      this.$api
        .getReportsPaginationBypage({
          params: {
            page: this.currentPage,
            project: this.$route.params.id,
            search: this.search,
          },
        })
        .then((resp) => {
          this.reportData = resp;
        });
    },

    handleDelReports(index) {
      this.$confirm("此操作将永久删除该测试报告，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api
          .deleteReports(index, { params: { project: this.$route.params.id } })
          .then((resp) => {
            this.$notify.success("删除报告成功");
            this.getReportList();
          });
      });
    },

    delSelectionReports() {
      if (this.selectReports.length !== 0) {
        this.$confirm("此操作将永久删除勾选的测试报告，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$api
            .delAllReports(this.selectReports, {
              project: this.$route.params.id,
            })
            .then((resp) => {
              this.$notify.success("批量删除报告成功");
              this.getReportList();
            });
        });
      } else {
        this.$notify.warning("请至少勾选一个测试报告");
      }
    },
    handleDownExcelReport(index, filename) {
      this.$api
        .downloadTestdata({
          fileType: 2,
          id: index,
          project: this.$route.params.id,
        })
        .then((resp) => {
          let url = window.URL.createObjectURL(new Blob([resp.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", filename + ".xlsx");
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          this.$notify.error("文件下载失败");
        });
    },
    getReportList() {
      this.$api
        .reportList({
          params: {
            project: this.$route.params.id,
            search: this.search,
          },
        })
        .then((resp) => {
          this.reportData = resp;
          this.loading = false;
        });
    },

    closeList() {
      this.search = "";
      this.$api
        .reportList({
          params: {
            project: this.$route.params.id,
            search: this.search,
          },
        })
        .then((resp) => {
          this.reportData = resp;
          this.loading = false;
        });
    },
  },
  name: "ReportList",
  mounted() {
    this.getReportList();
  },
};
</script>

<style scoped>
.pass {
  font-weight: bold;
  color: #13ce66;
  font-size: 12px;
}
.fail {
  font-weight: bold;
  color: red;
  font-size: 12px;
}
>>>>>>> temp
</style>
