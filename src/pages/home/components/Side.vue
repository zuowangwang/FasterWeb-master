<template>
    <el-menu
        class="common-side-bar"
        :default-active="$store.state.routerName"
        background-color="#2e3138"
        text-color="#BFCBD9"
        active-text-color="#1dbe89"
        @select="select"
        :collapse="true"
    >
        <el-menu-item index="ProjectList" @click="$store.state.headTitle = 'Renderbus 接口自动化测试平台'">
            <i class="el-icon-s-home"></i>
            首页
        </el-menu-item>

        <el-menu-item v-for="item of side_menu" :index="item.url" :key="item.url" :disabled="$store.state.routerName === 'ProjectList'">
            <i :class="item.code"></i>
            {{item.name}}
        </el-menu-item>
        <el-submenu index="1" :disabled="$store.state.routerName === 'ProjectList'">
            <template slot="title" >
                <i class="el-icon-caret-right"></i>
                执行用例
            </template>
            <el-menu-item class="submenu-side-bar" v-for="item of run_menu" :index="item.url" :key="item.url">
                <i :class="item.code"></i>
                {{item.name}}
            </el-menu-item>
        </el-submenu>
        <el-submenu index="2" :disabled="$store.state.routerName === 'ProjectList'">
            <template slot="title">
                <i class="el-icon-s-tools"></i>
                参数配置
            </template>
            <el-menu-item class="submenu-side-bar" v-for="item of config_menu" :index="item.url" :key="item.url">
                <i :class="item.code"></i>
                {{item.name}}
            </el-menu-item>
        </el-submenu>
        <el-submenu  index="3" :disabled="$store.state.routerName === 'ProjectList'">
            <template slot="title">
                <i class="el-icon-folder-opened"></i>
                报告回执
            </template>
            <div class="submenu-side-bar">
            <el-menu-item class="submenu-side-bar" v-for="item of report_menu" :index="item.url" :key="item.url">
                <i :class="item.code"></i>
                {{item.name}}
            </el-menu-item>
            </div>
        </el-submenu>
    </el-menu>
</template>

<script>
    export default {
        name: "Side",
        data() {
            return {
                side_menu: [
                    {name: "项目概况", url: "ProjectDetail", code: "el-icon-data-board"},
                    {name: "测试数据", url: "TestData", code: "el-icon-s-data"},
                    {name: "驱动代码", url: "DebugTalk", code: "el-icon-s-opportunity"},
                ],
                run_menu:[
                    {name: "API 模板", url: "RecordApi", code: "el-icon-document"},
                    {name: "测试用例", url: "AutoTest", code: "el-icon-suitcase"},
                    {name: "定时任务", url: "Task", code: "el-icon-alarm-clock"}
                ],
                config_menu:[
                    {name: "配置管理", url: "RecordConfig", code: "el-icon-setting"},
                    {name: "全局变量", url: "GlobalEnv", code: "el-icon-cloudy"},
                    {name: "域名管理", url: "HostIP", code: "el-icon-news"}
                ],
                report_menu:[
                    {name: "历史报告", url: "Reports", code: "el-icon-reading"},
                    {name: "异步回执", url: "TaskMeta", code: "el-icon-pie-chart"}
                ]
            }
        },
        methods:{
            select(url) {
                this.$store.commit('setRouterName',url);
                this.$router.push({name:url});
                this.setLocalValue("routerName",url);
            }
        }
    }
</script>

<style scoped>

    .common-side-bar {
        position: fixed;
        top: 48px;
        border-right: 1px solid #ddd;
        height: 100%;
        width: 160px;
        background-color: #fff;
        display: inline-block;
    }
    .submenu-side-bar {
        min-width: 100px;
    }
</style>

