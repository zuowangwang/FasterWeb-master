<template>
    <div>
        <div>
            <div>
                <el-input
                    style="width: 60%; min-width: 500px"
                    placeholder="请输入接口名称"
                    v-model="name"
                    clearable
                >
                    <template slot="prepend">接口信息录入</template>
                </el-input>
                <el-button
                    slot="append"
                    type="primary"
                    @click="save = !save"
                >Save
                </el-button>
                <el-button
                    style="margin-left: 0px"
                    slot="append"
                    type="info"
                    @click="esc = !esc"
                >Back
                </el-button>
            </div>

            <div>
                <el-input
                    class="input-with-select"
                    placeholder="请输入接口请求地址"
                    v-model="url"
                    clearable
                    style="width: 40%; min-width: 500px"
                    disabled
                >
                    <el-select
                        slot="prepend"
                        v-model="method"
                        size="small"
                        disabled
                    >
                        <el-option
                            v-for="item of httpOptions"
                            :label="item.label"
                            :value="item.label"
                            :key="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-input>

                <el-input
                    placeholder="${skipif()} or boolean"
                    v-model="skipIf"
                    style="width:40%; min-width: 400px"
                    clearable
                >
                    <template slot="prepend" >skipIf:</template>
                </el-input>
                <el-tooltip
                    effect="dark"
                    content="循环次数"
                    placement="bottom"
                    style="width:10%;"
                >
                    <el-input-number
                        v-model="times"
                        controls-position="right"
                        :min="1"
                        :max="100"
                    >
                    </el-input-number>
                </el-tooltip>
            </div>
        </div>

        <div class="request">
            <el-tabs
                style="margin-left: 20px"
                v-model="activeTag"
            >
                <el-tab-pane label="Header" name="first">
                    <headers
                        :save="save"
                        v-on:header="handleHeader"
                        :header="header"
                        :isDisabled="isDisabled"
                    >
                    </headers>
                </el-tab-pane>

                <el-tab-pane label="Request" name="second">
                    <request
                        :save="save"
                        v-on:request="handleRequest"
                        :request="request"
                        :isDisabled="isDisabled"
                    >
                    </request>
                </el-tab-pane>

                <el-tab-pane label="Extract" name="third">
                    <extract
                        :save="save"
                        v-on:extract="handleExtract"
                        :extract="extract"
                    >
                    </extract>
                </el-tab-pane>

                <el-tab-pane label="Validate" name="fourth">
                    <validate
                        :save="save"
                        v-on:validate="handleValidate"
                        :validate="validate"
                    >
                    </validate>
                </el-tab-pane>

                <el-tab-pane label="Variables" name="five">
                    <variables
                        :save="save"
                        v-on:variables="handleVariables"
                        :variables="variables"
                    >
                    </variables>
                </el-tab-pane>

                <el-tab-pane label="Hooks" name="six">
                    <hooks
                        :save="save"
                        v-on:hooks="handleHooks"
                        :hooks="hooks"
                    >
                    </hooks>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>

</template>

<script>
    import Headers from '../../../httprunner/components/Headers'
    import Request from '../../../httprunner/components/Request'
    import Extract from '../../../httprunner/components/Extract'
    import Validate from '../../../httprunner/components/Validate'
    import Variables from '../../../httprunner/components/Variables'
    import Hooks from '../../../httprunner/components/Hooks'

    export default {
        components: {
            Headers,
            Request,
            Extract,
            Validate,
            Variables,
            Hooks
        },

        props: {
            response: {
                require: true
            },
            host: {
                require: true
            }
        },
        methods: {
            handleHeader(header, value) {
              this.header = value;
            },
            handleRequest(request, value) {
              this.request = value;
            },
            handleValidate(validate, value) {
                this.validate = value;
                this.tempBody.validate = validate;
            },
            handleExtract(extract, value) {
                this.extract = value;
                this.tempBody.extract = extract;
            },
            handleVariables(variables, value) {
                this.variables = value;
                this.tempBody.variables = variables;
            },
            handleHooks(hooks, value) {
                this.hooks = value;
                this.tempBody.hooks = hooks;
                this.tempBody.name = this.name;
                this.tempBody.times = this.times;
                this.tempBody.skipIf = this.skipIf;
                this.tempBody.method = this.method;
                if (this.validateData()) {
                    const body = {
                        extract: this.extract,
                        validate: this.validate,
                        variables: this.variables,
                        hooks: this.hooks,
                        name: this.name,
                        times: this.times,
                        skipIf: this.skipIf
                    };
                    this.$emit('getNewBody', body, this.tempBody);
                }
            },

            validateData() {
                if (this.url === '') {
                    this.$notify.error({
                        message: '接口请求地址不能为空'
                    });
                    return false;
                }

                if (this.name === '') {
                    this.$notify.error({
                        message: '接口名称不能为空'
                    });
                    return false;
                }
                return true
            }
        },

        watch: {
            esc() {
                this.$emit('escEdit');
            }
        },
        data() {
            return {
                esc: false,
                times: this.response.body.times,
                name: this.response.body.name,
                url: this.response.body.url,
                skipIf: this.response.body.skipIf,
                method: this.response.body.method,
                header: [],
                request: [],
                extract: [],
                validate: [],
                variables: [],
                hooks: [],
                tempBody: {},
                isDisabled: true,
                save: false,
                dialogTableVisible: false,
                activeTag: 'second',
                httpOptions: [{
                    label: 'GET',
                }, {
                    label: 'POST',
                }, {
                    label: 'PUT',
                }, {
                    label: 'DELETE',
                }, {
                    label: 'HEAD',
                }, {
                    label: 'OPTIONS',
                }, {
                    label: 'PATCH',
                }],
            }
        },
        name: "TestBody",
        mounted() {
            this.header = this.response.body.header;
            this.request = this.response.body.request;
            this.extract = this.response.body.extract;
            this.validate = this.response.body.validate;
            this.variables = this.response.body.variables;
            this.hooks = this.response.body.hooks;
        }
    }
</script>

<style scoped>
    .el-select {
        width: 125px;
    }

    .input-with-select {
        width: 600px;
        margin-top: 10px;
    }

    .request {
        margin-top: 15px;
        border: 1px solid #ddd;
    }

</style>
