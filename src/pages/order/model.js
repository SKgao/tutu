import api from './service';
import { message } from 'antd';
import { filterObj } from '@/utils/tools';

export default {
	namespace: 'order',

	state: {
		orderList: [],
		selectList: [],
		id: '',     // 活动id
		pageSize: 10,
        pageNum: 1,
        totalCount: 0,
        startTime: '',
        startPayTime: '',
        endTime: '',
		endPayTime: '',
		tutuNumber: '', // 图图号
		orderNo: '',   // 订单号
		orderStatus: '', // 支付状态
		payType: '',   // 支付方式
        activityId: ''
	},

	subscriptions: {
		setup({ dispatch, history }) {	
			dispatch({ type: 'getOrder'});
		},
	},

	effects: {
		*getOrder({ payload }, { call, put, select }) {
			const { startTime, endTime, pageNum, pageSize, id, tutuNumber, orderNo, payType, activityId, orderStatus } = yield select(state => state.order);
			const res = yield call(api.getOrder, filterObj({ startTime, endTime, pageNum, pageSize, id, tutuNumber, orderNo, payType, activityId, orderStatus }));
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

		*activeSelect({ payload }, { call, put }) {
			const res = yield call(api.activeSelect, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						selectList: (res.data) ? [{id: '', title: '全部'}, ...res.data.data] : []
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