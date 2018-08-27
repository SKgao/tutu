import api from './service';
import { message } from 'antd';

export default {
	namespace: 'member',

	state: {
        memberList: [],
        memberLevelList: [],
        pageSize: 10,
        pageNum: 1,
        totalCount: 0,
        startTime: '',
        endTime: '',
        userLevel: '', // 用户等级
	},

	subscriptions: {
		setup({ dispatch, history }) {	
			dispatch({ 
				type: 'getMember',
				payload: {
					pageNum: 1,
					pageSize: 10
				}
			});
		},
	},

	effects: {
		*getMember({ payload }, { call, put }) {
			const res = yield call(api.getMember, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						memberList: (res.data.data) ? res.data.data.data : [],
						totalCount: (res.data.data) ? res.data.data.totalCount : 0
					}
				});
			}
        },
        
        *getMemberLevel({ payload }, { call, put }) {
			const res = yield call(api.getMemberLevel, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						getMemberLevel: (res.data.data) ? res.data.data.data : []
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
	