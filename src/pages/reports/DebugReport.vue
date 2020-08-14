<template>
    <div>
        <el-table
            :data="[summary]"
            size="medium"
            style="width: 100%"
            border
            stripe
            :header-cell-style="{textAlign:'center', background: '#F8F8FA'}"
            :cell-style="{textAlign:'center'}">
            <el-table-column label="测试时间" width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.time.start_at|timestampToTime}}</span>
                </template>
            </el-table-column>

            <el-table-column label="持续时间" width="100">
                <template slot-scope="scope">
                    <span v-text="scope.row.time.duration.toFixed(3)+' 秒'"></span>
                </template>
            </el-table-column>

            <el-table-column label="Total" width="100">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.stat.testsRun }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Success" width="100">
                <template slot-scope="scope">
                    <el-tag type="success">{{ scope.row.stat.successes }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Failed" width="100">
                <template slot-scope="scope">
                    <el-tag type="danger">{{ scope.row.stat.failures }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Error" width="100">
                <template slot-scope="scope">
                    <el-tag type="warning">{{ scope.row.stat.errors }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Skipped" width="100">
                <template slot-scope="scope">
                    <el-tag type="info">{{ scope.row.stat.skipped }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Platform">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>HttpRunner: {{ scope.row.platform.httprunner_version }}</p>
                        <p>Python: {{ scope.row.platform.python_version }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.platform.platform }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <br/>
        <br/>

        <slot v-for="item in summary.details">
            <div>
                <span style="font-weight: bold; font-size: medium;">{{item.name}}</span>
                <el-popover
                    placement="right"
                    width="400"
                    style=" position: absolute; right: 50px;margin-top: -10px;height:200px;"
                    trigger="hover"
                >
                    <pre class="code-block">{{item.in_out.in}}</pre>
                    <el-button slot="reference" round type="text" class="popoverFont">paramsIn</el-button>
                </el-popover>
                <el-popover
                    placement="right-start"
                    width="400"
                    trigger="hover"
                    style="position: absolute; right: 0;margin-top: -10px"
                >
                    <pre class="code-block">{{item.in_out.out}}</pre>
                    <el-button slot="reference" round type="text" class="popoverFont">output</el-button>
                </el-popover>
            </div>
            <el-table
                :data="item.records"
                style="width: 100%"
                border
                :header-cell-style="{textAlign:'center', background: '#F8F8FA'}"
                :cell-style="{textAlign:'center'}"
            >
                <el-table-column label="名 称" width="200px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="请求地址">
                    <template slot-scope="scope">
                        <span>{{ scope.row.meta_data.request.url }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="请求方法" width="100px">
                    <template slot-scope="scope">
                        <span :class="scope.row.meta_data.request.method">{{ scope.row.meta_data.request.method }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="响应时间 (ms)" width="150px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.meta_data.response.elapsed_ms }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="测试结果" width="100px">
                    <template slot-scope="scope">
                        <div :class="scope.row.status">{{ scope.row.status }}</div>
                    </template>
                </el-table-column>

                <el-table-column type="expand" fixed>
                    <template slot-scope="props">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="Request" name="first">
                                <pre class="code-block" v-html="handleRequest(props.row.meta_data.request)"></pre>
                            </el-tab-pane>
                            <el-tab-pane label="Content" name="second" v-if="props.row.meta_data.response.content !== null">
                                <pre class="code-block" v-text="handleContent(props.row.meta_data.response.content)"></pre>
                            </el-tab-pane>
                            <el-tab-pane label="Response" name="third" >
                                <pre class="code-block" v-text="handleResponse(props.row.meta_data.response)"></pre>
                            </el-tab-pane>
                            <el-tab-pane label="Validators" name="four" v-if="props.row.meta_data.validators.length !== 0">
                                <pre class="code-block" v-html="props.row.meta_data.validators"></pre>
                            </el-tab-pane>
                            <el-tab-pane label="Exception" name="five" v-if="props.row.attachment !== ''">
                                <pre class="code-block" v-html="props.row.attachment"></pre>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </el-table-column>
            </el-table>
        </slot>
    </div>

</template>

<script>
    export default {
        name: "DebugReport",
        methods: {
            handleRequest(request) {
                const keys = ["start_timestamp"];
                keys.forEach(function (item) {
                    delete request[item];
                });
                try {
                    //request["body"] = JSON.parse(request["body"])
                    delete request["body"]
                } catch (e) {
                }
                return request
            },

            handleContent(content) {
                try {
                    content = JSON.parse(content)
                } catch (e) {
                }
                return content
            },
            handleResponse(response) {
                const keys = ["response_time_ms", "encoding", "ok", "reason", "url", "text", "json", "content_size", "content_type"];
                keys.forEach(function (item) {
                    delete response[item];
                });
                return response
            }
        },
        data() {
            return{
                activeName: 'third'
            }
        },
        props: {
            summary: {
                require: true
            }
        }
    }
</script>

<style scoped>
    .popoverFont {
        color: forestgreen;
        font-weight: bold;
    }
</style>
