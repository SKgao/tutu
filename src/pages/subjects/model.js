import api from './service';
import api_teachingManage from '@/pages/teachingManage/book/service';
import { message } from 'antd';

export default {
	namespace: 'subject',

	state: {
		subjectList: [],     // 题目列表
		descList: [],        // 题目详情
        bookList: [],        // 教材列表
        customPassId: '',    // 关卡id
        sourceIds: '',       // 素材id
        subjectTypeId: '',   // 题目类型id
        startTime: '',
        endTime: '',
        modalShow: false,    // 添加题目
        modal2Show: false,   // 添加素材
		textbookId: '',      // 教材id
		customsPassId: 0,    // 关卡id
		sort: 0,             // 题目顺序
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
						let customsPassId = arr[0].split('=')[1] - 0
						let sort = arr[1].split('=')[1] - 0
						dispatch({ 
							type: 'setParam',
							payload: { customsPassId, sort }
						})
						dispatch({ 
							type: 'subjectDesc',
							payload: { customsPassId, sort }
						})
					} else {
						dispatch({ 
							type: 'getSubject',
							payload: {
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
		*getSubject({ payload }, { call, put }) {
            const res = yield call(api.getSubject, payload)
			if (res) {
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

        *addSource({ payload }, { call, put }) {
			const res = yield call(api.addSource, payload);
			res && message.success(res.data.message);
        },

        *progressSource({ payload }, { call, put }) {
			const res = yield call(api.progressSource, payload);
			res && message.success(res.data.message);
        },

        *addSubject({ payload }, { call, put }) {
            const res = yield call(api.addSubject, payload);
            res && message.success(res.data.message);
        },

        *progressSubject({ payload }, { call, put }) {
            const res = yield call(api.progressSubject, payload);
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
	