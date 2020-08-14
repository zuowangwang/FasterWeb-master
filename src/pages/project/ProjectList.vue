<template>
    <el-container>
        <el-header style="background: #F7F7F7; padding: 0; height: 50px">
            <div>
                <div style="padding-top: 10px; margin-left: 10px;">
                    <el-button type="primary"
                               size="small"
                               icon="el-icon-circle-plus"
                               @click="dialogVisible = true">
                        添加项目
                    </el-button>

                    <el-button style="margin-left: 50px"
                               type="info"
                               round
                               size="small"
                               icon="el-icon-d-arrow-left"
                               :disabled="projectData.previous === null "
                               @click="getPagination(projectData.previous)"
                               v-show="projectData.results.length > 9"
                    >
                        上一页
                    </el-button>

                    <el-button type="info"
                               round
                               size="small"
                               :disabled="projectData.next === null"
                               @click="getPagination(projectData.next)"
                               v-show="projectData.results.length > 9"
                    >
                        下一页
                        <i class="el-icon-d-arrow-right"></i>
                    </el-button>


                    <el-dialog
                        title="添加项目"
                        :visible.sync="dialogVisible"
                        width="30%"
                        align="center"
                    >
                        <el-form :model="projectForm"
                                 :rules="rules"
                                 ref="projectForm"
                                 label-width="100px"
                                 class="project">
                            <el-form-item label="项目名称" prop="name">
                                <el-input v-model="projectForm.name" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="项目描述" prop="desc">
                                <el-input v-model="projectForm.desc" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="项目主管" prop="desc">
                                <el-input v-model="projectForm.responsible" clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                        <el-button size="medium" @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary"  size="medium" @click="handleConfirm('projectForm')">确定</el-button>
                      </span>
                    </el-dialog>
                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px">
                <el-table
                    v-loading="loading"
                    element-loading-text="正在玩命加载"
                    fullscreenLoading=true
                    highlight-current-row
                    :data="projectData.results"
                    border
                    stripe
                    :show-header="projectData.results.length > 0"
                    highlight-current-row
                    style="width: 100%;"
                >
                    <el-table-column
                        label="项目名称"
                        width="200"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span
                                style="font-size: 16px; font-weight: bold; cursor: pointer;"
                                @click="handleCellClick(scope.row)"
                            >{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="负责人"
                        width="150"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.responsible }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="项目描述"
                        min-width="200"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.desc }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="更新时间"
                        width="200"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.update_time | datetimeFormat }}</span>
                        </template>
                    </el-table-column>


                    <el-table-column
                        label="操作"
                        width="230"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="small"
                                type="success"
                                @click="handleCellClick(scope.row)">查看
                            </el-button>

                            <el-button
                                size="small"
                                type="info"
                                style = "margin-left:0 !important;"
                                @click="handleEdit(scope.$index, scope.row)">修改
                            </el-button>

                            <el-dialog
                                title="编辑项目"
                                :visible.sync="editVisible"
                                width="30%"
                            >
                                <el-form :model="projectForm"
                                         :rules="rules"
                                         ref="projectForm"
                                         label-width="100px"
                                         class="project">
                                    <el-form-item label="项目名称" prop="name">
                                        <el-input v-model="projectForm.name" clearable></el-input>
                                    </el-form-item>
                                    <el-form-item label="项目描述" prop="desc">
                                        <el-input v-model="projectForm.desc" clearable></el-input>
                                    </el-form-item>
                                    <el-form-item label="项目主管" prop="desc">
                                        <el-input v-model="projectForm.responsible" clearable></el-input>
                                    </el-form-item>
                                </el-form>
                                <span slot="footer" class="dialog-footer">
                        <el-button size="medium" @click="editVisible = false">取消</el-button>
                        <el-button size="medium" type="primary" @click="handleConfirm('projectForm')">确定</el-button>
                      </span>
                            </el-dialog>
                            <el-button
                                size="small"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                editVisible: false,
                projectData: {
                    results: []
                },
                projectForm: {
                    name: '',
                    desc: '',
                    responsible: '',
                    id: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '最多不超过50个字符', trigger: 'blur'}
                    ],
                    desc: [
                        {required: true, message: '简要描述下该项目', trigger: 'blur'},
                        {min: 1, max: 100, message: '最多不超过100个字符', trigger: 'blur'}
                    ]
                },
                loading: true
            }
        },
        methods: {
            handleCellClick(row) {
                this.$store.commit('setRouterName', 'ProjectDetail');
                this.setLocalValue("routerName",'ProjectDetail');
                this.$store.state.headTitle = row.name;
                this.$router.push({name: 'ProjectDetail', params: {id: row['id']}});
            },
            handleEdit(index, row) {
                this.editVisible = true;
                this.projectForm.name = row['name'];
                this.projectForm.desc = row['desc'];
                this.projectForm.id = row['id'];
                this.projectForm.responsible = row['responsible']
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.deleteProject(row["id"]).then(resp => {
                        if (resp.status === 204) {
                            this.$notify.success('删除项目成功');
                            this.getProjectList();
                        }
                    })
                })
            },
            handleConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.editVisible = false;
                        let obj;
                        if (this.projectForm.id === '') {
                            obj = this.$api.addProject(this.projectForm);
                        } else {
                            obj = this.$api.updateProject(this.projectForm.id, this.projectForm);
                        }
                        obj.then(resp => {
                            if (String(resp.status).indexOf('2') === 0) {
                                this.projectForm.name = '';
                                this.projectForm.desc = '';
                                this.projectForm.id = '';
                                this.projectForm.responsible = '';
                            }
                            if (resp.status === 201) {
                                this.$notify.success('增加项目成功');
                                this.getProjectList();
                            } else if (resp.status === 200) {
                                this.$notify.success('更新项目成功');
                                this.getProjectList();
                            }
                        })
                    } else {
                        if (this.projectForm.id !== '') {
                            this.editVisible = true;
                        } else {
                            this.dialogVisible = true;
                        }
                        return false;
                    }
                });

            },
            getProjectList() {
                this.$api.getProjectList().then(resp => {
                    this.projectData = resp.data;
                    this.loading = false;
                })
            },
            getPagination(url) {
                this.$api.getPagination(url).then(resp => {
                    this.projectData = resp.data;
                })
            },
        },
        mounted() {
            this.getProjectList();
        },
        name: "ProjectList"
    }
</script>

<style scoped>

</style>
