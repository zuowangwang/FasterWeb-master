<template>
    <div id="app">
         <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'App',
         data () {
            return {
                isRouterAlive: true
            }
        },
        provide(){ //提供
            return {
                reload: this.reload
            }
        },
         methods: {
            reload(){
                this.isRouterAlive = false
                this.$nextTick( function () {
                    this.isRouterAlive = true
                })
            }
        }   
    }
</script>

<style>

    html, body {
        height:100%;
        width:100%;
        overflow:hidden;
        margin:0;
        padding:0;
        background: #fff;
    }

    body {
        color: #333;
        font-family: "PingFang SC", "Helvetica Neue", Helvetica, "Hiragino Sans GB", STHeitiSC-Light, "Microsoft YaHei", "微软雅黑", Arial, sans-serif
    }
    .el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
        min-width: 140px;
    }
    #app{
        width: 100%;
        height: 100%;
    }
</style>
