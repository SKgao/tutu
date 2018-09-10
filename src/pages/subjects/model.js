import api from './service';
import api_teachingManage from '@/pages/teachingManage/book/service';
import { filterObj } from '@/utils/tools';
import { message } from 'antd';

export default {
	namespace: 'subject',

	state: {
		subjectList: [],     // 题目列表
		descList: [],        // 题目详情
        bookList: [],        // 教材列表
		customsPassName: '', // 关卡名
        subjectTypeId: '',   // 题目类型id
        startTime: '',
		endTime: '',
		sourceIds: '',       // 搜索题目内容
        modalShow: false,    // 添加题目
        modal2Show: false,   // 添加素材
		textbookId: '',       // 教材id
		customsPassId: '',    // 关卡id
		sort: 0,             // 题目顺序
		detpage: false,      // 是否为题目详情页
		
		audioArray: [],      // 音频文件
		imageArray: [],      // 图片文件
		file: [],            // 题目文件
		addType: '2',          // 导入题目类型（默认导入）
		activeKey: '0',      // tabs选项
        pageSize: 10,
        pageNum: 1,
        totalCount: 0
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(location => {
				if (location.pathname === '/subjects') {
					let search = location.search.slice(1)
					if (search) {
						let arr = (search) ? search.split('&') : []
						let paramObj = { activeKey: '0', sort: '', }
						for (let i = 0; i < arr.length; i++) {
							let temp = arr[i].split('=')
							if (temp[0] && temp[1] && temp[1] !== 'undefined') {
								if (temp[0] === 'customsPassName') {
									paramObj[temp[0]] = decodeURI(temp[1])
								} else {
									paramObj[temp[0]] = temp[1] - 0
								}
							}
						}
						dispatch({ 
							type: 'setParam',
							payload: paramObj
						})
						if (paramObj.detpage) {
							dispatch({ 
								type: 'subjectDesc',
								payload: { 
									customsPassId: paramObj.customsPassId,
									sort: paramObj.sort
								}
							})
						} else {
							dispatch({ 
								type: 'getSubject',
								payload: { 
									customsPassId: paramObj.customsPassId,
									pageSize: 10,
                                    pageNum: 1
								}
							})
						}
					} else {
						dispatch({ 
							type: 'setParam',
							payload: { 
								startTime: '',
		                        endTime: '',
								activeKey: '0',
								customsPassId: '',
								customsPassName: '',
								sort: '',
								sourceIds: '',
								textbookId: '',
								subjectTypeId: '',
								pageSize: 10,
                                pageNum: 1
							}
						})
						dispatch({ 
							type: 'getSubject', 
							payload: { 
								startTime: '',
		                        endTime: '',
								customsPassId: '',
								customsPassName: '',
								sort: '',
								sourceIds: '',
								textbookId: '',
								subjectTypeId: '',
								pageSize: 10,
                                pageNum: 1
							}
						})
					}
				}
			});
		}
	},

	effects: {
		*getSubject({ payload }, { call, put, select }) {
			const { startTime, endTime, pageNum, pageSize, sourceIds, customsPassName, customsPassId } = yield select(state => state.subject);
			const _pay = payload ? payload : { startTime, endTime, pageNum, pageSize, sourceIds, customsPassName, customsPassId }
			const res = yield call(api.getSubject, filterObj(_pay))
			if (res) {
				yield put({
					type: 'save',
					payload: {
                        subjectList: [],
                        totalCount:  0
					}
				})
				yield put({
					type: 'save',
					payload: {
                        subjectList: (res.data.data) ? res.data.data.data : [],
                        totalCount: (res.data.data) ? res.data.data.totalCount : 0
					}
				})
			}
		},
		
		*subjectDesc({ payload }, { call, put }) {
			const res = yield call(api.subjectDesc, payload)
			if (res) {
				yield put({
					type: 'save',
					payload: {
                        descList: (res.data.data) ? [res.data.data] : []
					}
				})
			}
        },

        *addSource({ payload }, { call, put, select }) {
			const res = yield call(api.addSource, payload);
			if (res) {
				message.success(res.data.message);
				yield put({
					type: 'setParam',
					payload: {
						audioArray: [],
						imageArray: [],
						modal2Show: false,
						activeKey: '1'
					}
				})
			}
        },

        *addSubject({ payload }, { call, put, select }) {
			const res = yield call(api.addSubject, payload);
			if (res) {
				yield put({
					type: 'setParam',
					payload: {
						file: [],
						modalShow: false,
						activeKey: '1'
					}
				})
			}
		},

		*updateSubject({ payload }, { call, put, select }) {
			const res = yield call(api.updateSubject, payload);
			if (res) {
				message.success(res.data.message);
				yield put({ type: 'getSubject' })
			}
		},

		*deleteSubject({ payload }, { call, put }) {
			const res = yield call(api.deleteSubject, payload);
			if (res) {
				message.success(res.data.message);
				yield put({ type: 'getSubject' })
			}
		},
		 
        *getBook({ payload }, { call, put, select }) {
			const res = yield call(api_teachingManage.getBook, {
                pageNum: 1,
                pageSize: 100
            });
			if (res) {
				yield put({
					type: 'save',
					payload: {
						bookList: (res.data.data) ? res.data.data.data : []
					}
				})
			}
		},

		*setParam({ payload }, { put }) {
			for (let key in payload) {
				yield put({
					type: 'save',
					payload: {
						[key]: payload[key]
					}
				})
			}
		}
	},

	reducers: {
		save(state, { payload }) {
			return { ...state, ...payload }
		}
	},
};
	