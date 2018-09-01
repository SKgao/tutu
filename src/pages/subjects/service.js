/**
 * 题目模块
 */
import { axios } from '@/configs/request';

export default {
	// 题目-素材导入
	addSource: data => axios.post('subject/source/import', data),

	// 题目-详情 &sort=${data.sort}
	subjectDesc: data => axios.get(`subject/subject/desc?customsPassId=${data.customsPassId}&sort=${data.sort}`, data),

	// 题目导入
	addSubject: data => axios.post('subject/subject/import', data),

	// 题目列表
	getSubject: data => axios.post('subject/subject/list', data),

	// 题目修改
	updateSubject: data => axios.post('subject/subject/update', data),
}
