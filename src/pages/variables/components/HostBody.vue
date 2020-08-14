<template>
    <div style="margin-left: 10px">
        <div style="margin-top: 10px">
            <el-input
                style="width: 600px"
                placeholder="请输入域名名称"
                v-model="name"
                clearable
            >
                <template slot="prepend">域名信息录入</template>
                <el-button
                    slot="append"
                    type="success"
                    plain
                    @click="save = !save"
                >Save
                </el-button>
            </el-input>
        </div>

        <el-input
            class="input-with-select"
            placeholder="请输入 base_url 地址"
            v-model="base_url"
            clearable
        >
            <template slot="prepend">域名请求地址</template>
        </el-input>

        <div class="request">
            <el-tabs
                v-model="activeTag"
                style="margin-left: 20px"
            >
                <el-tab-pane label="Variables" name="third">
                    <variables
                        :save="save"
                        v-on:variables="handleVariables"
                        :variables="response ? response.hostInfo : []"
                    >
                    </variables>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import Variables from '../../httprunner/components/Variables'
    export default {
        name: "HostBody",
        components: {
            Variables
        },
        props: {
            response: {
                require: false
            }
        },
        watch: {
            response: function () {
                this.name = this.response.name;
                this.base_url = this.response.base_url;
                this.id = this.response.id;
            }
        },
        methods: {
            handleVariables(variables) {
                this.variables = variables;
                if (this.id === '') {
                    this.addHostIP();
                } else {
                    this.updateHost();
                }
            },
            addHostIP(){
                if (this.validateData()) {
                    this.$api.addHostIP(
                        {project: this.$route.params.id},
                        {
                            name: this.name,
                            hostInfo: this.variables,
                            project: this.$route.params.id,
                            base_url: this.base_url
                        }
                        ).then(resp => {
                        this.$notify.success('添加环境信息成功');
                        this.$emit("addSuccess");
                    })
                }
            },
            updateHost(){
                if (this.validateData()) {
                    this.$api.updateHost(
                        this.id,
                        {project: this.$route.params.id},
                        {
                            name: this.name,
                            hostInfo: this.variables,
                            project: this.$route.params.id,
                            base_url: this.base_url
                        }
                    ).then(resp=>{
                        this.$notify.success('更新环境信息成功');
                        this.$emit("addSuccess");
                    })
                }
            },
            validateData() {
                if (this.name === '') {
                    this.$notify.error('配置名称不能为空');
                    return false;
                }
                return true
            },
        },
        data (){
            return {
                save: false,
                activeTag: 'third',
                base_url: '',
                name: '',
                id: '',
                variables: [],
            }
        }
    }
</script>

<style scoped>
    .request {
        margin-top: 15px;
        border: 1px solid #ddd;
    }
    .input-with-select {
        width: 600px;
        margin-top: 10px;
    }
</style>
