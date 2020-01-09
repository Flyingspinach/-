<template>
    <div>
        <!-- <van-button type="primary" @click="box">选择年级</van-button>
        <van-popup v-model="show" position="bottom" :overlay="true">
            <van-picker
                v-show="index"
                show-toolbar
                title="标题"
                :columns="columns"
                @cancel="onCancel"
                @confirm="onConfirm"
                />
        </van-popup> -->
        
        <van-tabs v-model="active"  type="card" @click="onClick" color="#1989fa">
            <van-tab title="最新学情报告">
                
                <ul class="learninghead" v-for="(value,index) in latestdata" :key="index" >
                    <h2 class="learningheadconten">{{value.ExamTitle}}</h2>
                    <li>日期:{{value.CreateTime}}</li>
                    <li>类型:{{value.Type}}</li>
                    <li>年级:{{value.GradeName}}</li>
                    <li>科目:{{value.SubjectName}}</li>
                    <li>平均分:{{value.avgScore}}</li>
                    <li>最高分:{{value.maxScore}}</li>
                    <li v-show="vanish" style="float: right;">
                        <!-- 班级下载 -->
                        <a icon="bag-o" v-if="conceal" class="Classtodownload" :href="'https://pro.myworldclassroom.com/kaokao/index.php/study/studyInfoExcel?SchoolID='+userinfo['SchoolID']+'&AnswerSheetID='+value.AnswerSheetID+'&ClassID='+class123+'&SubjectID='+subject+'&GradeID='+grade">
                            ↓   得分详情下载
                        </a>
                        <!-- 年级下载 -->
                        <a v-else class="Classtodownload" :href="'https://pro.myworldclassroom.com/kaokao/index.php/study/studyExcel?SchoolID='+userinfo['SchoolID']+'&AnswerSheetID='+value.AnswerSheetID+'&SubjectID='+subject+'&GradeID='+grade">
                            ↓   得分详情下载
                        </a>
                    </li>
                </ul>
            </van-tab>
            <van-tab title="成绩单">
                <div class="insertion">
                <ul class="learningtwo">
                    <li>学号</li>
                    <li>姓名</li>
                    <li>分数</li>
                    <li>排名</li>
                    <li>类型</li>
                </ul>
                <ul class="learningtwocontent" v-for="(value,index) in Transcriptdata" :key="index">
                    <li>{{value.StudentID}}</li>
                    <li>{{value.StudentName}}</li>
                    <li>{{value.Score}}</li>
                    <li>{{value.Ranking}}</li>
                    
                    <li>{{value.Type}}</li>
                </ul>
                </div>
                <div class="learningtwo1">
                    <van-pagination 
                        v-model="currentPage" 
                        :page-count="pages"
                        @change="pagesrequest"
                        mode="simple" 
                        />
                </div>
            </van-tab>
            <van-tab title="学生分层">
                <div class="learningthree">
                    <ul>
                        <li>优等:{{pupildata.good}}</li>
                        <li>较差:{{pupildata.poor}}</li>
                        <li>中等:{{pupildata.second}}</li>
                    </ul>
                </div>
            </van-tab>
            <van-tab title="得分趋势图">
                <div id="boxheadcontent" :style="{width: '100%', height: '500px'}"></div>
            </van-tab>
        </van-tabs>
        <van-popup v-model="show">
            <van-loading style=" background-color: rgba(0,0,0,.7);" type="spinner" />
        </van-popup>
    </div>
</template>

