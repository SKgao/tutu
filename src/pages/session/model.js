import api from './service';
import { message } from 'antd';

export default {
	namespace: 'session',

	state: {
        sessionList: [], // 大关卡
        customList: [],  // 小关卡
        modalShow: false,
        totalCount: 0,
		pageSize: 10,
		pageNum: 1
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(location => {
				if (location.pathname === '/session') {
					dispatch({
						type: 'setParam',
						payload: {
							pageSize: 10,
							pageNum: 1,
							totalCount: 0
						}
					});
					dispatch({ type: 'getSessionList' });
				}
			});
		}
	},

	effects: {
		*getSessionList({ payload }, { put, call }) {
            const res = yield call(api.getBag);
            if (res) {
            	yield put({
            		type: 'save',
            		payload: {
						sessionList: (res.data) ? res.data.data : []
            		}
            	})
            }
        },

        *getCustomList({ payload }, { put, call }) {
            const res = yield call(api.getBag);
            if (res) {
            	yield put({
            		type: 'save',
            		payload: {
						customList: (res.data) ? res.data.data : []
            		}
            	})
            }
		},

		*deleteSession({ payload }, { call, put }) {
			const { id } = payload;
			const res = yield call(api.deleteSession, id);
            if (res) {
				message.success(res.data.message);
				yield put({ type: 'getSessionList' });
			}
		},

		*changeStatus({ payload }, { call, put }) {
			const res = yield call(api.changeStatus, payload);
			if (res) {
				message.success(res.data.message);
				yield put({ type: 'getSessionList' });
			}
		},

		*addSession({ payload }, { call, put }) {
            const res = yield call(api.addSession, payload);
		    if (res) {
				message.success(res.data.message);
				yield put({ type: 'getSessionList' })
			}
        },

        *updateSession({ payload }, { call, put }) {
            const res = yield call(api.updateSession, payload);
		    if (res) {
				message.success(res.data.message);
				yield put({ type: 'getSessionList' })
			}
        },

        *sessionSort({ payload }, { call, put }) {
            const res = yield call(api.sessionSort, payload);
		    if (res) {
				message.success(res.data.message);
				yield put({ type: 'getSessionList' })
			}
        },

        *sessionBind({ payload }, { call, put }) {
            const res = yield call(api.sessionBind, payload);
		    if (res) {
				message.success(res.data.message);
				yield put({ type: 'getSessionList' })
			}
        },

        *sessionUnbind({ payload }, { call, put }) {
            const res = yield call(api.sessionUnbind, payload);
		    if (res) {
				message.success(res.data.message);
				yield put({ type: 'getSessionList' })
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
