<template>
    <div>
        <van-button type="warning" size="large" @click="logout">退出登录</van-button>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    created(){

    },
    mounted(){

    },
    methods:{
        logout(){
            this.$router.push("/");
            sessionStorage.clear();
        },
    },
   
}
</script>

<style>

</style>