<script>
import axios from '../axios'
import bus from '../bus.js'
import { truncate, constants, truncateSync } from 'fs';
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            active:' ',
            columns: [],
            columns1:[],
            show:false,
            latestdata:[],
            Transcriptdata:[],
            currentPage:5,
            pages:0,
            pupildata:[],
            //处理数据
            threelevel:[],
            userinfo:[],
            grade:[],//年级
            class123:[],//班级
            subject:[],//科目
            AnswerSheetID:[],//试卷id
            conceal:true,
            exsclass:[],
            exsgrade:[],
            TS:[],
            invoking:[],
            vanish:true,
        }
    },
    created(){
        
        this.show = true
        this.userinfo = JSON.parse(sessionStorage.getItem("userinfo"))
        this.threelevel = JSON.parse(sessionStorage.getItem("data"))
        if(this.threelevel == null){
            
        }else{
            console.log(this.threelevel)
            var param = [];
            param = this.threelevel
            var a = [];
            a = param[0]+param[1]
            if(a > 9){
                this.grade = param[0]+param[1]
            }else{
                this.grade = param[0]
            }
            if(param[4] == 0){
                this.class123 = param[5]-1
            }else{
                this.class123 = param[4]+param[5]-1
            }
            this.subject = param[3]
            this.Gradebus()
        }
        //点击选项在执行
        bus.$on("a1",param=>{
            console.log("触发a1bus同学")
            console.log(param)
            var a = [];
            a = param[0]+param[1]
            if(a > 9){
                this.grade = param[0]+param[1]
            }else{
                this.grade = param[0]
            }
            if(param[4] == 0){
                this.class123 = param[5]-1
            }else{
                this.class123 = param[4]+param[5]-1
            }
            this.subject = param[3]
            console.log(this.class123)
            console.log(this.subject)
            this.Gradebus()
            
        })
        
        
    },
    watch:{
        
    },
    mounted(){
        // 点击通过bus通信来执行
        bus.$on("demo",param=>{
            console.log(param)
            this.show = true
            var array = []
            array = param
            this.TS = array[4]+array[5]
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
            this.Thelatestdetails()
        })  
        bus.$on("communication",param=>{
            console.log(param)
            var a = [];
            a = param[0]+param[1]
            if(a > 9){
                this.grade = param[0]+param[1]
            }else{
                this.grade = param[0]
            }
            if(param[4] == 0){
                this.class123 = param[5]-1
            }else{
                this.class123 = param[4]+param[5]-1
            }
            this.subject = param[3]
            console.log(this.subject)
            this.Transcript()
            this.pupilquest()
            this.topscore()
        })
    },
    beforeDestroy () {
        bus.$off('a1')
        bus.$off('demo')
        bus.$off('send')
        bus.$off('communication')
    },
    methods:{
        Gradebus(){
            this.exsclass = [];
            this.show = true
            this.latestdata = [];
            if(this.class123 === 0){
                console.log("年级最新学情")
                axios.get("/study/newestGradeStudy?SchoolID="+this.userinfo["SchoolID"]+"&UserID="+this.userinfo["UserID"]).then(res=>{
                    console.log(res.data)
                    this.AnswerSheetID = res.data.data[0].AnswerSheetID
                    this.latestdata = res.data.data
                    res.data.data.forEach((item,i)=>{
                        if(item.Type == '0'){
                            item.Type = "考试"
                        }else{
                            item.Type = "作业"
                        }
                        if(item.maxScore == 0){
                            this.vanish = false
                        }else{
                            this.vanish = true
                        }
                        this.exsclass.push(item.SubjectName,item.avgScore,item.maxScore)
                    })
                    this.show = false
                    this.conceal = false
                    this.Transcript()
                    this.pupilquest()
                    this.topscore()
                    })
            }else{
                axios.get("/study/newestStudy?SchoolID="+this.userinfo["SchoolID"]+"&UserID="+this.userinfo["UserID"]+"&ClassID="+this.class123).then(res=>{
                    console.log(res.data)
                    this.AnswerSheetID = res.data.data[0].AnswerSheetID
                    console.log(this.AnswerSheetID)
                    this.latestdata = res.data.data
                    res.data.data.forEach((item,i)=>{
                        if(item.Type == '0'){
                            item.Type = "考试"
                        }else{
                            item.Type = "作业"
                        }
                        if(item.maxScore == 0){
                            this.vanish = false
                        }else{
                            this.vanish = true
                        }
                        this.exsclass.push(item.SubjectName,item.avgScore,item.maxScore)
                    })
                    this.conceal = true
                    this.Transcript()
                    this.pupilquest()
                    this.topscore()
                    
                })
                console.log(this.exsclass)
            }
        },
        onClick(val){
            console.log(val)
            this.invoking = val
            if(val == 3){
                setTimeout(()=>{
                    this.drawLine();
                },500)
            }
        },
        drawLine(){
                // 基于准备好的dom，初始化echarts实例
                var boxheadcontent =  this.$echarts.init(document.getElementById('boxheadcontent'))
                // 绘制图表
                boxheadcontent.setOption({
                    legend: {},
                    tooltip: {},
                    dataset: {
                        source: [
                            ['product', '平均分','最高分',],
                            this.exsclass,
                            this.exsgrade,
                        ]
                    },
                    xAxis: {type: 'category'},
                    yAxis: {},
                    series: [
                        {type: 'bar'},
                        {type: 'bar'},
                    ]
                });
                
         },
        
        
        //年级学情报告
        one(){
            this.latestdata = [];
            console.log("最先执行我")
            axios.get("/study/newestGradeStudy?SchoolID="+this.userinfo["SchoolID"]+"&UserID="+this.userinfo["UserID"]).then(res=>{
                console.log(res.data)
                this.AnswerSheetID = res.data.data[0].AnswerSheetID
                this.latestdata = res.data.data
                res.data.data.forEach((item,i)=>{
                    if(item.Type == '0'){
                        item.Type = "考试"
                    }else{
                        item.Type = "作业"
                    }
                    if(item.maxScore == 0){
                        this.vanish = false
                    }else{
                        this.vanish = true
                    }
                    this.exsclass.push(item.SubjectName,item.avgScore,item.maxScore)
                })
                
                this.show = false
                this.conceal = false
                //需要展示默认班级bus发送数据过去
                bus.$emit("send",res.data.data)
            })
        },
        //班级学情报告
        two(){
            //班级最新学情报告
            console.log(this.class123)
            this.exsclass = [];
            this.show = true
            axios.get("/study/newestStudy?SchoolID="+this.userinfo["SchoolID"]+"&UserID="+this.userinfo["UserID"]+"&ClassID="+this.class123).then(res=>{
                console.log(res.data)
                this.AnswerSheetID = res.data.data[0].AnswerSheetID
                this.latestdata = res.data.data
                res.data.data.forEach((item,i)=>{
                    if(item.Type == '0'){
                        item.Type = "考试"
                    }else{
                        item.Type = "作业"
                    }
                    if(item.maxScore == 0){
                        this.vanish = false
                    }else{
                        this.vanish = true
                    }
                    this.exsclass.push(item.SubjectName,item.avgScore,item.maxScore)
                })
                this.conceal = true
                var a = this.latestdata;
                var b = this.class123;
                var c = this.TS
                console.log(this.latestdata)
                //需要展示默认班级bus发送数据过去
                bus.$emit("sendclass",{a,b,c})
            })
        },
        
        //最新详情请求
        Thelatestdetails(){
            this.latestdata = [];
            if(this.class123 == 0){
                    console.log("走年级")
                    this.one();
            }else{
                    console.log("走班级")
                    this.two();
            }
        },
        //年级最高分和最低分
        topscore(){
            this.exsgrade = [];
            this.exsgrade = ["年级"]
            axios.get("/study/classScore?SchoolID="+this.userinfo['SchoolID']+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade+"&SubjectID="+this.subject).then(res=>{
                for(let i in res.data.data){
                    this.exsgrade.push(res.data.data[i])
                    // this.exsgrade = res.data.data[i]
                    console.log(res.data.data[i])
                }
                // this.drawLine()
                if(this.invoking == 3){
                    this.drawLine();
                }
                console.log(this.exsgrade)
            })
        },
        //成绩单请求
        Transcript(){
            if(this.class123 == 0){
                console.log("成绩单走年级")
                console.log(this.userinfo["SchoolID"],this.subject,this.grade,this.AnswerSheetID)
                axios.get("/teacher/gradeStudentInfoMassion?SchoolID="+this.userinfo["SchoolID"]+"&SubjectID="+this.subject+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade).then(res=>{
                    console.log(res.data)
                    this.pages = res.data.data.pages
                    this.currentPage = res.data.data.pageNum
                    if(res.data.data.list.length == 0){
                        this.Transcriptdata = [];
                    }else{
                        // console.log(this.Transcriptdata)
                        this.Transcriptdata = [];
                        res.data.data.list.forEach((item,i)=>{
                            if(item.Type == "0"){
                                item.Type = "考试"
                            }else{
                                item.Type = "练习"
                            }
                            this.Transcriptdata.push(item)
                        })
                        this.show = false
                    }
                    
                })  
            }else{
                
                console.log("成绩单走班级")
                console.log(this.userinfo["SchoolID"],this.class123,this.subject,this.AnswerSheetID,this.grade)
                axios.get("/teacher/studentInfoMassion?SchoolID="+this.userinfo["SchoolID"]+"&ClassID="+this.class123+"&SubjectID="+this.subject+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade).then(res =>{
                    console.log(res.data)
                    this.pages = res.data.data.pages
                    this.currentPage = res.data.data.pageNum
                    this.Transcriptdata = [];
                    res.data.data.list.forEach((item,i)=>{
                        if(item.Type == "0"){
                            item.Type = "考试"
                        }else{
                            item.Type = "联系"
                        }
                        this.Transcriptdata.push(item)
                    })
                    this.show = false
                    console.log(this.Transcriptdata)
                })
            }
            
        },
        //学生分层请求
        pupilquest(){
  
            this.pupildata = []
            if(this.class123 == 0){
                //年级学生分层
                // console.log("学生分层走年级")
                axios.get("study/layerGradesStudent?SchoolID="+this.userinfo["SchoolID"]+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade+"&SubjectID="+this.subject).then(res=>{
                    // console.log(res.data)
                    this.pupildata = res.data.data
                    
                })
            }else{
                //班级学生分层
                axios.get("study/layerStudent?SchoolID="+this.userinfo["SchoolID"]+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade+"&SubjectID="+this.subject+"&ClassID="+this.class123).then(res=>{
                    this.pupildata = res.data.data
                })
            }
        },
        //分页请求
        pagesrequest(val){
            this.show = true
            this.Transcriptdata = []
            if(this.class123 == 0){
                //走年级借口
                axios.get("/teacher/gradeStudentInfoMassion?SchoolID="+this.userinfo["SchoolID"]+"&SubjectID="+this.subject+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade+"&pageNum="+val).then(res=>{
                    // console.log(res.data)
                    this.pages = res.data.data.pages
                    this.currentPage = res.data.data.pageNum
                    res.data.data.list.forEach((item,i)=>{
                        if(item.Type == "0"){
                            item.Type = "考试"
                        }else{
                            item.Type = "联系"
                        }
                        this.Transcriptdata.push(item)
                    })
                    this.show = false
                })
            }else{
                //走班级借口
                axios.get("/teacher/studentInfoMassion?SchoolID="+this.userinfo["SchoolID"]+"&ClassID="+this.class123+"&SubjectID="+this.subject+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade+"&pageNum="+val).then(res=>{
                    // console.log(res.data)
                    this.pages = res.data.data.pages
                    this.currentPage = res.data.data.pageNum
                    res.data.data.list.forEach((item,i)=>{
                        if(item.Type == "0"){
                            item.Type = "考试"
                        }else{
                            item.Type = "联系"
                        }
                        this.Transcriptdata.push(item)
                    })
                    this.show = false
                })
            }
            
        }   
        
    }
}
</script>

<style>

</style>
