import api from './service';
import { message } from 'antd';

export default {
	namespace: "teachingmanage",

	state: {
        startTime: '',
        endTime: '',
        gradeId: '',  // 年级id
        bookList: [], // 教材数据
        gradeList: [], // 年级数据
		modalShow: false,
		modal2Show: false,
		activeKey: '0',  // 默认书籍
		icon: ''         // 书籍封面
	},

	subscriptions: {
        setup({ dispatch, history }) {	
			dispatch({ 
				type: 'getBook',
				payload: {
					pageNum: 1,
					pageSize: 10
				}
			});
		},
	},

	effects: {
		*getBook({ payload }, { call, put }) {
			const res = yield call(api.getBook, payload);
            if (res) {
            	yield put({
            		type: 'save',
            		payload: {
            			bookList: (res.data.data) ? res.data.data.data : []
            		}
            	})
            }
        },

        *addBook({ payload }, { call, put }) {
            const res = yield call(api.addBook, payload);
			if (res) {
				message.success(res.data.message);
				yield put({
					type: 'getBook',
					payload: {
						pageNum: 1,
						pageSize: 10
					}
				});
				yield put({
					type: 'setParam',
					payload: {
            			modalShow: false
            		}
				});
			}
        },

        *deleteBook({ payload }, { call }) {
            const res = yield call(api.deleteBook, payload);
            res && message.success(res.data.message);
        },
        
        *getGrade({ payload }, { call, put }) {
            const res = yield call(api.getGrade, payload);
            if (res.data.code == 0) {
            	yield put({
            		type: 'save',
            		payload: {
            			gradeList: (res.data.data) ? res.data.data : []
            		}
            	})
            } else {
            	message.error(res.data.message);
            }
        },
        
        *addGrade({ payload }, { call, put }) {
            const res = yield call(api.addGrade, payload);
			if (res) {
				message.success(res.data.message);
				yield put({ type: 'getGrade' });
				yield put({
					type: 'setParam',
					payload: {
            			modal2Show: false
            		}
				});
			}
        },

        *updateGrade({ payload }, { call }) {
            const res = yield call(api.updateGrade, payload);
            res && message.success(res.data.message);
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
	