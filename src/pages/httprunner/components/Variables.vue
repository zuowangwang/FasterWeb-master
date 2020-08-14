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
            label="变量名"
            >
            <template slot-scope="scope">
                <el-input clearable v-model="scope.row.key" placeholder="Key" size="medium"></el-input>
            </template>
        </el-table-column>

        <el-table-column
            label="类型"
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

        <el-table-column
            label="变量值"
        >
            <template slot-scope="scope">
                <el-input v-if="scope.row.type !== 4" clearable v-model="scope.row.value" placeholder="Value" size="medium"></el-input>
                <el-select v-if="scope.row.type === 4" clearable v-model="scope.row.value" placeholder="Value" size="medium">
                    <el-option
                        v-for="item in BoolOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </template>
        </el-table-column>

        <el-table-column
            label="内容"
            width="150">
            <template slot-scope="scope">
                <el-input clearable v-model="scope.row.desc" placeholder="变量简要描述" size="medium"></el-input>
            </template>
        </el-table-column>

        <el-table-column
            width="130"
        >
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
        name: "Variables",

        props: {
            save: Boolean,
            variables: {
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
                this.$emit('variables', this.parseVariables(), this.tableData);
            },

            variables: function () {
                if (this.variables.length !== 0) {
                    this.tableData = this.loaderVariables(this.variables);
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
                    key: '',
                    value: '',
                    type: 1,
                    desc: ''
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
                            tempValue = JSON.parse(value);
                        }
                        catch (err) {
                            tempValue = false
                        }
                        break;
                    case 6:
                        try {
                            tempValue = JSON.parse(value);
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

            //变量格式化variables
            parseVariables() {
                let variables = {
                    variables: [],
                    desc: {}
                };
                for (let content of this.tableData) {
                    if (content['key'] !== '') {
                        let obj = {};
                        const value = this.parseType(content['type'], content['value']);
                        if (value === 'exception') {
                            continue;
                        }
                        obj[content['key']] = value;
                        variables.variables.push(obj);
                        variables.desc[content['key']] = content['desc'];
                    }
                }
                return variables;
            },
            loaderVariables(response){
                let obj = [];
                for (let content of response) {
                    if (content['type'] === 4) {
                        if (content['value'] === true){
                            content['value'] = 'true'
                        }else{
                            content['value'] = 'false'
                        }
                    }
                    obj.push(content)
                }
                return obj
            }
        },
        data() {
            return {
                currentRow: '',
                tableData: [{
                    key: '',
                    value: '',
                    type: 1,
                    desc: ''
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
                BoolOptions:[{
                    label: 'true',
                    value: 'true'
                },{
                    label: 'false',
                    value: 'false'
                }],
                dataType: 'data'
            }
        }
    }
</script>

<style scoped>

</style>
