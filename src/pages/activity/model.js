import api from './service';
import { message } from 'antd';

export default {
	namespace: 'activity',

	state: {
		tableData: [],
		startTime: '',
		endTime: ''
	},

	subscriptions: {
		setup({ dispatch, history }) {	
			dispatch({ type: 'getActivity'});
		},
	},

	effects: {
		*getActivity({ payload }, { call, put }) {
			const res = yield call(api.getActivity, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						tableData: (res.data) ? res.data.data : []
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
	