<template>
    <div>
        <!-- <van-row>
            <van-col span="5">span: 8</van-col>
            <van-col span="14">考考教育管理系统</van-col>
            <van-col span="5">span: 8</van-col>
        </van-row> -->
        <van-row type="flex" justify="space-between">
            <van-col span="2"></van-col>
            <van-col span="20">考考教育管理系统</van-col>
            <van-col span="2"></van-col>
        </van-row>
        <van-radio-group v-model="radio">
            <van-cell-group>
                <van-cell title="家长登录" clickable @click="radio = '1'">
                <van-radio name="1" />
                </van-cell>
                <van-cell title="老师登录" clickable @click="radio = '2'">
                <van-radio name="2" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
        <van-cell-group>
        <van-field
            v-model="username"
            required
            clearable
            @input="hao"
            label="用户名"
            right-icon="question-o"
            placeholder="请输入用户名"
            @click-right-icon="$toast('请输入用户名')"
        />
        <van-field
            v-model="password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
        />
        </van-cell-group>
        <div class="logincookie">
            <p>是否记住密码</p>
            <van-switch :value="checked" @input="onInput" />
        </div>
       <van-button class="headbox" size="large" round type="primary" @click="register" :loading="loading" loading-text="正在登陆">点击登录</van-button>

    </div>
</template>

<script>
import { Button } from 'vant';
import axios from'../axios.js'
import { Dialog } from 'vant';
import qs from 'qs'
import {setCookie,getCookie,delCookie} from '../cookie'
import { isNull } from 'util';
import { win32 } from 'path';
import CryptoJS from "crypto-js"

export default {
     data() {
        return {
            username:"",
            password:"",
            radio: '2',
            loading:false,
            hint:'',
            checked: true,
        }
    },
    created(){
        var user = [];
        user = JSON.parse(localStorage.getItem("user"));
        this.username = user
        if(unescape(getCookie("name")) == "null" ){
            console.log("没有获取到cookie")
            this.password = "";
        }else{
            console.log(unescape(getCookie("name")))
            this.password = unescape(getCookie("name"))

        }
        if(navigator.platform == "Win32"){
            // alert("你是电脑手机模拟器打开")
        }else{
            alert("你是手机打开")
        }
    },
    watch:{

    },
    mounted(){
        
        
    },
     methods: {
        onInput(checked){
            Dialog.confirm({
            title: '免登陆',
            message: "确定开启或关闭吗",
            cancelButtonText:"关闭",
            confirmButtonText:"开启",
            }).then(() => {
                console.log("成功")
                this.checked = true
            }).catch(() => {

                this.checked = false
                console.log("取消")
                delCookie( 'name');
            });
        },
        hao(){
            this.password = "";
            delCookie( 'name');
        },




        register(){
            if(this.password == [] || this.username == []){
                this.$toast('账号和密码不能为空');
            }else{  
                if(this.radio == 1){
                    this.loading = true
                    console.log("家长登录")
                    axios.post("login/parent_login",{"LoginMobile":this.username,"Passwd":this.password}).then(res =>{
                        console.log(res.data)
                        this.hint = res.data.msg
                        if(res.data.data.length === 0){
                            this.$toast.fail(this.hint)
                            this.loading = false
                        }else{
                            this.$router.push("statement")
                            sessionStorage.setItem("userinfo",JSON.stringify(res.data.data))
                            this.loading = false
                        }
                        
                    })
                }else{
                    
                    // this.loading = true
                    localStorage.setItem("user",JSON.stringify(this.username));
                    console.log("老师登录")
                    axios.post("login/teac_login",{"LoginMobile":this.username,"Passwd":this.password}).then(res =>{                        console.log(res.data)
                        this.hint = res.data.msg
                        if(res.data.data.length === 0){
                            this.$toast.fail(this.hint)   
                            this.loading = false
                        }else{
                            if(this.checked){
                                if(unescape(getCookie("name")) == "null" ){
                                    // console.log("没有获取到cookie")
                                    setCookie("name",this.password,365)
                                }else{
                                    
                                }
                            }else{
                                delCookie( 'name');
                            }
                            sessionStorage.setItem('userinfo',JSON.stringify(res.data.data));
                            sessionStorage.setItem('loged',true)
                            this.$router.push("learning")
                            this.loading = false
                        }
                    }) 
                }
            }
        },
    }
    
}
</script>

<style>
.logincookie{
    float: right;
}
.van-col {
    color: rgba(95, 99, 112, 0.678);
    font-size: 0.5rem;
    text-align: center;
}
.headbox{
    margin: 1rem 0rem;
    
}
.van-cell-group{
    margin: 1rem 0rem;
}
.van-cell{
    margin:0.3rem 0rem;
}
</style>
