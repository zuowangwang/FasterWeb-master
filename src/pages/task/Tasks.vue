<template>
  <el-container>
    <el-header style="background: #fff; padding: 0; height: 50px">
      <div class="nav-api-header">
        <div style="padding-top: 10px; margin-left: 20px">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="handleAddTask"
            :disabled="addTasks"
          >添加任务</el-button>
          <el-button
            style="margin-left: 20px"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="delselectTasks"
            title="批量删除"
            :disabled="addTasks"
          ></el-button>
          <el-button
            :disabled="!addTasks"
            type="text"
            style="position: absolute; right: 30px;"
            @click="addTasks=false"
          >返回列表</el-button>
        </div>
      </div>
    </el-header>

    <el-container>
      <el-main v-if="!addTasks" style="padding: 0; margin-left: 10px; margin-top: 10px;">
        <div>
          <el-table
            style="width: 100%; overflow: auto;"
            v-loading="loading"
            element-loading-text="正在玩命加载"
            v-if="!addTasks"
            :data="tasksData.results"
            :show-header="tasksData.results.length !== 0 "
            stripe
            highlight-current-row
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column label="任务名称" width="240">
              <template slot-scope="scope">
                <div>{{scope.row.name}}</div>
              </template>
            </el-table-column>

            <el-table-column width="120" label="时间配置">
              <template slot-scope="scope">
                <div>{{scope.row.summary_kwargs.crontab}}</div>
              </template>
            </el-table-column>

            <el-table-column width="100" label="邮件策略">
              <template slot-scope="scope">
                <div>{{scope.row.summary_kwargs.strategy}}</div>
              </template>
            </el-table-column>

            <el-table-column width="80" label="状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  active-color="#13ce66"
                  @change="validatechange(scope.row)"
                  inactive-color="#ff4949"
                ></el-switch>
              </template>
            </el-table-column>

            <el-table-column label="接收人" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.summary_kwargs.receiver}}</div>
              </template>
            </el-table-column>
            <el-table-column label="抄送人" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.summary_kwargs.mail_cc}}</div>
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
                    title="编辑"
                    @click="handleEditSchedule(scope.row.id, scope.row)"
                  ></el-button>
                  <el-button
                    type="primary"
                    icon="el-icon-caret-right"
                    circle
                    size="mini"
                    title="运行"
                    @click="handleRunSchedule(scope.row.id)"
                  ></el-button>
                  <el-button
                    type="success"
                    icon="el-icon-document"
                    circle
                    size="mini"
                    @click="handleCopySchedule(scope.row.id)"
                    title="复制"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    size="mini"
                    @click="delTasks(scope.row.id)"
                    title="删除"
                  ></el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-header v-if="!addTasks" style="padding: 0; height: 50px; margin-top: 10px">
          <div style="float:right;margin-top:20px;margin-right:40px;">
            <el-pagination
              :page-size="11"
              v-show="tasksData.count !== 0 "
              background
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              layout="total, prev, pager, next, jumper"
              :total="tasksData.count"
            ></el-pagination>
          </div>
        </el-header>
      </el-main>
      <add-tasks
        v-if="addTasks"
        v-on:changeStatus="changeStatus"
        :ruleForm="ruleForm"
        :args="args"
        :scheduleId="scheduleId"
      ></add-tasks>
    </el-container>
  </el-container>
</template>

