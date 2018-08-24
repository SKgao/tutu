import api from './service';
import { message } from 'antd';

export default {
	namespace: 'unitPart',

	state: {
		part: ''
	},

	subscriptions: {
		setup({ dispatch, history }) {

		}
	},

	effects: {
		*addPart({ payload }, { call, put }) {
            const res = yield call(api.addPart, payload);
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
	