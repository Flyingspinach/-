import axios from 'axios';
import router from './router/router';

axios.defaults.timeout = 150000;
axios.defaults.baseURL = "http://www.kkedu.info/index.php/";
// "https://pro.myworldclassroom.com/kaokao/index.php/"
// "http://www.kkedu.info/index.php/"

//不需要传tooken
//设置请求拦截器
// axios.interceptors.request.use(config =>{
//     //所有请求都会携带token去验证
//     console.log(config)
//     const token = localStorage.getItem("token")
//     if(token){
//         //有token就会携带token去请求
//         config.headers.Authorization = token
//     }
//     return config
// })
// //响应拦截器
// axios.interceptors.response.use(res =>{
//     console.log(res)
//     //对请求过来的结果进行处理
//     if(res.data.res_code === 401){
//         //跳转到那个地方
//         router.replace("/loading")
//         //删除token
//         localStorage.removeItem("token")
//     }   
//     return res 
// },err =>{
//     // console.log(err)
//     // return Promise.reject(err)
// })






















//http response 拦截器
// axios.interceptors.response.use(
//   response => {
//     if(response.data.errCode ==2){
//       router.push({
//         path:"/login",
//         querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
//       })
//     }
//     return response;
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

// export function geteData(url,params={}){
//   return new Promise((resolve,reject) => {
//     axios.get(URL+url,{
//       params:params
//     })
//     .then(response => {
//       resolve(response.data);
//     })
//     .catch(err => {
//       reject(err)
//       Message.error('数据请求失败');
//     })
//   })
// }

//  export function postData(url,data = {}){
//    return new Promise((resolve,reject) => {
//      axios.post(URL+url,data)
//           .then(response => {
//             resolve(response.data);
//             console.log(response.data,url)
//           },err => {
//             reject(err)
//             Message.error('数据请求失败');
//           })
//    })
//  }

// export function patchData(url,data = {}){
//   return new Promise((resolve,reject) => {
//     axios.patch(URL+url,data)
//          .then(response => {
//            resolve(response.data);
//          },err => {
//            reject(err)
//            Message.error('数据请求失败');
//          })
//   })
// }

// export function putData(url,data = {}){
//   return new Promise((resolve,reject) => {
//     axios.put(URL+url,data)
//         .then(response => {
//           resolve(response.data);
//           console.log(response.data,url)
//         },err => {
//           reject(err)
//           Message.error('数据请求失败');
//         })
//   })
// }

// export function delData(url,data = {}){
// return new Promise((resolve,reject) => {
//   axios.delete(URL+url,data)
//     .then(response => {
//       resolve(response.data);
//       console.log(response.data,url)
//     },err => {
//       reject(err)
//       Message.error('数据请求失败');
//     })
//   })
// }

export default axios;