<script>
import AddTasks from "./AddTasks";
export default {
  components: {
    AddTasks,
  },
  data() {
    return {
      addTasks: false,
      currentPage: 1,
      currentRow: "",
      tasksData: {
        count: 0,
        results: [],
      },
      loading: true,
      ruleForm: {
        switch: true,
        crontab: "",
        strategy: "始终发送",
        receiver: "",
        mail_cc: "",
        name: "",
        sensitive_keys: "",
        self_error: "",
        fail_count: 1,
      },
      args: [],
      scheduleId: "",
      selectTasks: [],
    };
  },
  methods: {
    handleAddTask() {
      this.addTasks = true;
      this.scheduleId = "";
      this.ruleForm = {
        switch: true,
        crontab: "",
        strategy: "始终发送",
        receiver: "",
        mail_cc: "",
        name: "",
        sensitive_keys: "",
        self_error: "",
        fail_count: 1,
      };
      this.args = [];
    },
    handleSelectionChange(val) {
      this.selectTasks = val;
    },
    handleCopySchedule(id) {
      this.$prompt("请输入定时任务名称", "提示", {
        confirmButtonText: "确定",
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: "定时任务名称不能为空",
      }).then(({ value }) => {
        this.$api
          .copySchedule(
            { project: this.$route.params.id },
            {
              name: value,
              id: id,
            }
          )
          .then((resp) => {
            if (resp.status === 201) {
              this.$notify.success("复制定时任务成功");
              this.getTaskList();
            }
          });
      });
    },
    delTasks(id) {
      this.$confirm("此操作将永久删除该定时任务，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api
          .deleteTasks(id, { params: { project: this.$route.params.id } })
          .then((resp) => {
            if (resp.status === 204) {
              this.$notify.success("删除定时任务成功");
              this.getTaskList();
            }
          });
      });
    },
    delselectTasks() {
      if (this.selectTasks.length !== 0) {
        this.$confirm("此操作将永久删除选中定时任务，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$api
            .deleteSelectTasks(
              { project: this.$route.params.id },
              this.selectTasks
            )
            .then((resp) => {
              if (resp.status === 204) {
                this.$notify.success("批量删除定时任务成功");
                this.getTaskList();
              }
            });
        });
      } else {
        this.$notify.error("没有勾选定时任务");
      }
    },
    handleRunSchedule(id) {
      this.$confirm("此操作将运行此定时任务并发送邮件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        this.$api.runScheduleTest(id).then((resp) => {
          this.$notify.success("执行成功，请稍后查看报告以及邮件");
          this.loading = false;
        });
      });
    },
    handleCurrentChange(val) {
      this.$api
        .getTaskPaginationBypage({
          params: {
            page: this.currentPage,
            project: this.$route.params.id,
          },
        })
        .then((resp) => {
          this.tasksData = resp;
        });
    },
    handleEditSchedule(id, index_data) {
      this.addTasks = true;
      this.scheduleId = id;
      this.ruleForm["crontab"] = index_data.summary_kwargs.crontab;
      this.ruleForm["strategy"] = index_data.summary_kwargs.strategy;
      this.ruleForm["receiver"] = index_data.summary_kwargs.receiver;
      this.ruleForm["mail_cc"] = index_data.summary_kwargs.mail_cc;
      this.ruleForm["fail_count"] = index_data.summary_kwargs.fail_count;
      this.ruleForm["self_error"] = index_data.summary_kwargs.self_error;
      this.ruleForm["sensitive_keys"] =
        index_data.summary_kwargs.sensitive_keys;
      this.ruleForm["name"] = index_data.name;
      this.ruleForm["switch"] = index_data.enabled;
      this.args = index_data.summary_args;
    },
    validatechange(val) {
      var form = val.summary_kwargs;
      form["switch"] = val.enabled;
      form["name"] = val.name;
      form["data"] = val.summary_args[0];
      this.scheduleId = val.id;
      this.$api
        .updateTask(this.scheduleId, { project: this.$route.params.id }, form)
        .then((resp) => {
          if (resp.status === 200) {
            this.$notify.success("更新定时任务成功");
            this.$emit("changeStatus", false);
          }
        });
    },
    changeStatus(value) {
      this.getTaskList();
      this.addTasks = value;
      this.args = [];
      this.ruleForm = {
        switch: true,
        crontab: "",
        strategy: "始终发送",
        receiver: "",
        mail_cc: "",
        name: "",
        self_error: "",
        fail_count: "",
        sensitive_keys: "",
      };
    },
    getTaskList() {
      this.$api
        .taskList({ params: { project: this.$route.params.id } })
        .then((resp) => {
          this.tasksData = resp;
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
  name: "Tasks",
  mounted() {
    this.getTaskList();
  },
};
</script>

<style>
</style>
