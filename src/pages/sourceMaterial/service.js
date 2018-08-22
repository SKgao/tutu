/**
 * 素材管理模块
 */
import { axios } from '@/configs/request';

export default {
	// 素材列表
	getSource: data => axios.post('/source/list', data),

	// 添加素材
	addSource: data => axios.post('/source/add', data),

	// 删除素材
  deleteSource: data => axios.get('/source/delete/'+data.id, data),
  // 修改素材
  editSource: data => axios.post('/source/update', data),
}