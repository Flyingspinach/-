<template>
    <div>
        <div id="boxheadcontent" :style="{width: '100%', height: '500px'}"></div>
        <ul class="boxone" v-for="(value,index) in data" :key="index">
            <li>
                <div>名称：{{value.ExamTitle}}</div>
                <div class="boxtwo">类型：{{value.Type}}</div>
            </li>

            <li>平均分：{{value.avgScore}}&nbsp;&nbsp;&nbsp;&nbsp;
                最高分:{{value.maxScore}}&nbsp;&nbsp;&nbsp;&nbsp;
                日期:{{value.CreateTime}}
            </li>
            <li>
                年级：{{value.GradeName}}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;
                科目: {{value.SubjectName}}
                 <van-button @click="jump(value.AnswerSheetID)" class="three" round type="info" size="small" >查看考试详情</van-button>
            </li>
            <li class="Mars">
                <!-- 班级下载 -->
                <a v-if="conceal" class="Classtodownload" :href="'https://pro.myworldclassroom.com/kaokao/index.php/study/studyInfoExcel?SchoolID='+userinfo['SchoolID']+'&AnswerSheetID='+value.AnswerSheetID+'&ClassID='+class123+'&SubjectID='+subject+'&GradeID='+grade">
                    ↓  班级得分详情下载
                </a>
                <!-- 年级下载 -->
                <a v-else class="Classtodownload" :href="'https://pro.myworldclassroom.com/kaokao/index.php/study/studyExcel?SchoolID='+userinfo['SchoolID']+'&AnswerSheetID='+value.AnswerSheetID+'&SubjectID='+subject+'&GradeID='+grade">
                    ↓  年级得分详情下载
                </a>
            </li>
        </ul>
        <van-popup v-model="show">
            <van-loading style=" background-color: rgba(0,0,0,.7);" type="spinner" />
        </van-popup>
    </div>
</template>

<script>
import bus from '../bus.js'
import axios from '../axios.js'
import { truncate } from 'fs';
export default {
    data(){
        return{
            active:'0',
            show:false,
            titledata:"",
            data:[],
            threelevel:[],
            userinfo:[],
            grade:[],//年级
            class123:[],//班级
            subject:[],//科目
            conceal:true,
            topscore:[],
            lowgrade:[],
            time:[],
        }
    },
    created(){
        this.userinfo = JSON.parse(sessionStorage.getItem("userinfo"))
        //点击通过bus通信获取值
        bus.$on("cation",param=>{
            this.threelevel = param
            var array = []
            array = this.threelevel[2].code
            console.log(array)
            this.grade = array[0]+array[1]
            if(array[4] == 0){
                console.log("全部")
                this.class123 = array[5]-1
            }else{
                console.log("班级")
                this.class123 = array[4]+array[5]-1
            }
            this.subject = array[3]
            console.log(this.grade,this.subject,this.class123) 
            this.previous()
        })
        //无点击通过sessionStorage获取值
        this.threelevel = JSON.parse(sessionStorage.getItem("data"))
        var array = []
        array = this.threelevel
        console.log(array)
        this.grade = array[0]+array[1]
        if(array[4] == 0){
            console.log("全部")
            this.class123 = array[5]-1
        }else{
            console.log("班级")
            this.class123 = array[4]+array[5]-1
        }
        this.subject = array[3]
        console.log(this.grade,this.class123,this.subject) 
        this.previous()
    },
    beforeDestroy () {
        bus.$off('cation')
    },
    mounted(){
        this.drawLine()
    },
    methods:{
        drawLine(){
                // 基于准备好的dom，初始化echarts实例
                var boxheadcontent =  this.$echarts.init(document.getElementById('boxheadcontent'))
                // 绘制图表
                boxheadcontent.setOption({
                     title: {
                            text: '折线图堆叠'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['最高分','平均分']
                        },
                        grid: {
                            left: '3%',
                            right: '20%',
                            bottom: '3%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: this.time
                        },
                        yAxis: {
                            type: 'value'
                        },
                    series: [
                        {
                            name:"最高分",
                            data: this.topscore,
                            type: 'line'
                        },
                        {   
                            name:"平均分",
                            data: this.lowgrade,
                            type: 'line'
                        },
                    ]
                });
         },
        //跳转
        jump(val){
            console.log(val)
            this.$router.push({path:"Transcript",query:{AnswerSheetID:val}})
        },
        //往期学情
        previous(){
            this.topscore = [],
            this.lowgrade = [],
            this.time = [],
            this.show = true
            if(this.class123 == 0){
                this.data = []
                console.log("走年级")
                axios.get("/study/answerGrade?SchoolID="+this.userinfo["SchoolID"]+"&SubjectID="+this.subject+"&GradeID="+this.grade).then(res=>{
                    console.log(res.data)
                    res.data.data.list.forEach((item,i) => {
                        if(item.Type == 0){
                            item.Type = "考试"
                        }else{
                            item.Type = "作业"
                        }  
                        this.data.push(item)
                        this.time.push(item.CreateTime)
                        this.topscore.push(item.maxScore,)
                        this.lowgrade.push(item.avgScore,)
                        console.log(this.topscore)
                    });
                    console.log(this.time)
                    this.conceal = false
                    this.show = false
                    this.drawLine()
                })
            }else{
                this.data = []
                console.log("走班级")
                console.log(this.userinfo["SchoolID"],this.subject,this.grade,this.class123)
                axios.get("/study/answer?SchoolID="+this.userinfo["SchoolID"]+"&SubjectID="+this.subject+"&GradeID="+this.grade+"&ClassID="+this.class123).then(res=>{
                    console.log(res.data)
                    if(res.data.data.length == 0){
                        alert("暂无数据")
                    }else{
                        res.data.data.list.forEach((item,i) => {
                            if(item.Type == 0){
                                item.Type = "考试"
                            }else{
                                item.Type = "作业"
                            } 
                            this.data.push(item)
                            this.time.push(item.CreateTime)
                            this.topscore.push(item.maxScore,)
                            this.lowgrade.push(item.avgScore,)
                            console.log(this.topscore)
                            this.drawLine()
                        });
                    }
                    this.conceal = true
                    this.show = false
                })
            }
        }
    },  
}
</script>

<style>

</style>
