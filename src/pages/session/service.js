/**
 * 精品课程包模块
 */
import { axios } from '@/configs/request';

export default {
	// 添加大关卡
	addSession: data => axios.post('session/add', data),

	// 教材下--大关卡列表
    getSession: data => axios.get(`/session/list/${data.textbookId}`, data),

    // 删除大关卡
	deleteSession: data => axios.get(`/session/delete/${data.id}`, data),

    // 大关卡修改
    updateSession: data => axios.post('session/update', data),

    // 大关卡--绑定小关卡
    sessionBind: data => axios.post('session/bind', data),

    // 大关卡--绑定小关卡
    sessionUnbind: data => axios.get(`session/unbind/${data.id}`, data),

    // 大关卡--改变小关卡顺序
    sessionSort: data => axios.post('session/change/sort', data),

    // 大关卡--改变状态
    sessionStatus: data => axios.post('session/changeStatus', data),

    // 大关卡下--小关卡列表
    customList: data => axios.post('session/custom/list', data),
}