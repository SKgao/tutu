/**
 * 精品课程包模块
 */
import { axios } from '@/configs/request';

export default {
	// 添加课程包
	addBag: data => axios.post('bag/add', data),

	// 改变课程包状态
	changeStatus: data => axios.post('bag/changeStatus', data),

	// 删除课程包
	deleteBag: data => axios.get('bag/delete/' + data, data),

	// 精品课程包列表
    getBag: data => axios.get('bag/list', data),

    // 课程包修改
    updateBag: data => axios.post('bag/update', data),
}
//http://test.img.tutukids.com/group1/M00/00/01/rBELkVv3XhyARF-bAAEGq1C5Q9k145.jpg