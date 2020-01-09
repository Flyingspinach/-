<template>
    <div>
        <van-notice-bar mode="closeable">
        热列欢迎: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{userInfo["UserName"]}}老师,登录考考教育管理系统，即将展示你所管理的班级（不喜欢可以去掉或者更换）
        </van-notice-bar>                                                   
        <van-button type="info" size="large" @click="vanish">{{Gradegrade}}/{{Gradesubject}}/{{GradeClass}}</van-button>
        <van-popup v-model="show" position="bottom" :overlay="true">
            <van-area @confirm="affirm" @cancel="cancel" :area-list="areaList" :loading="loading" 
             :value="threelevel"  
             title="请选择" />
        </van-popup>
        <van-tabbar v-model="active">
            <van-tabbar-item icon="home-o" to="learning">
                            学情报告
            </van-tabbar-item>
            <van-tabbar-item icon="search" to="previous">
                            往期学期
            </van-tabbar-item>
            <van-tabbar-item icon="friends-o" to="scholastic">
                            学生追踪
            </van-tabbar-item>
            <van-tabbar-item icon="setting-o" to="mine">
                            我的管理
            </van-tabbar-item> 
        </van-tabbar>
        <router-view></router-view>

    </div>
</template>

<script>
import axios from '../axios'
import bus from '../../src/bus.js'
import { DropdownMenu, DropdownItem } from 'vant'
import { constants } from 'fs';
import { parse } from 'path';
export default {
    component:{
        
    },
    data() {
        return {
            Gradesubject:'',
            GradeClass:'班级',
            Gradegrade:'年级',
            active: 0,
            userInfo:[],
            value1: 0,
            value2: 1,
            value3: "a",
            show:false,
            query:[],
            loading:false,
            val:[],
            areaList:{
                province_list:{
                    // 100000:'高一',
                    // 110000: '北京市',
                    // 120000: '天津市'
                },
                city_list:{
                    // 100500:"化学",
                    // 110100:"全部级",
                    // 110100: '北京市',
                    // 110200: '县',
                    // 120100: '天津市',
                    // 120200: '县'
                },
                county_list:{
                    // 100502:"1班",
                    // 100506:"2班",
                    // 100519:"3班",
                    // 110105:"全班级",
                    // 110109:"全部班",
                    // 110116:"全部班级",
                    // 110004:"全部班级",
                    // 110101: '东城区',
                    // 110102: '西城区',
                    // 110105: '朝阳区',
                    // 110106: '丰台区',
                    // 120101: '和平区',
                    // 120102: '河东区',
                    // 120103: '河西区',
                    // 120104: '南开区',
                    // 120105: '河北区',
                },
            },
            threelevel:" ",
            gradeIdata:[],
            classdata: [],
            Subject:[],
            datareception:[],

        }
    },
    created(){
        this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"))
        // this.box1()
        this.sanji1()
        this.sanji()
        
    },
    watch:{

    },
    // beforeRouteEnter(){
    //     // bus.$off("communication")
    // },
    mounted(){
        //年级bus接受
        bus.$on("send",param=>{
            console.log("触发年级通信")
            console.log(param)
            this.datareception = param
            param.forEach((item,i)=>{
                this.Gradegrade = item.GradeName
                // this.Gradesubject = item.SubjectName
                if(this.Gradesubject == ''){
                    this.Gradesubject = item.SubjectName
                }else{
                    
                }
                this.GradeClass = '全部班级'
            })
        })
        //班级bus接受
        bus.$on("sendclass",param=>{
            console.log(param)
            console.log(param["a"])
            this.threelevel = "";
            var arr = [];
            var test = [];
            var classdata = [];
            console.log("触发班级通信")
            if(param["a"][0].GradeID > 9){
                this.threelevel = param["a"][0].GradeID+"0"+param["a"][0].SubjectID+param["c"]
            }else{
                this.threelevel = param["a"][0].GradeID+"00"+param["a"][0].SubjectID+param["c"]
            }
            param["a"].forEach((item,i)=>{
                this.Gradegrade = item.GradeName           
                if(this.Gradesubject == ''){
                    this.Gradesubject = item.SubjectName
                }else{

                } 
            })
            this.GradeClass = param["b"]+"班"
            console.log(this.threelevel)
            sessionStorage.setItem("data",JSON.stringify(this.threelevel))
            console.log("触发班级后的bus通信")
            bus.$emit("communication",this.threelevel)
        })
    },
    methods:{
        vanish(){
            this.show = true
        },
        affirm(val){   
            this.show = false
            this.val = val
            this.Gradegrade = val[0].name
            this.Gradesubject = val[1].name
            this.GradeClass = val[2].name
            bus.$emit('cation',this.val)
            bus.$emit("a1",this.val[2].code)//学情报告
            bus.$emit("a2",this.val)
            bus.$emit("a3",this.val)
            sessionStorage.setItem("data",JSON.stringify(val[2].code))
        },
        beforeDestory(){
            
        },

        cancel(){
            this.show = false
        },
        add(e){
            return Number(e)+1
        },
        sanji(){
            //年级
            axios.get("/teacher/gradeInfo?SchoolID="+this.userInfo['SchoolID']+"&GradeClassIDs="+this.userInfo["GradeClassIDs"]).then(res=>{
                this.gradeIdata = res.data.data
                var a=0;
                var b=0;
                for(let i in this.gradeIdata){
                    a++
                    this.gradeIdata[i].forEach((item,i) => {
                        //循环年级id去请求班级
                        
                        axios.get("/teacher/classInfo?SchoolID="+this.userInfo["SchoolID"]+"&gradeId="+item.GradeID+"&UserID="+this.userInfo["UserID"]).then(head=>{
                            b++
                            console.log(head.data)
                            this.classdata = head.data.data
                                this.Subject.forEach((box,i)=>{
                                    this.areaList.city_list[item.GradeID+"0"+box.SubjectID+"00"] = box.SubjectName
                                        this.classdata.forEach((head,i)=>{
                                            if(head.clsddId == 0){
                                                    // this.threelevel = "100101"
                                                    this.areaList.county_list[item.GradeID+"0"+box.SubjectID+"01"] = "全部班级" 
                                                }else{
                                                    this.loading = false
                                                    if(Number(head.clsddId)<9){
                                                        
                                                        this.areaList.county_list[item.GradeID+"0"+box.SubjectID+"0"+this.add(head.clsddId)] = head.clsddId+"班"
                                                    }else{
                                                        this.areaList.county_list[item.GradeID+"0"+box.SubjectID+this.add(head.clsddId)] = head.clsddId+"班"
                                                    }
                                                }
                                        })
                            })
                            console.log("查看循环")
                            if(item.GradeID < 9){
                                this.areaList.province_list[item.GradeID+"00000"] = item.GradeName
                            }else{
                                this.areaList.province_list[item.GradeID+"0000"]= item.GradeName
                            }
                            if(a === b){
                                // console.log("最后一次循环")
                                this.calculate()
                            }
                        })
                        
                    });
                    
                
                }
            })
            
            
        },
        sanji1(){
            //科目
            axios.get("/teacher/subject?SchoolID="+this.userInfo["SchoolID"]+"&SubjectIDs="+this.userInfo["SubjectIDs"]).then(box=>{
                this.Subject = box.data.data
            })
        },
        calculate(){
            var test = []; 
            test = JSON.parse(sessionStorage.getItem("data"))
            var arr = [];
            for(let i in this.areaList.county_list){
                arr.push(i)
            }
            console.log(arr)
            if(arr[0] == 100101){
                bus.$emit("demo",arr[1])
                
            }else{
                bus.$emit("demo",arr[0])
            }
            
            console.log("开始存入数据")
            console.log(this.areaList)
            console.log(this.threelevel)
            this.threelevel = arr[1]
            // if(test=== null){
            //     // bus.$emit("demo",arr[1])
                
            // }else{
            //     // bus.$emit("demo",arr[0])
            // }
        },
    }
}
</script>

<style>

</style>
