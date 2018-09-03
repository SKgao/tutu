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
		customPassId: '',    // 关卡id
		customsPassName: '', // 关卡名
        subjectTypeId: '',   // 题目类型id
        startTime: '',
		endTime: '',
		sourceIds: '',       // 搜索题目内容
        modalShow: false,    // 添加题目
        modal2Show: false,   // 添加素材
		textbookId: 1,       // 教材id
		customsPassId: 505,    // 关卡id
		sort: 0,             // 题目顺序
		detpage: false,      // 是否为题目详情页
		
		audioArray: [],      // 音频文件
		imageArray: [],      // 图片文件
		file: [],            // 题目文件
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
								activeKey: '0',
								customsPassId: '',
								sort: ''
							}
						})
						dispatch({ type: 'getSubject' })
					}
				}
			});
		}
	},

	effects: {
		*getSubject({ payload }, { call, put, select }) {
			const { pageNum, pageSize, sourceIds, customsPassName } = yield select(state => state.subject);
			const _pay = payload ? payload : { pageNum, pageSize, sourceIds, customsPassName }
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
			res && message.success(res.data.message);
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
	