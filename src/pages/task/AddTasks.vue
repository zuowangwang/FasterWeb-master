<template>
    <el-container>
        <template v-if="listPageShow">
            <el-main style="padding-top: 0;height: 600px; overflow: auto;">
                <div style="margin-top: 10px;" >
                    <el-form
                        :model="ruleForm"
                        :rules="rules"
                        ref="ruleForm"
                        label-width="100px"
                        style="width: 60%"
                    >
                        <el-form-item label="任务名称" prop="name">
                            <el-input v-model="ruleForm.name" placeholder="请输入任务名称" clearable size="medium"></el-input>
                        </el-form-item>

                        <el-form-item label="时间配置" prop="crontab">
                            <el-input clearable v-model="ruleForm.crontab" placeholder="请输入crontab表达式，例如 2 12 * * *" size="medium"></el-input>
                        </el-form-item>

                        <el-form-item label="任务状态" prop="switch" >
                            <el-switch active-color="#13ce66" inactive-color="#ff4949" v-model="ruleForm.switch" ></el-switch>
                        </el-form-item>

                        <el-form-item label="邮件策略" prop="strategy">
                            <el-radio-group v-model="ruleForm.strategy">
                                <el-radio label="始终发送"></el-radio>
                                <el-radio label="仅失败发送"></el-radio>
                                <el-radio label="从不发送"></el-radio>
                                <el-radio label="监控邮件"></el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="报警次数" prop="fail_count" v-show="ruleForm.strategy === '监控邮件'">
                            <el-input-number v-model="ruleForm.fail_count" :min="1" :max="20" size="small" :precision="0"></el-input-number>
                        </el-form-item>

                        <el-form-item label="关键字过滤" prop="self_error" v-show="ruleForm.strategy === '监控邮件'">
                            <el-input type="textarea" v-model="ruleForm.self_error" placeholder='若用例失败的返回报错含有关键字则视为用例通过，多个关键字以";"分隔'
                                      clearable size="medium" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
                        </el-form-item>

                        <el-form-item label="敏感字过滤" prop="sensitive_keys">
                            <el-input type="textarea" v-model="ruleForm.sensitive_keys" placeholder='将敏感字处理为******，多个敏感字以";"分隔'
                                      clearable size="medium" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
                        </el-form-item>

                        <el-form-item label="接收邮箱" prop="receiver">
                            <el-input type="textarea" v-model="ruleForm.receiver" placeholder='多个邮箱以";"分隔' clearable size="medium"
                                      :autosize="{ minRows: 1, maxRows: 4}"></el-input>
                        </el-form-item>

                        <el-form-item label="抄送邮箱" prop="mail_cc">
                            <el-input type="textarea" v-model="ruleForm.mail_cc" placeholder='多个邮箱以";"分隔' clearable size="medium"
                                      :autosize="{ minRows: 1, maxRows: 4}"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="submitForm('ruleForm')">下一步</el-button>
                            <el-button size="small"  @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-main>
        </template>
        <template v-if="next">
            <el-aside style="margin-top: 10px;">
                <div class="nav-api-side">
                    <div class="api-tree">
                        <el-input
                            placeholder="输入关键字进行过滤"
                            v-model="filterText"
                            size="medium"
                            clearable
                            prefix-icon="el-icon-search"
                        >
                        </el-input>
                        <el-tree
                            @node-click="handleNodeClick"
                            :data="dataTree"
                            node-key="id"
                            :default-expand-all="false"
                            :expand-on-click-node="false"
                            highlight-current
                            :filter-node-method="filterNode"
                            ref="tree2"
                        >
                            <span class="custom-tree-node"
                                  slot-scope="{ node, data }"
                            >
                                <span><i class="el-icon-suitcase"></i>&nbsp;&nbsp;{{ node.label }}</span>
                            </span>
                        </el-tree>
                    </div>
                </div>
            </el-aside>
            <el-main style="padding-top: 0px">
                <div>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-pagination
                                :page-size="11"
                                v-show="suiteData.count !== 0"
                                background
                                @current-change="handlePageChange"
                                :current-page.sync="currentPage"
                                layout="total, prev, pager, next, jumper"
                                :total="suiteData.count"
                                style="text-align: center"
                            >
                            </el-pagination>
                        </el-col>
                        <el-col :span="12">
                            <el-button size="small" type="primary" v-if="testData.length > 0" @click="saveTask">保存</el-button>
                            <el-button size="small"   @click="next=false; listPageShow= true">返回</el-button>
                        </el-col>
                    </el-row>
                </div>

                <div>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <div
                                v-for="(item,index) in suiteData.results"
                                draggable='true'
                                @dragstart="currentSuite = JSON.parse(JSON.stringify(item))"
                                style="cursor: pointer; margin-top: 10px; overflow: auto"
                                :key="index"
                            >
                                <div class="block block_options">
                                    <span class="block-method block_method_options block_method_color">Case</span>
                                    <span class="block_name">{{item.name}}</span>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="12">

                            <div style="max-height: 600px; overflow: auto"
                                 @drop='drop($event)'
                                 @dragover='allowDrop($event)'
                            >
                                <span
                                    v-if="testData.length ===0"
                                    style="color: red">温馨提示：<br/>选择左侧相应用例节点显示可拖拽的用例<br/>从左边拖拽用例至此区域组成任务列表<br/>
                                    上下拖动此区域任务调整监控调用顺序
                                </span>
                                <div class='test-list'>
                                    <draggable
                                        v-model="testData"
                                        @end="dragEnd"
                                        @start="length = testData.length"
                                        animation=200
                                    >
                                        <div
                                            v-for="(test, index) in testData"
                                            :key="index"
                                            class="block block_test"
                                            @mousemove="currentTest = index"
                                        >
                                        <span
                                            class="block-method block_method_test block_method_color">Tasks</span>
                                            <span class="block-test-name" v-if="test.kwargs" >{{test.kwargs.testCaseName}}</span>
                                            <span class="block-test-name" v-else >{{test.name}}</span>
                                            <el-button
                                                style="position: absolute; right: 48px; top: 8px"
                                                v-show="currentTest === index"
                                                type="info"
                                                icon="el-icon-edit"
                                                circle size="mini"
                                                @click="handleEditTestCase"
                                                title="编辑"
                                            >
                                            </el-button>

                                            <el-button
                                                style="position: absolute; right: 12px; top: 8px"
                                                v-show="currentTest === index"
                                                type="danger"
                                                icon="el-icon-delete"
                                                circle size="mini"
                                                @click="testData.splice(index, 1)"
                                            >
                                            </el-button>
                                        </div>
                                    </draggable>
                                </div>

                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-main>
        </template>
        <template>
            <edit-test-case
                v-if="editTestCaseActivate"
                :testCase="testData[currentTest]"
                :next="next"
                v-on:escEdit="editTestCaseActivate = false; next = true"
                v-on:KwargsForm="handleNewTestCase"
            >
            </edit-test-case>
        </template>
    </el-container>
