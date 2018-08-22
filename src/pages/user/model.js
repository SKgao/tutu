import api from './service';
import { message } from 'antd';
import api_role from '@/pages/role/service';

export default {
	namespace: 'userSetting',

	state: {
		tableData: [],
		roleList: [],
		startTime: '',
		endTime: '',
		account: '',
		modalShow: false,
		avatar: '' // 用户头像url
	},

	subscriptions: {
		setup({ dispatch, history }) {	
			dispatch({ 
				type: 'getUser',
				payload: {
					pageNum: 1,
					pageSize: 10
				}
			})
		},
	},

	effects: {
		*getUser({ payload }, { call, put }) {
			const res = yield call(api.getUser, payload);
			if (res) {
				yield put({
					type: 'save', 
					payload: {
						tableData: (res.data.data) ? res.data.data.data : []
					}
				})
			}
		},

		*getRoleList({ payload }, { call, put }) {
			const res = yield call(api_role.getRole, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						roleList: (res.data) ? res.data.data : []
					}
				})
			}
		},
		
		*addUser({ payload }, { call, put }) {
			const res = yield call(api.addUser, payload);
			if (res) {
				message.success(res.data.message);
				yield put({
					type: 'getUser',
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

		*deleteUser({ payload }, { call, select, put }) {
			const { tableData } = yield select(state => state.userSetting);
			const res = yield call(api.deleteUser, payload);
			if (res) {
				message.success(res.data.message);
				yield put({
					type: 'save',
					payload: {
						tableData: tableData.filter(e => e.id !== payload)
					}
				})
			}
		},

		*forbiddenUser({ payload }, { call }) {
			const res = yield call(api.forbiddenUser, payload);
			res && message.success(res.data.message);
		},

		*usingUser({ payload }, { call }) {
			const res = yield call(api.usingUser, payload);
			res && message.success(res.data.message);
		},

		*updateUser({ payload }, { call }) {
			const res = yield call(api.updateUser, payload);
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
	