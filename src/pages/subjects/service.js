/**
 * 题目模块
 */
import { axios } from '@/configs/request';

export default {
	// 题目-素材导入
	addSource: data => axios.post('subject/source/import', data),

	// 题目-素材导入-进度
	progressSource: data => axios.get('subject/source/import/progress', data),

	// 题目-详情
	subjectDesc: data => axios.get(`subject/subject/desc?customsPassId=${data.customsPassId}&sort=${data.sort}`, data),

	// 题目导入
	addSubject: data => axios.post('subject/subject/import', data),

	// 题目导入-进度
	progressSubject: data => axios.get('subject/subject/import/progress', data),

	// 题目列表
	getSubject: data => axios.post('subject/subject/list', data),
}
