/**
 * 单元模块
 */
import { axios } from '@/configs/request';

export default {
	// 添加单元
	addUnit: data => axios.post('unit/add', data),

	// 单元列表
	getUnit: data => axios.post('unit/list', data),

	// 删除单元
    deleteUnit: data => axios.get('unit/del/' + data, data),
    
    // 修改单元
	updateUnit: data => axios.post('unit/update', data)
}
