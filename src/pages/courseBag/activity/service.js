/**
 * 精品课程包模块
 */
import { axios } from '@/configs/request';

export default {
	// 添加课程活动
	addActivity: data => axios.post('course/active/add', data),

	// 课程活动列表
	getActivity: data => axios.get(`course/active/list/${data.id}`, data),

    // 课程活动修改
    updateActivity: data => axios.post('course/active/update', data),
}