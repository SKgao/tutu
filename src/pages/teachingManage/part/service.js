/**
 * part模块
 */
import { axios } from '@/configs/request';

export default {
	// 添加part
	addPart: data => axios.post('part/add', data),
}
