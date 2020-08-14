<template>
    <el-container class="login note" :style ="note">
        <el-main style="padding: 100px">
            <el-row>
                <el-col :span="24">
                    <div >
                        <form id="submit-form">
                            <div id="form-content" style="border-radius: 450px!important;margin-right: 5px;margin-top: 120px;">
                                <div id="form-msg" style="text-align: center;"><h4 style="font-weight: normal">Renderbus</h4></div>
                                <div id="form-inputs">
                                    <div class="form-input-div">
                                        <el-input prefix-icon="el-icon-s-custom" placeholder="请输入用户名" v-model="loginForm.username" id="email" type="text" maxlength="20" clearable></el-input>
                                        <div class="err_msg" id="email_err" v-html="usernameInvalid" @mouseover="usernameInvalid=''"></div>
                                    </div>
                                    <div class="form-input-div">
                                        <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="loginForm.password" show-password id="pwd" type="text" maxlength="30" clearable></el-input>
                                        <div class="err_msg" id="pwd_err" v-html="passwordInvalid" @mouseover="passwordInvalid= ''"></div>
                                    </div>
                                    <div class="form-submit">
                                        <el-button size="mini" @click="submitForm" id="submitBtn" class="btn-primary">登录</el-button>
                                    </div>
                                </div>
                                <div class="form-foot">
                                    <span>没有账户，请联系系统管理员</span>
                                </div>
<!--                                <div class="form-foot">-->
<!--                                    <span>没有账户，<router-link to="/fastrunner/register">立即注册</router-link></span>-->
<!--                                </div>-->
                            </div>
                        </form>
                    </div>

                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import {Notification} from "element-ui";
    export default {
        name: "Login",
        mounted() {
            const myview = this.getViewportSize();
            this.note.height = String(myview["height"]) + 'px';
        },
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
                },
                usernameInvalid: '',
                passwordInvalid: '',
                note: {
                    backgroundImage: "url(" + require("../../assets/images/background.jpg") + ")",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: '600px'
                }
            };
        },
        methods: {
            validateUserName() {
                if (this.loginForm.username.replace(/(^\s*)/g, "") === '') {
                    this.usernameInvalid = "用户名不能为空";
                    return false;
                }
                return true
            },
            validatePassword() {
                if (this.loginForm.password.replace(/(^\s*)/g, "") === '') {
                    this.passwordInvalid = "密码不能为空";
                    return false;
                }
                return true;
            },
            submitForm() {
                if (this.validateUserName() && this.validatePassword()) {
                    this.$api.login(this.loginForm).then(resp => {
                        this.$store.commit("isLogin", resp.data.token);
                        this.$store.commit("setUser", this.loginForm.username);
                        this.$store.commit("setRouterName",'ProjectList');
                        this.setLocalValue("token", resp.data.token);
                        this.setLocalValue("user", this.loginForm.username);
                        this.setLocalValue("routerName", 'ProjectList');
                        this.$router.push({name: 'ProjectList'});
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
