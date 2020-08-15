<template>
    <el-container>
        <el-header style="padding-top: 10px; height: 50px;">
            <div style="overflow: hidden">
                <el-row :gutter="50">
                    <el-col :span="6" v-if="testData.count > 11">
                        <el-input placeholder="请输入用例名称" clearable v-model="search">
                            <el-button slot="append" icon="el-icon-search" @click="getTestList"></el-button>
                        </el-input>
                    </el-col>
                    <!-- <el-col :span="7">
                    </el-col> -->
                </el-row>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px; margin-bottom: 10px">
                <div style="position: fixed; bottom: 0; right:0; left: 460px; top: 160px">
                    <el-dialog
                        v-if="dialogTableVisible"
                        :visible.sync="dialogTableVisible"
                        width="80%"
                        :modal-append-to-body="false"
                    >
                        <report :summary="summary"></report>
                    </el-dialog>

                    <el-dialog
                        title="Run TestCase"
                        :visible.sync="dialogTreeVisible"
                        width="35%"
                        :modal-append-to-body="false"
                    >
                        <div>
                            <el-switch
                            style="display: block"
                            v-model="asyncs"
                            v-show="isSingleTest"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="异步执行"
                            inactive-text="同步执行">
                            </el-switch>
                            <div >
                                <span class="demonstration">测试数据:</span>
                                <el-cascader
                                    :options="excelTreeOptions"
                                    collapse-tags
                                    placeholder="试试搜索"
                                    clearable
                                    filterable
                                    v-model="excelTreeData"
                                    size="small"
                                    style="margin-top: 20px;"
                                ></el-cascader>
                            </div>
                            <div>
                                <span class="demonstration">报告名称:</span>
                                <el-input
                                    size="small"
                                    style="margin-top: 20px;width: 365px"
                                    clearable
                                    placeholder="默认当前时间"
                                    v-model="reportName"
                                    :disabled="false">
                                </el-input>
                            </div>
                            <div style="margin-top: 20px" v-show="!isSingleTest">
                                <el-input
                                    placeholder="输入关键字进行过滤"
                                    v-model="filterText"
                                    size="medium"
                                    clearable
                                    prefix-icon="el-icon-search"
                                >
                                </el-input>

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
                                        <span><i class="iconfont" v-html="expand"></i>&nbsp;&nbsp;{{ node.label }}</span>
                                    </span>
                                </el-tree>
                            </div>
                        </div>
                        <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogTreeVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="runTestcase">确 定</el-button>
                  </span>
                </el-dialog>
                    <el-table
                        v-loading="loading"
                        element-loading-text="正在玩命加载"
                        highlight-current-row
                        ref="multipleTable"
                        :data="testData.results"
                        :show-header="testData.count !== 0 "
                        stripe
                        max-height="600"
                        size="medium"
                        @cell-mouse-enter="cellMouseEnter"
                        @cell-mouse-leave="cellMouseLeave"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection" width="55"></el-table-column>

                        <el-table-column label="用例名称" show-overflow-tooltip >
                            <template slot-scope="scope">
                                <div>{{scope.row.name}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column label="API个数" width="80px" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.length}} 个</div>
                            </template>
                        </el-table-column>

                        <el-table-column label="用例类型" width="100px" align="center">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.tag=== 1">冒烟用例</el-tag>
                                <el-tag v-if="scope.row.tag=== 2" type="success">集成用例</el-tag>
                                <el-tag v-if="scope.row.tag=== 3" type="danger">监控脚本</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column label="更新时间" width="160px" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.update_time|datetimeFormat}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column width="150px">
                            <template slot-scope="scope">
                                <el-row v-show="currentRow === scope.row">
                                    <el-button
                                        type="info"
                                        icon="el-icon-edit"
                                        title="编辑"
                                        circle size="mini"
                                        @click="handleEditTest(scope.row.id)"
                                    ></el-button>

                                    <el-button
                                        type="primary"
                                        icon="el-icon-caret-right"
                                        circle size="mini"
                                        title="运行"
                                        @click="handleRunTest(scope.row.id, scope.row.name)"
                                    ></el-button>

                                    <el-popover
                                        style="margin-left: 10px"
                                        v-model="scope.row.visible"

                                        >
                                        <div style="text-align: center">
                                            <el-button
                                                type="success"
                                                icon="el-icon-document"
                                                circle size="mini"
                                                title="复制"
                                                @click="handleCopyTest(scope.row.id)"
                                            >
                                            </el-button>
                                            <el-button
                                                type="warning"
                                                icon="el-icon-refresh"
                                                circle size="mini"
                                                title="同步"
                                                @click="handleSyncTest(scope.row.id)"
                                            >
                                            </el-button>
                                            <el-button
                                                type="danger"
                                                icon="el-icon-delete"
                                                circle size="mini"
                                                title="删除"
                                                @click="handleDelTest(scope.row.id)"
                                            >
                                            </el-button>
                                        </div>
                                        <el-button icon="el-icon-more" title="更多" circle size="mini" slot="reference" @click="scope.row.visible=!scope.row.visible"></el-button>
                                    </el-popover>

                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="float:right;margin-top:20px;margin-right:40px;">
                        <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-size="11"
                            v-show="testData.count !== 0 "
                            background
                            layout="total, prev, pager, next, jumper"
                            :total="testData.count"
                        >
                        </el-pagination>
                    </div>
                </div>
            </el-main>

        </el-container>
    </el-container>

</template>

