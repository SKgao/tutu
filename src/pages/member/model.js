import api from './service';
import { message } from 'antd';
import { filterObj } from '@/utils/tools';

export default {
	namespace: 'member',

	state: {
        memberList: [],
		memberLevelList: [],
		feedList: [],    // 反馈列表
        pageSize: 10,
        pageNum: 1,
        totalCount: 0,
        startTime: '',
		endTime: '',
		userLevel: '', // 用户等级
		bookVersionId: '',  // 教材版本id
		sex: '',  // 性别
		tutuNumber: '', // 图图号       
		mobile: '',     // 手机号
		hasSetPassword: '',   // 是否设置密码
		activeKey: '0',       // 默认选中tabs
	},

	subscriptions: {
		setup({ dispatch, history }) {	
			dispatch({ type: 'getMember' });
		},
	},

	effects: {
		*getMember({ payload }, { call, put, select }) {
			const _state = yield select(state => state.member);
			const res = yield call(api.getMember, filterObj({ 
				userLevel: _state.userLevel,
				startTime: _state.startTime,
				endTime: _state.endTime,
				pageNum: _state.pageNum, 
				pageSize: _state.pageSize,
				bookVersionId: _state.bookVersionId,
				tutuNumber: _state.tutuNumber,
				mobile: _state.mobile,
				sex: _state.sex,
				hasSetPassword: _state.hasSetPassword
			}));
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
						memberLevelList: (res.data) ? [{userLevel: '', levelName: '全部'}, ...res.data.data] : []
					}
				});
			}
		},

		*getFeedList({ payload }, { call, put, select }) {
			const { startTime, endTime, pageNum, pageSize, tutuNumber, mobile } = yield select(state => state.member);
			const res = yield call(api.getFeedList, filterObj({ startTime, endTime, pageNum, pageSize, tutuNumber, mobile }));
			if (res) {
				yield put({
					type: 'save',
					payload: {
						feedList: (res.data.data) ? res.data.data.data : [],
						totalCount: (res.data.data) ? res.data.data.totalCount : 0
					}
				});
			}
		},

		*updateUserLevel({ payload }, { call }) {
			const res = yield call(api.updateUserLevel, payload);
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
	