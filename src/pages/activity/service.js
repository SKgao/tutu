/**
 * 活动模块
 */
import { axios } from '@/configs/request';

export default {
	// 活动列表
	getActivity: data => axios.post('activity/list', data),
}
