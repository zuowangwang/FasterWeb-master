<template>
  <div style="padding:40px;box-sizing:border-box;height:1000px;overflow:fidden">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      @tab-click="handleClick"
      editable
      @edit="handleTabsEdit"
    >
      <el-tab-pane
        :key="index"
        v-for="(item,index) in editableTabs"
        :label="item.title"
        :name="item.name"
      >
        <el-input
          v-if="item.disabled"
          type="textarea"
          :rows="40"
          placeholder="请输入内容"
          v-model="input"
        ></el-input>
        <div v-else class="content">
          <div v-html="item.content"></div>
        </div>

        <el-button
          type="primary"
          v-if="item.disabled"
          @click="submit(item,index)"
          style="float:right;margin-top:20px"
        >保存</el-button>
        <el-button
          type="primary"
          v-if="!item.disabled"
          @click="editor(item)"
          style="float:right;margin-top:20px"
        >编辑</el-button>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-input v-model="title" placeholder="请输入帮助标题"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTilte">确 定</el-button>
      </span>
    </el-dialog>
    <!--  <div style="overflow-y:scroll;height:100%;font-szie:14px;">
      # 自动化平台帮助
      <br />
      <br /> 
      <br />   API 调试
      <br />1. 当前url > 环境url > 配置rul：
      <br />示例：/api/longin
      <br />自动补全请求地址后:www.baidu.com/api/longin
      <br />2. 可配置：
      <br />全局变量》环境变量》配置变量
      <br />3. Header：
      <br />一行一行添加
      <br />4. Requesr：
      <br />变量参数化 "userName": "$name"，必须为"$name"
      <br />可："$name123$pass" name与pass均为变量
      <br />如果变量不存在，直接失败报错
      <br />5. Extract:
      <br />抽取接口返回值 变量：userKey 提取式：content.data.userKey 下个接口直接调用"$userKey"
      <br />6. Validate:
      <br />校验 extract 提取,示例：eq content.code integer 200
      <br />7. Variables:
      <br />     后续补充
      <br />8. Hooks:
      <br />后续补充
      <br />9. Save保存选择已有的api库分组进行保存，Send运行直接运行
      <br /> 
      <br />
      <br />   API库
      <br />1. 分组,参照现有模块进行分组，根节点与子节点
      <br />2. 每个api后面有：编辑，运行，复制，删除按钮
      <br />3. 复制直接复制相同内容，但是需要新增名字
      <br /> 
      <br />
      <br />   测试用例
      <br />1. 分为冒烟，集成，监控用例
      <br />2. 模式：分组，添加用例，用例添加接口组合，组成业务逻辑
      <br />3. 添加用例，需要从api库中api从左边移动到右边用例框，然后新增名字保存
      <br />业务逻辑自行移动，上下移动代表执行顺序
      <br />保存用例的时候可以选择配置变量，进行保存
      <br />4. 如果api库中api更新，需要更新用例api,可点击用例后面同步按钮
      <br />5. 用例可以进行运行，可以选择同步执行或者异步执行
      <br />
      <br />
      <br />   配置管理-全局变量-域名环境
      <br />1. 均有地址设置，可以开关
      <br />2. 变量名称，选择类型，变量值，备注
      <br /> 
      <br /> 
      <br />   历史报告
      <br />1. 可以查看，下载，删除
      <br /> 
      <br /> 
      <br />   异步回执
      <br />1. 显示执行状态，成功，失败，与结束时间
      <br />2. 失败的异步，可以鼠标移动到traceback上面查看报错
      <br /> 
      <br /> 
      <br />    其他注意点：
      <br />- 后台日志未分页
      <br />- 测试数据模块未调通
      <br/>- 文件数据未调通
      <br/>- 给用户发邮件未调通
      <br />
      <br />
    </div>-->
  </div>
</template>

<script>
export default {
  name: "HelpMenu",
  data() {
    return {
      editors: false,
      dialogVisible: false,
      input: "",
      title: "",
      editableTabsValue: "0",
      textarea: "<p>hello world</p>",
      newTabName: "",
      editableTabs: [],
      tabIndex: 0,
    };
  },
  methods: {
    numToStr(num) {
      num = num.toString();
      return num;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    addTilte() {
      let that = this;
      let newTabName = ++this.tabIndex + "";
      that.editableTabs.push({
        title: this.title,
        name: newTabName,
        content: "",
        disabled: true,
      });
      this.editableTabsValue = newTabName;
      that.dialogVisible = false;
      // that.editableTabsValue = newTabName;
    },
    handleTabsEdit(targetName, action) {
      let that = this;
      if (action === "add") {
        this.dialogVisible = true;
        this.title = "";
        this.input =''
      }
      if (action === "remove") {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
          this.editableTabs.forEach((item) => {
            if (item.id) {
              if (targetName == item.name) {
                this.$api.helpDelete(item.id).then((res) => {
                  if (res.success) {
                    this.$notify.success("文档删除成功");
                  }
                });
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      }
    },
    handleClick(tab, event) {
      let title = tab.label;
      this.editableTabs.forEach((item, index) => {
        if (title == item.title) {
          item.disabled = false;
        } else {
          item.disabled = true;
        }
      });
      this.title = tab.label;
    },
    editor(val) {
      val.disabled = true;
      this.editors = true;
      this.input = val.content;
    },
    submit(val, index) {
      if (this.editors) {
        //编辑
        let params = {
          title: this.editableTabs[index].title,
          content: this.input,
        };
        this.$api.helpEditor(val.id, params).then((res) => {
          if (res.status == 200) {
            this.$notify.success("帮助文档修改成功");
            val.disabled = false;
            this.helpListInfo();
          }
        });
      } else {
        //新增
        let params = {
          title: this.title,
          content: this.input,
        };
        this.$api.helpAdd(params).then((res) => {
          if (res.status == 200) {
            this.$notify.success("帮助文档添加成功");
            val.disabled = false;
            this.helpListInfo();
          }
        });
      }
    },
    helpListInfo() {
      this.$api.helpList().then((res) => {
        if (res.status == 200) {
          let datalist = res.data;
          let arr = [];
          datalist.forEach((item, index) => {
            arr.push({
              title: item.title,
              content: item.content,
              id: item.id,
              name: this.numToStr(index),
              disabled: false,
            });
          });
          this.editableTabs = arr;
          this.tabIndex = arr.length;
        }
      });
    },
  },
  mounted() {
    this.helpListInfo();
  },
};
</script>

<style  scoped>
.content {
  height: 800px;
  overflow: scroll;
}
</style>