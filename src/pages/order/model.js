import api from './service';
import { message } from 'antd';

export default {
	namespace: 'order',

	state: {
		orderList: [],
		pageSize: 10,
        pageNum: 1,
        totalCount: 0,
        startTime: '',
        startPayTime: '',
        endTime: '',
		endPayTime: '',
		tutuNumber: '', // 图图号
		orderNo: '',   // 订单号
		payType: '',   // 支付方式
        activityId: ''
	},

	subscriptions: {
		setup({ dispatch, history }) {	
			dispatch({ 
				type: 'getOrder',
				payload: {
					pageNum: 1,
					pageSize: 10
				}
			});
		},
	},

	effects: {
		*getOrder({ payload }, { call, put }) {
			const res = yield call(api.getOrder, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						orderList: (res.data.data) ? res.data.data.data : [],
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