<template>
  <div :style="{'height':height}">
    <div v-if="disabled">
      <el-button type="text" size="24px" @click="keyValueEdit">Bulk_Edit</el-button>
      <el-table
        highlight-current-row
        :data="tableData"
        :height="height"
        style="width: 100%;"
        :border="false"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
      >
        <el-table-column label="标签">
          <template slot-scope="scope">
            <el-autocomplete
              clearable
              v-model="scope.row.key"
              :fetch-suggestions="querySearch"
              placeholder="头部标签"
              size="medium"
              style="width:280px"
              :disabled="isDisabled"
            ></el-autocomplete>
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
            ></el-autocomplete>
          </template>
        </el-table-column>

        <el-table-column label="描述" width="200" :disabled="isDisabled">
          <template slot-scope="scope">
            <el-input clearable v-model="scope.row.desc" placeholder="头部信息简要描述" size="medium"></el-input>
          </template>
        </el-table-column>

        <el-table-column width="130" :disabled="isDisabled">
          <template slot-scope="scope">
            <el-row v-show="scope.row === currentRow && !isDisabled">
              <el-button
                icon="el-icon-circle-plus-outline"
                size="mini"
                type="info"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>

              <el-button
                icon="el-icon-delete"
                size="mini"
                type="danger"
                v-show="tableData.length > 1"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="!disabled" class="input-table">
      <el-button type="text" size="24px" @click="BulkEdit">Key_Value_Edit</el-button>
      <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="textarea"></el-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    save: Boolean,
    header: {
      require: true,
    },
    isDisabled: Boolean,
  },
  methods: {
    //转化key value
    keyValueEdit() {
      let value = this.tableData;
      let obj = {};
      let arr = [];
      value.forEach((item) => {
        obj[item.key] = item.value;
        arr.push(item.desc);
      });
      this.descArr = arr;
      this.textarea = JSON.stringify(obj);
      this.disabled = false;
    },
    BulkEdit() {
      if (!this.textarea) {
        this.$notify.warning({
          message: "输入不能为空",
        });
        return false;
      } else if (typeof JSON.parse(this.textarea) =='object') {
        if (
          Object.prototype.toString.call(JSON.parse(this.textarea)) !== "[object Object]"
        ) {
          this.$notify.warning({
            message: "输入格式错误,请重新输入",
          });
          return false;
        }
      }else{
        this.$notify.warning({
          message: "输入格式错误,请重新输入",
        });
        return false;
      }
      let dataList = JSON.parse(this.textarea);
      let dataArr = dataList;
      var arr = [];
      let desc = this.descArr;
      for (let i in dataArr) {
        let o = {};
        o.key = i;
        o.value = dataArr[i];
        arr.push(o);
      }
      arr.forEach((item, index) => {
        item.desc = desc[index] || "";
      });
      this.tableData = arr;
      this.disabled = true;
    },
    querySearch(queryString, cb) {
      let headerOptions = this.headerOptions;
      let results = queryString
        ? headerOptions.filter(this.createFilter(queryString, headerOptions))
        : headerOptions;
      cb(results);
    },

    querySearchContent(queryString, cb) {
      let contentOptions = this.contentOptions;
      let results = queryString
        ? contentOptions.filter(this.createFilter(queryString, contentOptions))
        : contentOptions;
      cb(results);
    },

    createFilter(queryString, options) {
      return (options) => {
        return (
          options.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

    cellMouseEnter(row) {
      this.currentRow = row;
    },

    cellMouseLeave(row) {
      this.currentRow = "";
    },

    handleEdit(index, row) {
      this.tableData.push({
        key: "",
        value: "",
        desc: "",
      });
    },

    handleDelete(index, row) {
      this.tableData.splice(index, 1);
    },

    // 头部信息格式化
    parseHeader() {
      let header = {
        header: {},
        desc: {},
      };
      for (let content of this.tableData) {
        if (content["key"] !== "" && content["value"] !== "") {
          header.header[content["key"]] = content["value"];
          header.desc[content["key"]] = content["desc"];
        }
      }
      return header;
    },
  },
  watch: {
    save: function () {
      this.$emit("header", this.parseHeader(), this.tableData);
    },

    header: function () {
      if (this.header) {
        this.tableData = this.header;
      }
    },
  },
  computed: {
    height() {
      return window.screen.height - 440;
    },
  },
  data() {
    return {
      textarea: "",
      disabled: true,
      descArr: [],
      headerOptions: [
        {
          value: "Content-Type",
        },
        {
          value: "User-Agent",
        },
        {
          value: "X-Requested-With",
        },
        {
          value: "Authorization",
        },
      ],
      currentRow: "",
      tableData: [{ key: "", value: "", desc: "" }],
      contentOptions: [
        {
          value: "application/x-www-form-urlencoded",
        },
        {
          value: "application/json;charset=UTF-8",
        },
        {
          value: "XMLHttpRequest",
        },
      ],
    };
  },
  name: "Header",
};
</script>

<style scoped>
.input-table {
  padding-bottom: 20px;
  width: 100%;
}
.el-button {
  padding: 0;
  float: left;
}
.input-table > .el-button {
  padding: 12px 0;
  float: left;
}
</style>