</template>

<script>
    import draggable from 'vuedraggable'
    import EditTestCase from './EditTestCase'

    export default {
        name: "AddTasks",
        props: {
            ruleForm: {
                require: true
            },
            args: {
                require: true
            },
            scheduleId:{
                require: true
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },
        components: {
            EditTestCase,
            draggable
        },
        data() {
            return {
                showMonior: false,
                currentTest: '',
                length: 0,
                testData: [],
                currentSuite: '',
                search: '',
                next: false,
                listPageShow: true,
                node: '',
                currentPage: 1,
                filterText: '',
                expand: '&#xe65f;',
                dataTree: [],
                suiteData: {
                    count: 0,
                    results: []
                },
                rules: {
                    name: [
                        {required: true, message: '请输入任务名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    crontab: [
                        {required: true, message: '请输入正确的crontab表达式', trigger: 'blur'}
                    ]
                },
                editTestCaseActivate: false,
            }
        },
        methods: {
            handleNewTestCase(kwargsForm){
                this.editTestCaseActivate = false;
                this.next = true;
                this.testData[this.currentTest]["kwargs"] = kwargsForm;
            },
            handleEditTestCase(){
                this.editTestCaseActivate = true;
                this.next = false;
            },
            saveTask(){
                var form = this.ruleForm;
                form["data"] = this.testData;
                form["project"] = this.$route.params.id;
                if (this.scheduleId === ''){
                    this.$api.addTask({project:this.$route.params.id},form).then(resp => {
                        if (resp.status === 201) {
                            this.$notify.success('添加定时任务成功');
                            this.$emit("changeStatus", false);
                        }
                    })
                }else{
                    this.$api.updateTask(this.scheduleId,{project:this.$route.params.id},form).then( resp =>{
                        if (resp.status === 200) {
                            this.$notify.success('更新定时任务成功');
                            this.$emit("changeStatus", false);
                        }
                    })
                }
            },
            dragEnd(event) {
                if (this.testData.length > this.length) {
                    this.testData.splice(this.length, 1)
                }
            },
            drop(event) {
                event.preventDefault();
                this.testData.push(this.currentSuite);
            },
            allowDrop(event) {
                event.preventDefault();
            },
            handlePageChange(val) {
                this.$api.getTestPaginationBypage({
                    params: {
                        page: this.currentPage,
                        node: this.node,
                        project: this.$route.params.id,
                        search: ''
                    }
                }).then(res => {
                    this.suiteData = res;
                })
            },
            handleCurrentChange(val) {
                this.$api.getTestPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.$route.params.id,
                        node: this.node,
                        search: this.search
                    }
                }).then(resp => {
                    this.suiteData = resp;
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.next = true;
                        this.listPageShow = false;
                    } else {
                        return false;
                    }
                });
                this.testData = this.args;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            getTree() {
                this.$api.getTree(this.$route.params.id, {params: {type: 2}}).then(resp => {
                    this.dataTree = resp.tree;
                })
            },

            handleNodeClick(node) {
                this.node = node.id;
                this.getTestList();
            },
            getTestList() {
                this.$api.testList({
                    params: {
                        project: this.$route.params.id,
                        node: this.node,
                        search: this.search
                    }
                }).then(resp => {
                    this.suiteData = resp.data;
                })
            }
        },
        mounted() {
            this.getTree();
            this.getTestList();
        }
    }
</script>

<style scoped>

    .test-list {
        height: 590px;
    }

    .block_test {
        margin-top: 10px;
        border: 1px solid #49cc90;
        background-color: rgba(236, 248, 238, .4)
    }

    .block_method_test {
        background-color: #304056;
    }

    .block-test-name {
        width: 700px;
        padding-left: 10px;
        -webkit-box-flex: 1;
        font-size: 13px;
        -ms-flex: 1;
        font-family: Open Sans, sans-serif;
        color: #3b4151;
        border: none;
        outline: none;
        background: rgba(236, 248, 238, .4)

    }


</style>
