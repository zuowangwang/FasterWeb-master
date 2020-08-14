<template>
    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header"></div>
        </el-header>
        <el-container>
            <el-header style="padding-top: 10px;margin-left: 10px;">
                <div>
                    <el-row>
                        <el-col :span="7">
                            <el-pagination
                                :page-size="11"
                                v-show="TaskMetaData.count !== 0 "
                                background
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage"
                                layout="total, prev, pager, next, jumper"
                                :total="TaskMetaData.count"
                            >
                            </el-pagination>
                        </el-col>
                    </el-row>
                </div>
            </el-header>
            <el-main style="padding: 0; margin-left: 10px;">
                <div style="position: fixed; bottom: 0px; right:0; left: 178px; top: 150px;">
                    <el-table
                        v-loading="loading"
                        size="medium"
                        element-loading-text="正在玩命加载"
                        highlight-current-row
                        :data="TaskMetaData.results"
                        :show-header="TaskMetaData.results.length !== 0 "
                        stripe
                        height="600px"
                        @cell-mouse-enter="cellMouseEnter"
                        @cell-mouse-leave="cellMouseLeave"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection" width="50"></el-table-column>

                        <el-table-column label="状态" width="150">
                            <template slot-scope="scope">
                                <div
                                    :class="{'pass': scope.row.status === 'SUCCESS', 'fail':scope.row.status === 'FAILURE'}"
                                    v-text="scope.row.status === 'SUCCESS' ? 'SUCCESS' :'FAILURE'"
                                ></div>
                            </template>
                        </el-table-column>

                        <el-table-column label="traceback">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" placement="right" width="600">
                                    <pre class="code-block">{{scope.row.traceback}}</pre>
                                    <el-button v-if="scope.row.traceback" slot="reference" round type="text" class="popoverFont">TraceBack</el-button>
                                </el-popover>
                            </template>
                        </el-table-column>

                        <el-table-column label="结束时间" width="300">
                            <template slot-scope="scope">
                                <div>{{scope.row.date_done}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "TaskMeta",
        methods:{
            cellMouseEnter(row) {
                this.currentRow = row;
            },
            cellMouseLeave(row) {
                this.currentRow = '';
            },
            handleSelectionChange(val) {
                this.selectTaskMeta = val;
            },
            handleCurrentChange() {
                this.getTaskMetaData();
            },
            getTaskMetaData(){
                this.$api.getTaskMetaDataList({
                    params: {
                        page: this.currentPage,
                        project: this.$route.params.id,
                        search: this.search
                    }
                }).then(resp => {
                    this.TaskMetaData = resp.data;
                    this.loading = false;
                })
            }
        },
        mounted() {
            this.getTaskMetaData();
        },
        data(){
            return {
                search: '',
                selectTaskMeta: [],
                currentRow: '',
                currentPage: 1,
                TaskMetaData: {
                    count: 0,
                    results: []
                },
                loading: true
            }
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
</style>
