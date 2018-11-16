import jsonp from '@/utils/jsonp';
import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';

const DEFAULT_TIMEOUT = 60000;
// 正式接口
// const REQ_URL = '//api.admin.tutukids.com/'
// 测试接口
const REQ_URL = '//test.api.admin.tutukids.com/'

axios.defaults.baseURL = REQ_URL;
//axios.defaults.withCredentials = true;
axios.defaults.timeout = DEFAULT_TIMEOUT;

axios.defaults.headers = {
	'token': localStorage.getItem('token') || '',
	'Content-Type': 'application/json'
}

// 返回状态拦截器
axios.interceptors.response.use(res => {
	let code = res.data.code
	let msg = res.data.message
	switch (code) {
		case 45:
		case 46:
			window.location.href = '#/login'
			return false;
		case 0:
			return res;
		default:
		    code !== 45 && code !== 46 && message.error(msg);
			return false;
	}
});

// axios.defaults.transformRequest = [function (data, headers) {
// 	return qs.stringify(data);
// }]

// axios.defaults.paramsSerializer = function (params) {
// 	return qs.stringify(params);
// }

// admin端
export const BASIC_URL = REQ_URL

/**
 * jsonp方法
 * @param  {[type]} url  url拼接
 * @param  {[type]} data 参数
 * @return {[type]}      [description]
 */
let J = async (url, data) => {
	return jsonp(BASIC_URL + url, {
		params: data || {},
		timeout: DEFAULT_TIMEOUT,
		jsonpCallback: 'callbackparam'
	}).then(res => {
		return res
	})
}

export {
	J,
	axios
}
