/**
 * 订单模块
 */
import { axios } from '@/configs/request';

export default {
	// 订单列表
	getOrder: data => axios.post('order/list', data),
}
