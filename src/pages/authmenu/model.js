import api from './service';
import { message } from 'antd';

export default {
	namespace: 'authmenu',

	state: {
		tableData: [],
		modalShow: false,
		menuName: '',  // 菜单名称
	},

	subscriptions: {
		setup({ dispatch, history }) {	
			dispatch({ 
				type: 'getMenu',
				payload: {
					pageNum: 1,
					pageSize: 10
				}
			});
		},
	},

	effects: {
		*getMenu({ payload }, { call, put }) {
			const res = yield call(api.getMenu, payload);
			yield put({
				type: 'save',
				payload: {
					tableData: (res.data.data) ? res.data.data.data : []
				}
			});
		},
		
		*addMenu({ payload }, { call, put }) {
			const res = yield call(api.addMenu, payload);
			if (res) {
				message.success(res.data.message);
				yield put({
					type: 'getMenu',
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

		*deleteMenu({ payload }, { call, select, put }) {
			const { tableData } = yield select(state => state.authmenu);
			const res = yield call(api.deleteMenu, payload);
			if (res) {
				message.success(res.data.message);
				yield put({ type: 'app/fetch' });
				yield put({
					type: 'save',
					payload: {
						tableData: tableData.filter(e => e.id !== payload)
					}
				});
			}
		},

		*updateMenu({ payload }, { call }) {
			const res = yield call(api.updateMenu, payload);
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
	