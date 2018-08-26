import api from './service';
import { message } from 'antd';

export default {
	namespace: 'activity',

	state: {
		tableData: [],
		pageSize: 10,
        pageNum: 1,
        totalCount: 0
	},

	subscriptions: {
		setup({ dispatch, history }) {	
			dispatch({ 
				type: 'getActivity',
				payload: {
					pageNum: 1,
					pageSize: 10
				}
			});
		},
	},

	effects: {
		*getActivity({ payload }, { call, put }) {
			const res = yield call(api.getActivity, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						tableData: (res.data.data) ? res.data.data.data : [],
						totalCount: (res.data.data) ? res.data.data.totalCount : 0
					}
				});
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
	