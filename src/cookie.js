//设置cookie
import CryptoJS from "crypto-js"
export function setCookie (c_name, value, day ){
  var cipherText = CryptoJS.AES.encrypt(
    value+'',"123"
    ).toString();
  var exdate = new Date();
//   expiredays
  exdate.setDate(exdate.getDate() + day );
  document.cookie = c_name + "=" + cipherText + ((day == null) ? " " : ";expires ="+ exdate.toGMTString());
  //正确
  // document.cookie = c_name + "=" + escape(value) + ((day  == null) ? "" : ";expires=" + exdate.toGMTString());
};
//获取cookie
export function getCookie(name) {
  //解密
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)){
      console.log(arr[2])
      var bytes = CryptoJS.AES.decrypt(arr[2], "123");
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      return (originalText);
  }else{
      return null;
  }
}
//删除cookie
export function delCookie (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};
