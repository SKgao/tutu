import api from './service';
import { message } from 'antd';

export default {
	namespace: 'customPass',

	state: {
		passList: [], // 小关卡
		subjectList: [], // 题型列表
		modalShow: false,
		textbookId: '',
        totalCount: 0,
		pageSize: 10,
		pageNum: 1
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(location => {
				if (location.pathname === '/customPass') {
					dispatch({
						type: 'setParam',
						payload: {
							pageSize: 10,
							pageNum: 1,
							totalCount: 0
						}
					});
					dispatch({ type: 'getPassList' });
				}
			});
		}
	},

	effects: {
		*getPassList({ payload }, { put, call, select }) {
			const { pageSize, pageNum, totalCount, textbookId } = yield select(state => state.customPass);
            const res = yield call(api.getPass, { pageSize, pageNum, totalCount, textbookId });
            if (res) {
            	yield put({
            		type: 'save',
            		payload: {
						passList: (res.data) ? res.data.data : []
            		}
            	})
            }
		},

		*getSubject({ payload }, { put, call }) {
            const res = yield call(api.getSubject);
            if (res) {
            	yield put({
            		type: 'save',
            		payload: {
						subjectList: (res.data) ? res.data.data : []
            		}
            	})
            }
        },

		*deletePass({ payload }, { call, put }) {
			const { id } = payload;
			const res = yield call(api.deletePass, id);
            if (res) {
				message.success(res.data.message);
				yield put({ type: 'getPassList' });
			}
		},

		*addPass({ payload }, { call, put }) {
            const res = yield call(api.addPass, payload);
		    if (res) {
				message.success(res.data.message);
				yield put({ type: 'getPassList' })
			}
        },

        *updatePass({ payload }, { call, put }) {
            const res = yield call(api.updatePass, payload);
		    if (res) {
				message.success(res.data.message);
				yield put({ type: 'getPassList' })
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
