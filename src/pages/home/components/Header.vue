<template>
    <div>
        <div class="nav-header">
            <span style="color: white; font-size: 20px; margin-left: 24px">{{ $store.state.headTitle }}</span>
            <span class="right">
                <div style="float: right; color: #d9d9d9; margin-right: 100px">
                    <i class="el-icon-user-solid" style="font-size: 16px"></i>
                    <span v-text="this.$store.state.user" style="font-size: large"></span>
                    <a style="padding-left: 10px;font-size: 16px" @click="handleLogOut">注 销</a>
                </div>
            </span>
        </div>
    </div>
</template>

<script>
    import ProjectList1 from '../../project/ProjectList'
    export default {
        methods: {
            handleLogOut () {
                this.$store.commit("isLogin", null);
                this.setLocalValue("token", null);
                this.$router.push({name:"Login"});
            }
        },
        name: "Header",
        components:{
            ProjectList1
        }
    }
</script>

<style scoped>
    .left {
        width: 180px;
        left: 20px;
        display: inline-block;
        position: fixed;
        z-index: 900;
        top: -5px;
    }

    .right {
        position: fixed;
        left: 300px;
        right: 0;
        top: 0;

    }

    .right div a:hover {
        color: darkcyan;
    }

    .logo {
        background: white;
        height: 40px;
    }

    .nav-header {
        background: #01101A;
        margin: 0 auto;
        font-size: 14px;
        width: 100%;
        border-bottom: 1px solid #ddd;
        height: 49px;
        line-height: 49px;
    }

</style>
