<template>
    <div>
       <ul class="boxone" v-for="(value,index) in data" :key="index">
            <li>
                <!-- <div class="boxtwo">{{value.Type}}</div> -->
                姓名：{{value.StudentName}}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;
                日期:{{value.CreateTime}}
            </li>

            <li>
                名称:{{value.ExamTitle}}
            </li>
            <li>
                年级：{{value.gradeName}}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                科目: {{value.subjectName}}
                 <!-- <van-button @click="jump(value.AnswerSheetID)" class="three" round type="info" size="small" >查看考试详情</van-button> -->
            </li>          
            <li class="justice" style="font-size: 1rem;">
                分数:{{value.Score}}
            </li>  
        </ul>
    </div>
</template>

<script>
import axios from '../axios.js'
export default {
    data(){
        return{
            StudentID:[],
            userInfo:[],
            threelevel:[],
            grade:[],
            class123:[],
            subject:[],
            data:[],
        }
    },
    created(){
        this.StudentID = this.$route.query.StudentID
        this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
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
        this.beg()
    },
    methods:{
        beg(){
            if(this.class123 == 0){
                //年级学生追踪
                axios.get("/study/gradeStudentStudy?SchoolID="+this.userInfo["SchoolID"]+"&StudentID="+this.StudentID+"&GradeID="+this.grade+"&SubjectID="+this.subject).then(res=>{
                    console.log(res.data)
                    this.data = res.data.data.list
                })
            }else{
                //班级学生追踪
                axios.get("/study/studentStudy?SchoolID="+this.userInfo["SchoolID"]+"&StudentID="+this.StudentID+"&GradeID="+this.grade+"&ClassID="+this.class123+"&SubjectID="+this.subject).then(res=>{
                    console.log(res.data)
                    this.data = res.data.data.list
                })
            }
        }
    },
}
</script>

<style>

</style>
