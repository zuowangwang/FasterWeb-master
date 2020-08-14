<template>
    <el-table
        highlight-current-row
        :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
        strpe
        :height="height"
        :data="tableData"
        style="width: 100%;"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
    >
        <el-table-column
            label="断言类型"
            width="150">
            <template slot-scope="scope">
                <el-select v-model="scope.row.comparator" size="medium">
                    <el-option
                        v-for="item in validateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </template>
        </el-table-column>

        <el-table-column
            label="实际返回值"
            >
            <template slot-scope="scope">
                <el-input clearable v-model="scope.row.actual" placeholder="实际返回值" size="medium"></el-input>
            </template>
        </el-table-column>

        <el-table-column
            label="期望类型"
            width="120">
            <template slot-scope="scope">
                <el-select v-model="scope.row.type" size="medium">
                    <el-option
                        v-for="item in dataTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </template>
        </el-table-column>


        <el-table-column label="期望返回值">
            <template slot-scope="scope">
                <el-input v-if="scope.row.type !== 4" clearable v-model="scope.row.expect" placeholder="期望返回值" size="medium"></el-input>
                <el-select v-if="scope.row.type === 4" clearable v-model="scope.row.expect" placeholder="期望返回值" size="medium">
                    <el-option
                        v-for="item in BoolOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </template>
        </el-table-column>

        <el-table-column width="130">
            <template slot-scope="scope">
                <el-row v-show="scope.row === currentRow">
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
            validate: {
                require: false
            }
        },
        computed:{
            height() {
                return window.screen.height - 440
            }
        },

        watch: {
            save: function () {
                this.$emit('validate', this.parseValidate(), this.tableData);
            },

            validate: function () {
                if (this.validate.length !== 0) {
                    this.tableData = this.loaderValidate(this.validate);
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

            handleEdit(index, row) {
                this.tableData.push({
                    expect: '',
                    actual: '',
                    comparator: 'eq',
                    type: 1
                });
            },

            handleDelete(index, row) {
                this.tableData.splice(index, 1);
            },

            // 类型转换
            parseType(type, value) {
                let tempValue;
                const msg = value + ' => ' + this.dataTypeOptions[type - 1].label + ' 转换异常, 该数据自动剔除';
                switch (type) {
                    case 1:
                        if (String(value).toLowerCase() === 'null' || String(value).toLowerCase() === 'none'){
                            tempValue = null;
                        }else {
                            tempValue = String(value);
                        }
                        break;
                    case 2:
                        tempValue = parseInt(value);
                        break;
                    case 3:
                        tempValue = parseFloat(value);
                        break;
                    case 4:
                        tempValue = value === 'true';
                        break;
                    case 5:
                        try {
                            if (value === '' || value === '[]'){
                                tempValue = [];
                            }else{
                                tempValue = JSON.parse(value);
                            }
                        }
                        catch (err) {
                            tempValue = false
                        }
                        break;
                    case 6:
                        try {
                            if (value === '' || value === '{}'){
                                tempValue = {};
                            }else{
                                tempValue = JSON.parse(value);
                            }
                        }
                        catch (err) {
                            tempValue = false
                        }
                        break;
                }

                if (tempValue !== 0 && !tempValue && type !== 4 && type !== 1) {
                    this.$notify.error(msg);
                    return 'exception'
                }
                return tempValue;
            },

            parseValidate() {
                let validate = {
                    validate: []
                };
                for (let content of this.tableData) {
                    if (content['actual'] !== '') {
                        let obj = {};
                        const expect = this.parseType(content['type'], content['expect']);
                        if (expect === 'exception') {
                            continue;
                        }
                        obj[content['comparator']] = [content['actual'], expect];
                        validate.validate.push(obj);
                    }
                }
                return validate;
            },
            loaderValidate(response){
                let obj = [];
                for (let content of response) {
                    if (content['type'] === 4) {
                        if (content['expect'] === true){
                            content['expect'] = 'true'
                        }else{
                            content['expect'] = 'false'
                        }
                    }
                    obj.push(content)
                }
                return obj
            }
        },
        data() {
            return {
                currentValidate: '',
                currentRow: '',
                tableData: [{
                    expect: 200,
                    actual: 'status_code',
                    comparator: 'eq',
                    type: 2
                }],

                dataTypeOptions: [{
                    label: 'String',
                    value: 1
                }, {
                    label: 'Integer',
                    value: 2
                }, {
                    label: 'Float',
                    value: 3
                }, {
                    label: 'Boolean',
                    value: 4
                }, {
                    label: 'List',
                    value: 5
                }, {
                    label: 'Dict',
                    value: 6
                }],

                validateOptions: [{
                    value: 'eq',
                    lable: 'eq'
                }, {
                    value: 'lt',
                    lable: 'lt'
                }, {
                    value: 'le',
                    lable: 'le'
                }, {
                    value: 'gt',
                    lable: 'gt'
                }, {
                    value: 'ge',
                    lable: 'ge'
                }, {
                    value: 'ne',
                    lable: 'ne'
                }, {
                    value: 'str_eq',
                    lable: 'str_eq'
                }, {
                    value: 'len_eq',
                    lable: 'len_eq'
                }, {
                    value: 'len_gt',
                    lable: 'len_gt'
                }, {
                    value: 'len_ge',
                    lable: 'len_ge'
                }, {
                    value: 'len_lt',
                    lable: 'len_lt'
                }, {
                    value: 'len_le',
                    lable: 'len_le'
                }, {
                    value: 'contains',
                    lable: 'contains'
                }, {
                    value: 'contained_by',
                    lable: 'contained_by'
                }, {
                    value: 'type_match',
                    lable: 'type_match'
                }, {
                    value: 'regex_match',
                    lable: 'regex_match'
                }, {
                    value: 'startswith',
                    lable: 'startswith'
                }, {
                    value: 'endswith',
                    lable: 'endwith'
                }],
                BoolOptions:[{
                    label: 'true',
                    value: 'true'
                },{
                    label: 'false',
                    value: 'false'
                }]
            }
        },
        name: "Validate"
    }
</script>

<style scoped>
</style>
