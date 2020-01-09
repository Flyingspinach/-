<template>
    <div>
        <ul class="learningtwo">
            <li>学号</li>
            <li>姓名</li>
            <li>科目</li>
            <li>分数</li>
            <li>排名</li>
            <li>类型</li>
        </ul>     
        <ul class="learningtwocontent" v-for="(value,index) in Resultsdata" :key="index">
            
            
            <li>{{value.StudentID}}</li>
            <li>{{value.StudentName}}</li>
            <li>{{value.SubjectName}}</li>
            <li>{{value.Score}}</li>
            <li>{{value.Ranking}}</li>
            <li>{{value.Type}}</li>
        </ul>
        <div class="learningtwo1">
            <van-pagination 
            v-model="currentPage" 
            :page-count="pages"
            mode="simple" 
            @change="request"
            />
        </div>
        <van-popup v-model="show">
            <van-loading style=" background-color: rgba(0,0,0,.7);" type="spinner" />
        </van-popup>
    </div>
</template>

<script>
import bus from '../bus.js'
import axios from '../axios.js'
import { constants } from 'fs';
export default {
    data(){
        return{
            show:false,
            AnswerSheetID:[],
            userInfo:[],
            threelevel:[],
            grade:[],
            class123:[],
            subject:[],
            currentPage: 0,
            pages:1,
            activeName: '1',
            Resultsdata:[],
            StudentID:[],
            
        }
    },
    created(){  
        this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
        this.AnswerSheetID = this.$route.query.AnswerSheetID
        bus.$on("a3",param=>{
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
            this.Thelatestdetails()
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
        this.Thelatestdetails()
    },
    beforeDestroy () {
        bus.$off('a3')
    },
    methods:{
        Thelatestdetails(){
                this.Resultsdata = []
                this.show = true
                if(this.class123 == 0){
                    //年级成绩单
                    console.log(this.userInfo["SchoolID"],this.subject,this.AnswerSheetID,this.grade)
                    axios.get("/teacher/gradeStudentInfoMassion?SchoolID="+this.userInfo["SchoolID"]+"&SubjectID="+this.subject+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade).then(res=>{
                        console.log(res.data)
                        this.currentPage = res.data.data.pageNum
                        this.pages = res.data.data.pages
                        res.data.data.list.forEach((item,i) => {
                            if(item.Type == 0){
                                item.Type = "考试"
                            }else{
                                item.Type = "练习"
                            }
                            this.Resultsdata.push(item)
                        });
                    this.show = false
                    })
                }else{
                    //班级成绩单
                    axios.get("teacher/studentInfoMassion?SchoolID="+this.userInfo["SchoolID"]+"&ClassID="+this.class123+"&SubjectID="+this.subject+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade).then(res=>{
                        console.log(res.data)
                        this.currentPage = res.data.data.pageNum
                        this.pages = res.data.data.pages
                        res.data.data.list.forEach((item,i) => {
                            if(item.Type == 0){
                                item.Type = "考试"
                            }else{
                                item.Type = "练习"
                            }
                            this.Resultsdata.push(item)
                        });
                        this.show = false
                        console.log(this.Resultsdata)
                    })
                }
            
            
        },
        //分页导航
        request(val){
            console.log(val)
            this.Resultsdata = []
            this.show = true
            if(this.class == 0){
                console.log("走年级")
                axios.get("/teacher/gradeStudentInfoMassion?SchoolID="+this.userInfo["SchoolID"]+"&SubjectID="+this.subject+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade+"&pageNum="+val).then(res=>{
                    console.log(res.data)
                    this.currentPage = res.data.data.pageNum
                    this.pages = res.data.data.pages
                    res.data.data.list.forEach((item,i) => {
                        if(item.Type == 0){
                            item.Type = "考试"
                        }else{
                            item.Type = "练习"
                        }
                        this.Resultsdata.push(item)
                    });
                    console.log(this.Resultsdata)
                    this.show = false
                })
            }else{
                console.log("走班级")
                axios.get("teacher/studentInfoMassion?SchoolID="+this.userInfo["SchoolID"]+"&ClassID="+this.class123+"&SubjectID="+this.subject+"&AnswerSheetID="+this.AnswerSheetID+"&GradeID="+this.grade+"&pageNum="+val).then(res=>{
                    console.log(res.data)
                    this.currentPage = res.data.data.pageNum
                    this.pages = res.data.data.pages
                    res.data.data.list.forEach((item,i) => {
                        if(item.Type == 0){
                            item.Type = "考试"
                        }else{
                            item.Type = "练习"
                        }
                        this.Resultsdata.push(item)
                    });
                    this.show = false
                    console.log(this.Resultsdata)
                })
            }
        }
    }
}
</script>

<style>

</style>
