import api from './service';
import { message } from 'antd';

export default {
	namespace: 'appver',

	state: {
        appList: [], // app列表
        verList: [], // 版本列表
		appname: '', // app类型
		activeKey: '0',
		startTime: '',
		endTime: '',
		appTypeId: '',
		modalShow: false
	},

	subscriptions: {
		setup({ dispatch, history }) {	
			dispatch({ type: 'getAppList'});
			dispatch({
				type: 'getVerList',
				payload: {
					pageNum: 1,
					pageSize: 10
				}
			});
		}
	},

	effects: {
		*getAppList({ payload }, { put, call }) {
            const res = yield call(api.getApptype);
            if (res) {
            	yield put({
            		type: 'save',
            		payload: {
            			appList: (res.data) ? res.data.data : []
            		}
            	})
            }
		},

		*getVerList({ payload }, { put, call }) {
			const res = yield call(api.getVersion, payload);
            if (res) {
            	yield put({
            		type: 'save',
            		payload: {
            			verList: (res.data.data) ? res.data.data.data : []
            		}
            	})
            }
		},

		*deleteType({ payload }, { call, put, select }) {
			const { type, id } = payload;
			const _API = (type === 'app') ? 'deleteApptype' : 'deleteVersion';
			const _List = (type === 'app') ? 'appList' : 'verList';
			const _Data = yield select(state => state.appver[_List]);
			const res = yield call(api[_API], id);
            if (res) {
				message.success(res.data.message);
				yield put({
					type: 'save',
					payload: {
						[_List]: _Data.filter(e => e.id !== id)
					}
				});
			}
		},

		*disableType({ payload }, { call, put }) {
			const { type, id } = payload;
			const _API = (type === 'app') ? 'disableApptype' : 'disableVersion';
			const res = yield call(api[_API], id);
			if (res) {
				message.success(res.data.message);
				if (type === 'app') {
					yield put({ type: 'getAppList' });
				} else {
					yield put({
						type: 'getVerList',
						payload: {
							pageNum: 1,
							pageSize: 10
						}
					})
				}
			}
		},

		*enableType({ payload }, { call, put }) {
			const { type, id } = payload;
			const _API = (payload.type === 'app') ? 'enableApptype' : 'enableVersion';
			const res = yield call(api[_API], id);
            if (res) {
				message.success(res.data.message);
				if (type === 'app') {
					yield put({ type: 'getAppList' });
				} else {
					yield put({
						type: 'getVerList',
						payload: {
							pageNum: 1,
							pageSize: 10
						}
					})
				}
			}
		},

		*addApptype({ payload }, { call, put }) {
            const res = yield call(api.addApptype, payload);
		    if (res) {
				message.success(res.data.message);
				yield put({ type: 'getAppList' })
			}
		},

		*addVersion({ payload }, { call, put }) {
            const res = yield call(api.addVersion, payload);
			if (res) {
				message.success(res.data.message);
				yield put({ 
					type: 'getAppList',
					payload: {
						pageNum: 1,
						pageSize: 10
					}
				})
				yield put({ 
					type: 'setParam',
					payload: {
						modalShow: false
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
	