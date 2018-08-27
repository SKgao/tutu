/**
 * subject管理模块
 */
import { axios } from '@/configs/request';

export default {
	// subject列表
	getSubject: data => axios.post('/subject/subject/list', data),

	// 导入subject
	importSubject: data => axios.post('/subject/subject/import', data),

	// 导入subject进度
  progressSubject: data => axios.get('/subject/subject/import/progress'+data.id, data),
  // 修改subject
  detailSubject: data => axios.get('/subject/subject/desc', data),
}
