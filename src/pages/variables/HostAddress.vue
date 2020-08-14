<template>
    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 20px">
                    <el-button
                        type="primary"
                        size="small"
                        icon="el-icon-circle-plus-outline"
                        @click="initResponse = true"
                        :disabled="addHostActivate"
                      >新增环境
                    </el-button>
                    <el-button
                        style="margin-left: 20px"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        size="mini"
                        @click="del= !del"
                        title="批量删除"
                        :disabled="addHostActivate"
                    ></el-button>
                    <el-button
                        :disabled="!addHostActivate"
                        type="text"
                        style="position: absolute; right: 30px;"
                        @click="addHostActivate=false"
                    >返回列表</el-button>
                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px">
                <host-body
                    v-show="addHostActivate"
                    :project="$route.params.id"
                    :response="respHostInfo"
                    v-on:addSuccess="handleAddSuccess"
                >
                </host-body>

                <host-list
                    v-show="!addHostActivate"
                    :project="$route.params.id"
                    v-on:respHostInfo="handleRespHost"
                    :del="del"
                    :back="back"
                >
                </host-list>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import HostBody from './components/HostBody'
    import HostList from './components/HostList'

    export default {
        components: {HostBody, HostList},
        computed: {
            initResponse: {
                get() {
                    return this.addHostActivate;
                },
                set(value) {
                    this.addHostActivate = value;
                    this.respHostInfo = {
                        id: '',
                        base_url: '',
                        name: '',
                        hostInfo: [{
                            key: "",
                            value: "",
                            desc: "",
                            type: 1
                        }]
                    };
                }
            },
        },
        methods: {
            handleAddSuccess () {
                this.back = !this.back;
                this.addHostActivate = false;
            },

            handleRespHost(row) {
                this.respHostInfo = row;
                this.addHostActivate = true;
            }
        },
        data() {
            return {
                addHostActivate: false,
                respHostInfo: {},
                back: false,
                del: false,
            }
        },
        name: "HostAddress"
    }
</script>

<style>


</style>
