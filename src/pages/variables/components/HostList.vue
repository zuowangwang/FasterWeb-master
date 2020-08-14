<template>
    <el-container>
        <el-header style="padding-top: 10px; height: 50px;">
            <div style="padding-left: 8px;">
                <el-row>
                    <el-col :span="7">
                        <el-pagination
                            :page-size="11"
                            v-show="hostIPData.count !== 0 "
                            background
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            layout="total, prev, pager, next, jumper"
                            :total="hostIPData.count"
                        >
                        </el-pagination>
                    </el-col>
                </el-row>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px; margin-top: 10px;">
                <div style="position: fixed; bottom: 0; right:0; left: 178px; top: 150px">
                    <el-table
                        v-loading="loading"
                        element-loading-text="正在玩命加载"
                        highlight-current-row
                        :data="hostIPData.results"
                        :show-header="hostIPData.results.length !== 0 "
                        stripe
                        height="600px"
                        @cell-mouse-enter="cellMouseEnter"
                        @cell-mouse-leave="cellMouseLeave"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection" width="55"></el-table-column>

                        <el-table-column label="环境名">
                            <template slot-scope="scope">
                                <div>{{scope.row.name}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column label="更新时间">
                            <template slot-scope="scope">
                                <div>{{scope.row.update_time|datetimeFormat}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column label="创建时间">
                            <template slot-scope="scope">
                                <div>{{scope.row.create_time|datetimeFormat}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column>
                            <template slot-scope="scope">
                                <el-row v-show="currentRow === scope.row">
                                    <el-button
                                        type="info"
                                        icon="el-icon-edit"
                                        circle size="mini"
                                        @click="handleEditHostIP(scope.row)"
                                        title="编辑"
                                    ></el-button>

                                    <el-button
                                        type="success"
                                        icon="el-icon-document"
                                        circle size="mini"
                                        @click="handleCopyHost(scope.row.id)"
                                        title="复制"
                                    >
                                    </el-button>

                                    <el-button
                                        v-show="hostIPData.count !== 0"
                                        type="danger"
                                        icon="el-icon-delete"
                                        circle size="mini"
                                        @click="handleDelHost(scope.row.id)"
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
</template>

<script>
    export default {
        name: "HostList",
        props:{
            project: {
                require: true
            },
            del: Boolean,
            back: Boolean
        },
        data() {
            return {
                currentRow: '',
                currentPage: 1,
                currentRowInside: '',
                hostIPData: {
                    count: 0,
                    results: []
                },
                loading: true,
                selectHostInfo: [],
            }
        },
        watch: {
            back() {
                this.getHostIPList();
            },
            del(){
                if (this.selectHostInfo.length !== 0) {
                    this.$confirm('此操作将永久删除勾选的域名信息，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllHost({project:this.$route.params.id},this.selectHostInfo).then(resp => {
                            this.$notify.success('批量删除域名信息成功');
                            this.getHostIPList();
                        })
                    })
                } else {
                    this.$notify.warning('没有勾选域名信息')
                }
            }
        },
        methods: {
            cellMouseEnter(row) {
                this.currentRow = row;
            },
            cellMouseLeave(row) {
                this.currentRow = '';
            },
            handleSelectionChange(val) {
                this.selectHostInfo = val;
            },
            handleDelHost(index) {
                this.$confirm('此操作将永久删除该域名，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteHost(index, {params: {project: this.$route.params.id}}).then(resp => {
                        this.$notify.success('删除成功');
                        this.getHostIPList();
                    })
                })
            },
            handleCurrentChange(val) {
                this.$api.getHostPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.$route.params.id
                    }
                }).then(resp => {
                    this.hostIPData = resp.data;
                })
            },
            handleCopyHost(id){
                this.$prompt('请输入域名名称', '提示', {
                    confirmButtonText: '确定',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '域名名称不能为空'
                }).then(({value}) => {
                    this.$api.copyHost(
                        {project: this.$route.params.id},
                        {
                            name: value,
                            id: id
                        }
                        ).then(resp => {
                        this.$notify.success('复制成功');
                        this.getHostIPList();
                    })
                })
            },
            getHostIPList() {
                this.$api.hostList({params: {project: this.$route.params.id}}).then(resp => {
                    this.hostIPData = resp.data;
                    this.loading = false;
                })
            },
            handleEditHostIP(row) {
                this.$emit('respHostInfo', row);
            }
        },
        mounted() {
            this.$nextTick( function () {
                this.getHostIPList();
            })
        }
    }

</script>

<style scoped>

</style>
