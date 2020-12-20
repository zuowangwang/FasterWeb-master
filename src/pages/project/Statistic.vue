<template>
  <div>
    <div class="flex">
      <el-date-picker
        v-model="startDate"
        type="date"
        value-format="yyyyMMdd"
        placeholder="开始日期"
        style="margin-right: 10px"
      ></el-date-picker>
      <el-date-picker
        v-model="endDate"
        type="date"
        value-format="yyyyMMdd"
        placeholder="结束日期"
        style="margin-right: 10px"
      ></el-date-picker>
      <el-button @click="search">搜索</el-button>
    </div>
    <div id="statistic"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "statistic",
  data() {
    return {
      startDate: "",
      endDate: "",
    };
  },
  methods: {
    getNowFormatDate() {
      //设置日期，当前日期的前七天
      var myDate = new Date(); //获取今天日期
      var year = myDate.getFullYear()
      myDate.setDate(myDate.getDate() - 6);
      var dateArray = [];
      var dateTemp;
      var flag = 1;
      for (var i = 0; i < 7; i++) {
        dateTemp = myDate.getMonth() + 1 + "-" + myDate.getDate();
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
      }
      year=year.toString()
      var dataInfo={}
        dataInfo.startDate= year+dateArray[0].replace('-','')
        dataInfo.endDate=year+dateArray[6].replace('-','')
      return dataInfo
    },
    getData(data, key, type) {
      const dates = Object.keys(data);
      console.log(
        "result",
        dates.map((item) => data[item][key][type] || 0)
      );
      return dates.map((item) => data[item][key][type] || 0);
    },
    async search() {
      const { data } = await this.$api.getStatisticList({
        project: this.$route.params.id,
        start_date: this.startDate,
        complete_date: this.endDate,
      });
      this.drawChart(data);
    },
    drawChart(data) {
      let charts = echarts.init(document.getElementById("statistic"));
      const option = {
        color: [
          "#9ad3bc",
          "#ec524b",
          "#f3eac2",
          "#ec524b",
          "#f5b461",
          "#e5323e",
          "#8bcdcd",
          "#e5323e",
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: [
            "异步成功",
            "异步失败",
            "定时成功",
            "定时失败",
            "调试成功",
            "调试失败",
            "总和成功",
            "总和失败",
          ],
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: Object.keys(data),
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "异步成功",
            type: "bar",
            barGap: 0,
            stack: "异步",
            label: "异步成功",
            data: this.getData(data, "asyn_task", "successes"),
          },
          {
            name: "异步失败",
            type: "bar",
            barGap: 0,
            stack: "异步",
            label: "异步失败",
            data: this.getData(data, "asyn_task", "errors"),
          },
          {
            name: "定时成功",
            type: "bar",
            stack: "定时",
            label: "定时成功",
            data: this.getData(data, "clock_task", "successes"),
          },
          {
            name: "定时失败",
            type: "bar",
            stack: "定时",
            label: "定时失败",
            data: this.getData(data, "clock_task", "errors"),
          },
          {
            name: "调试成功",
            type: "bar",
            label: "调试成功",
            stack: "调试",
            data: this.getData(data, "debug_task", "successes"),
          },
          {
            name: "调试失败",
            type: "bar",
            label: "调试失败",
            stack: "调试",
            data: this.getData(data, "debug_task", "errors"),
          },
          {
            name: "总和成功",
            type: "bar",
            stack: "总和",
            label: "总和成功",
            data: this.getData(data, "current_total", "successes"),
          },
          {
            name: "总和失败",
            type: "bar",
            stack: "总和",
            label: "总和失败",
            data: this.getData(data, "current_total", "errors"),
          },
        ],
      };
      charts.setOption(option);
    },
  },
  async mounted() {
    const { data } = await this.$api.getStatisticList({
      project: this.$route.params.id,
      start_date: this.getNowFormatDate().startDate,
      complete_date:'',
    });
    console.log("data", data);
    this.drawChart(data);
  },
};
</script>
<style scoped>
#statistic {
  width: 100%;
  height: 400px;
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
}
</style>
