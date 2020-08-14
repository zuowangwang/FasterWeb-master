<template>
    <el-table
        highlight-current-row
        :data="tableData"
        :height="height"
        style='width: 100%;'
        :border="false"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
    >
        <el-table-column
            label="标签"
            >
            <template slot-scope="scope">
                <el-autocomplete
                    clearable
                    v-model="scope.row.key"
                    :fetch-suggestions="querySearch"
                    placeholder="头部标签"
                    size="medium"
                    style="width:280px"
                    :disabled="isDisabled"
                >
                </el-autocomplete>
            </template>
        </el-table-column>

        <el-table-column label="内容">
            <template slot-scope="scope">
                <el-autocomplete
                    clearable
                    v-model="scope.row.value"
                    :fetch-suggestions="querySearchContent"
                    placeholder="头部内容"
                    size="medium"
                    style="width:280px"
                    :disabled="isDisabled"
                >
                </el-autocomplete>
            </template>
        </el-table-column>

        <el-table-column
            label="描述"
            width="200"
            :disabled="isDisabled">
            <template slot-scope="scope">
                <el-input clearable v-model="scope.row.desc" placeholder="头部信息简要描述" size="medium"></el-input>
            </template>
        </el-table-column>

        <el-table-column
            width="130"
            :disabled="isDisabled"
        >
            <template slot-scope="scope">
                <el-row v-show="scope.row === currentRow && !isDisabled">
                    <el-button
                        icon="el-icon-circle-plus-outline"
                        size="mini"
                        type="info"
                        @click="handleEdit(scope.$index, scope.row)">
                    </el-button>

                    <el-button
                        icon="el-icon-delete"
                        size="mini"
                        type="danger"
                        v-show="tableData.length > 1"
                        @click="handleDelete(scope.$index, scope.row)">
                    </el-button>
                </el-row>

            </template>
        </el-table-column>
    </el-table>

</template>

<script>

    export default {
        props: {
            save: Boolean,
            header: {
                require: true
            },
            isDisabled: Boolean
        },
        methods: {
            querySearch(queryString, cb) {
                let headerOptions = this.headerOptions;
                let results = queryString ? headerOptions.filter(this.createFilter(queryString, headerOptions)) : headerOptions;
                cb(results);
            },

            querySearchContent(queryString, cb) {
                let contentOptions = this.contentOptions;
                let results = queryString ? contentOptions.filter(this.createFilter(queryString, contentOptions)) : contentOptions;
                cb(results);
            },

            createFilter(queryString, options) {
                return (options) => {
                    return (options.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },

            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },

            handleEdit(index, row) {
                this.tableData.push({
                    key: '',
                    value: '',
                    desc: ''
                });
            },

            handleDelete(index, row) {
                this.tableData.splice(index, 1);
            },

            // 头部信息格式化
            parseHeader() {
                let header = {
                    header: {},
                    desc: {}
                };
                for (let content of this.tableData) {
                    if (content['key'] !== '' && content['value'] !== '') {
                        header.header[content['key']] = content['value'];
                        header.desc[content['key']] = content['desc'];
                    }
                }
                return header;
            }
        },
        watch: {
            save: function () {
                this.$emit('header', this.parseHeader(), this.tableData);
            },

            header: function () {
                if (this.header) {
                    this.tableData = this.header;
                }
            }
        },
        computed:{
            height() {
                return window.screen.height - 440
            }
        },
        data() {
            return {
                headerOptions: [{
                    value: 'Content-Type'
                }, {
                    value: 'User-Agent'
                },{
                    value: 'X-Requested-With'
                },{
                    value: 'Authorization'
                }],
                currentRow: '',
                tableData: [{key: '', value: '', desc: ''}],
                contentOptions: [{
                    value: 'application/x-www-form-urlencoded'
                }, {
                    value: 'application/json;charset=UTF-8'
                },{
                    value: 'XMLHttpRequest'
                }
                ]
            }
        },
        name: "Header"
    }
</script>

<style scoped>
</style>
