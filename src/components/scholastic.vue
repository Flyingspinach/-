<template>
    <div>
        <form action="/">
        <van-search
            :class="{'hasFixed': needFixed == true}"
            v-model="value"
            placeholder="请输入搜索关键词"
            show-action
            @search="onSearch"
            @cancel="onCancel"
        />
        </form>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <ul class="scholasti">
                <li  @click="particulars(value.StudentID)"  v-for="(value,index) in studentdata " :key="index"> 
                    <div>
                    <img src="../images/logo.png">
                    </div>
                    <p>姓名:{{value.StudentName}}</p>
                    <p>学号:{{value.StudentID}}</p>
                    <!-- <van-button class="scholastichead"type="info" size="small" round>查看考试信息</van-button> -->
                </li>
            </ul>
        </van-pull-refresh>
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
import axios from '../../src/axios.js'
import bus from '../bus.js'
import { truncate } from 'fs';
import { userInfo } from 'os';
export default {
    data(){
        return{
            count: 0,
            isLoading: false,
            studentdata:[],
            value:'',
            threelevel:[],
            userinfo:[],
            grade:[],//年级
            class123:[],//班级
            subject:[],//科目
            currentPage:0,
            pages:1,
            show:false,
            needFixed:[],
        }
    },
    created(){
        this.show = true
        this.userinfo = JSON.parse(sessionStorage.getItem("userinfo"))
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
        this.Studentsrequest()
    },
    beforeDestroy () {
        bus.$off('a2')
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    mounted(){
        bus.$on("a2",param=>{
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
            this.Studentsrequest()
        })
        window.addEventListener('scroll', this.handleScroll)
    },
    methods: {
        handleScroll() {
            
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            console.log(scrollTop)
            if (scrollTop > 200) {
                this.needFixed = true;
            } else {
                this.needFixed = false;
            }
        },
        onRefresh() {
            setTimeout(() => {
                    this.$toast('刷新成功');
                    this.isLoading = false;
                    this.count++;
                }, 500);
        },
        //学生请求
        Studentsrequest(){
            this.show = true
            this.studentdata = []
            if(this.class123 == 0){
                console.log("年级学生追踪")
                axios.get("/teacher/gradeStudentStudy?SchoolID="+this.userinfo["SchoolID"]+"&GradeID="+this.grade+"&SubjectID="+this.subject).then(res=>{
                    console.log(res.data)
                    this.studentdata = res.data.data.list
                    this.currentPage = res.data.data.pageNum
                    this.pages = res.data.data.pages
                    this.show = false
                })
            }else{
                console.log("班级学生追踪")
                //班级学生追踪
                axios.get("teacher/studentStudy?SchoolID="+this.userinfo["SchoolID"]+"&GradeID="+this.grade+"&SubjectID="+this.subject+"&ClassID="+this.class123).then(res=>{
                    console.log(res.data)
                    this.studentdata = res.data.data.list
                    this.currentPage = res.data.data.pageNum
                    this.pages = res.data.data.pages
                    this.show = false
                })
            }
        },  
        //分页导航
        request(val){
            this.show = true
            this.studentdata = []
            if(this.class123 == 0){
                axios.get("/teacher/gradeStudentStudy?SchoolID="+this.userinfo["SchoolID"]+"&GradeID="+this.grade+"&SubjectID="+this.subject+"&pageNum="+val).then(res=>{
                    console.log(res.data)
                    this.studentdata = res.data.data.list
                    this.currentPage = res.data.data.pageNum
                    this.pages = res.data.data.pages
                    this.show = false
                })
            }else{
                //班级学生追踪
                axios.get("teacher/studentStudy?SchoolID="+this.userinfo["SchoolID"]+"&GradeID="+this.grade+"&SubjectID="+this.subject+"&ClassID="+this.class123+"&pageNum="+val).then(res=>{
                    console.log(res.data)
                    this.studentdata = res.data.data.list
                    this.currentPage = res.data.data.pageNum
                    this.pages = res.data.data.pages
                    this.show = false
                })
            }
        },
        //查看考试详情
        particulars(val){
            
            this.$router.push({path:"Student",query:{StudentID:val}})
        },
        //成功按钮
        onSearch(val){
            console.log(val)
            console.log(this.subject)
            this.show = true
            if(this.class123 == 0){
                //年级学生追踪模糊查询
                if(Number.isNaN(Number(val))){
                    axios.get("/teacher/gradeStudentStudyLike?SchoolID="+this.userinfo["SchoolID"]+"&GradeID="+this.grade+"&SubjectID="+this.subject+"&StudentName="+val).then(res=>{
                        console.log(res.data)
                        this.studentdata = res.data.data.list
                        this.currentPage = res.data.data.pageNum
                        this.pages = res.data.data.pages
                        this.show = false
                    })
                }else{
                    axios.get("/teacher/gradeStudentStudyLike?SchoolID="+this.userinfo["SchoolID"]+"&GradeID="+this.grade+"&SubjectID="+this.subject+"&StudentID="+val).then(res=>{
                        console.log(res.data)
                        this.studentdata = res.data.data.list
                        this.currentPage = res.data.data.pageNum
                        this.pages = res.data.data.pages
                        this.show = false
                    })
                }
            }else{
                //班级学生追踪模糊查询
                if(Number.isNaN(Number(val))){
                    console.log("是文字")
                    axios.get("/teacher/studentStudyLike?SchoolID="+this.userinfo["SchoolID"]+"&GradeID="+this.grade+"&SubjectID="+this.subject+"&ClassID="+this.class123+"&StudentName="+val).then(res=>{
                        console.log(res.data)
                        this.studentdata = res.data.data.list
                        this.currentPage = res.data.data.pageNum
                        this.pages = res.data.data.pages
                        this.show = false
                    })
                }else{
                    console.log("是数字")
                    axios.get("/teacher/studentStudyLike?SchoolID="+this.userinfo["SchoolID"]+"&GradeID="+this.grade+"&SubjectID="+this.subject+"&ClassID="+this.class123+"&StudentID="+val).then(res=>{
                        console.log(res.data)
                        this.studentdata = res.data.data.list
                        this.currentPage = res.data.data.pageNum
                        this.pages = res.data.data.pages
                        this.show = false
                    })
                }
            }
            
            
        },
        //取消按钮
        onCancel(){
            console.log(this.value)
        }
    }
}
</script>

<style>
/* .scholasti li:nth-child(2n+1){
    margin-bottom:-42px;
} */
</style>
