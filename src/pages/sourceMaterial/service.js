/**
 * 素材管理模块
 */
import { axios } from '@/configs/request';

export default {
	// 素材列表
	getSource: data => axios.post('/source/list', data),

	// 添加素材
	addSource: data => axios.post('/source/add', data),

	// 题目-素材导入
	addSubjectSource: data => axios.post('subject/source/import', data),

	// 删除素材
	deleteSource: data => axios.get('/source/delete/'+data.id, data),

	// 批量删除素材
	batchDeleteSource: data => axios.post('/source/delete/batch', data),

	// 修改素材
	editSource: data => axios.post('/source/update', data),
}