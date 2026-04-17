import { Platform } from "react-native";

let baseURL = "";
{Platform.OS == "android"
? baseURL = 'http://10.32.237.90:3000/'
: baseURL = 'http://10.32.237.90:3000/'

}
// 10.153.200.90
// https://linkpiii.onrender.com/
// https://palmfarmvs1.onrender.com/
// https://linkpi.onrender.com/
// https://palmfarmv.onrender.com/
// http://192.168.43.16:3000/
// 172.20.10.6
// 192.168.45.234
// 'https://linkpiibackend.onrender.com/
// 'https://linkpiibackend.onrender.com/
export default baseURL;
