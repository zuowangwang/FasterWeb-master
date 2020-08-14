<template>
    <el-container>
        <el-main style="height: 600px">
            <editor
                v-model="requestData.code"
                @init="editorInit"
                lang="python"
                theme="monokai"
                :options="{
                     enableSnippets:true,
                     enableBasicAutocompletion: true,
                     enableLiveAutocompletion: true
                }"
            >
            </editor>
        </el-main>
        <el-footer style="height: 50px">
            <editor
                v-model="resp.msg"
                lang="text"
                theme="monokai"
                :height="codeHeight"
            >
            </editor>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        props: {
            id: {
                require: true
            },
            save: Boolean,
            run: Boolean
        },
        watch: {
            save(){
                this.handleConfirm();
            },
            run(){
                this.handleRunCode();
            }
        },
        data() {
            return {
                codeHeight: 500,
                requestData: {
                    code: '',
                    id: '',
                    project: this.$route.params.id
                },
                resp: {
                    msg: ''
                }
            }
        },
        name: "PycodeDebug",
        methods: {
            handleRunCode() {
                this.resp.msg = '';
                this.$api.runPycode(this.requestData.id,{params:{project:this.$route.params.id}}).then(resp => {
                    this.resp = resp.data;
                })
            },

            handleConfirm() {
                this.$api.updatePycode(this.id, {project: this.$route.params.id}, this.requestData).then(resp => {
                    this.$notify.success("代码保存成功");
                    this.getPycode();
                })
            },
            editorInit() {
                require('brace/ext/language_tools');
                require('brace/mode/python');
                require('brace/theme/monokai');
                require('brace/snippets/python');
            },
            getPycode() {
                this.$api.getPycode(this.id,{params:{project: this.$route.params.id}}).then(res => {
                    this.requestData = res.data;
                })
            }
        },
        components: {
            editor: require('vue2-ace-editor')
        },
        mounted() {
            this.$nextTick( function () {
                this.getPycode();
                this.codeHeight = window.screen.height - 284;
            })
        }
    }
</script>

<style scoped>

    .ace_editor {
        position: relative;
        overflow: hidden;
        font: 18px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace !important;
        direction: ltr;
        text-align: left;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

</style>
