<template>
    <div>
        <van-tabs v-model="active">
            <van-tab title="成绩单">
                <div class="patriarchhead" >
                <div class="patriarchbox">成绩单</div>
                    <ul>
                        <li>
                            学校名称：
                            <span class="patriarchboxhead"> {{user.SchoolName}}</span>
                        </li>
                        <li>
                            考试日期：
                            <span class="patriarchboxhead"> {{userdata.CreateTime}}</span>
                        </li>
                        <li>
                            所属年级：
                            <span class="patriarchboxhead"> {{user.GradeName}}</span>
                        </li>
                        <li>
                            学生姓名：
                            <span class="patriarchboxhead"> {{userdata.studentName}}</span>
                        </li>
                        <li>
                            试卷名称：
                            <span class="patriarchboxhead"> {{userdata.ExamTitle}}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <ul class="patriarchtwo">
                        <li>科目</li>
                        <li>分数</li>
                        <li>班级</li>
                        <li>类型</li>
                    </ul>
                    <ul class="patriarchtwo">
                        <li>
                            {{userdata.subjectName}}
                        </li>
                        <li>
                            {{userdata.Score}}
                        </li>
                        <li>{{userdata.class}}班</li>
                        <li>{{userdata.Type}}</li>
                    </ul>
                </div>
                <van-button type="primary" size="large">点击退出</van-button>
            </van-tab>
            <van-tab title="历史成绩单">
                 <div class="patriarchhead" >
                <div class="patriarchbox">成绩单</div>
                    <ul>
                        <li>
                            学校名称：
                            <span class="patriarchboxhead"> {{user.SchoolName}}</span>
                        </li>
                        <li>
                            所属年级：
                            <span class="patriarchboxhead"> {{user.GradeName}}</span>
                        </li>
                        <li>
                            学生姓名：
                            <span class="patriarchboxhead"> {{userdata.studentName}}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <ul class="patriarchtwo">
                        <li>科目</li>
                        <li>分数</li>
                        <li>班级</li>
                        <li>类型</li>
                        <li>日期</li>
                        <li>试卷</li>
                    </ul>
                    <ul class="patriarchtwo" v-for="(value,index) in historydata" :key="index">
                        <li>
                            {{value.subjectName}}
                        </li>
                        <li>
                            {{value.Score}}
                        </li>
                        <li>{{value.class}}班</li>
                        <li>{{value.Type}}</li>
                        <li>{{value.CreateTime}}</li>
                        <li>{{value.ExamTitle}}</li>
                    </ul>
                </div>
                <van-button @click="exit" type="primary" size="large">点击退出</van-button>
            </van-tab>
        </van-tabs>
        
    </div>
</template>

<script>
import axios from '../../axios.js'
// import { constants } from 'fs';
export default {
    data(){
        return{
            user:[],
            userdata:[],
            active:"1",
            historydata:[],
        }
    },
    created(){
        this.user = JSON.parse(sessionStorage.getItem("userinfo"));
        
        this.request()
        this.history()
    },
    mounted(){

    },
    methods:{
        request(){
            axios.get("/student/newStudy?SchoolID="+this.user["SchoolID"]+"&StudentID="+this.user["StudentID"]).then(res=>{
                this.userdata = res.data.data
                if(res.data.data.Type == 0){
                    res.data.data.Type = "考试"
                }else{
                    res.data.data.Type = "作业"
                }
            })
        },
        history(){
            axios.get("/student/index?SchoolID="+this.user["SchoolID"]+"&StudentID="+this.user["StudentID"]).then(res=>{
                res.data.data.list.forEach((item,i)=>{
                    if(item.Type == 0){
                        item.Type = "考试"
                    }else{
                        item.Type = "作业"
                    }
                    this.historydata.push(item)
                })
                console.log(this.historydata)
            })
        },
        exit(){
            sessionStorage.removeItem("userinfo");
            this.$router.push("/");
        },
    },
}
</script>

<style>

</style>