<script>
    import Report from '../../../reports/DebugReport'

    export default {
        name: "TestList",
        components: {
            Report
        },
        props: {
            run: Boolean,
            back: Boolean,
            project: {
                require: true
            },
            host: {
                require: true
            },
            node: {
                require: false
            },
            del: Boolean
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            run() {
                this.asyncs = false;
                this.isSingleTest = false;
                this.reportName = "";
                this.getTree();
            },
            node() {
                this.search = '';
                this.getTestList();
            },
            back() {
                this.getTestList();
            },
            del() {
                if (this.selectTest.length !== 0) {
                    this.$confirm('此操作将永久删除测试用例集，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllTest({project:this.$route.params.id},this.selectTest).then(resp => {
                            this.$notify.success('所选测试用例删除成功');
                            this.getTestList();
                        })
                    })
                } else {
                    this.$notify.warning({
                        message: '请至少选择一个用例集'
                    })
                }
            }
        },
        data() {
            return {
                excelTreeData:'',
                excelTreeOptions: [],
                visible: false,
                search: '',
                reportName: '',
                asyncs: true,
                isSingleTest: false,
                filterText: '',
                expand: '&#xe65f;',
                dialogTreeVisible: false,
                dataTree: [],
                dialogTableVisible: false,
                selectTest: [],
                summary: {},
                currentRow: '',
                testData: {
                    count: 0,
                    results: []
                },
                currentPage: 1,
                loading: true,
                runtestcaseId: '',
                runtestcaseName: '',
            }
        },
        methods: {
            handleSyncTest(id){
                this.$confirm('此操作将同步API模板的request/header信息，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.SyncTestCase(id,{project: this.$route.params.id}).then(resp => {
                        if (resp.status === 200){
                            this.getTestList();
                            this.$notify.success('同步成功')
                        }
                    })
                })
            },
            getTree() {
                this.$api.getTree(this.$route.params.id, {params: {type: 2}}).then(resp => {
                    this.dataTree = resp.tree;
                    this.dialogTreeVisible = true;
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            runTestcase(){
                if(this.isSingleTest === true){
                    this.runTesecase();
                }else{
                    this.runTree();
                }
            },
            runTree() {
                this.dialogTreeVisible = false;
                this.isSingleTest = false;
                const relation = this.$refs.tree.getCheckedKeys();
                if (relation.length === 0) {
                    this.$notify.error('请至少选择一个节点');
                } else {
                    this.$api.runSuiteTree({
                        "host":this.host,
                        "project": this.project,
                        "relation": relation,
                        "name": this.reportName
                    }).then(resp => {
                        if (resp.hasOwnProperty("status")) {
                            this.$notify.info(resp.msg);
                        }
                    })
                }
            },
            handleRunTest(id, name) {
                this.getTestData();
                this.runtestcaseId = id;
                this.runtestcsaeName = name;
                this.isSingleTest = true;
                this.dialogTreeVisible = true;
            },
            runTesecase(){
                this.dialogTreeVisible = false;
                this.loading = true;
                this.$api.runTestByPk(
                    this.runtestcaseId,
                    {
                    project: this.project,
                    name: this.runtestcsaeName,
                    host:this.host,
                    reportName: this.reportName,
                    async: this.asyncs,
                    excelTreeData: this.excelTreeData
                    }
                ).then(resp => {
                    if (resp.hasOwnProperty("status")) {
                        this.loading = false;
                        this.$notify.info(resp.msg);
                    } else {
                        this.loading = false;
                        this.summary = resp;
                        if (this.summary.details.length <= 5) {
                            this.dialogTableVisible = true;
                        } else {
                            this.$notify.success({
                                title: '提示',
                                message: '执行结束，请在历史报告里查看结果'
                            })
                        }
                    }
                }).catch(error =>{
                    this.loading = false;
                })
            },
            handleCurrentChange(val) {
                this.$api.getTestPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.project,
                        node: this.node,
                        search: this.search
                    }
                }).then(resp => {
                    this.testData = resp;
                })
            },

            handleEditTest(id) {
                this.$api.editTest(id,{params:{project:this.$route.params.id}}).then(resp => {
                    this.$emit('testStep', resp.data);
                })
            },

            handleCopyTest(id) {
                this.$prompt('请输入用例集名称', '提示', {
                    confirmButtonText: '确定',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '用例集不能为空'
                }).then(({value}) => {
                    this.$api.coptTest(
                        {project: this.$route.params.id},
                        {
                            'id': id,
                            'name': value,
                            'relation': this.node,
                            'project': this.project
                        }
                    ).then(resp => {
                        this.$notify.success('复制用例成功');
                        this.getTestList();
                    })
                })
            },

            handleSelectionChange(val) {
                this.selectTest = val;
            },

            handleDelTest(id) {
                this.$confirm('此操作将永久删除该测试用例，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteTest(id,{params:{project: this.$route.params.id}}).then(resp => {
                        this.getTestList();
                        this.$notify.success('删除成功')
                    })
                })
            },
            getTestList() {
                this.$api.testList({
                    params: {
                        project: this.project,
                        node: this.node,
                        search: this.search,
                        page: this.currentPage
                    }
                }).then(resp => {
                    if (resp.data){
                        for (let rowData of resp.data.results){
                            rowData["visible"] = false
                        }
                        this.testData = resp.data;
                    }
                    this.loading = false;
                })
            },
            cellMouseEnter(row) {
                this.currentRow = row;
            },
            cellMouseLeave(row) {
                this.currentRow = '';
            },
            getTestData() {
                this.$api.testdataList({
                    params: {
                        project: this.$route.params.id
                    }
                }).then(resp => {
                    this.excelTreeOptions = [];
                    for (let excelTree of resp.results){
                        if (excelTree["excel_tree"]){
                            this.excelTreeOptions.push(excelTree["excel_tree"])
                        }
                    }
                })
            }
        },
        mounted() {
           this.getTestList();
        }
    }
</script>

<style scoped>

</style>
