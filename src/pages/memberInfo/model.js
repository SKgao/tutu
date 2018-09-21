import api from './service';
import { message } from 'antd';
import { filterObj } from '@/utils/tools';

export default {
	namespace: 'memberInfo',

	state: {
        memberList: [],
		memberLevelList: [],
		feedList: [],    // 反馈列表
        pageSize: 10,
        pageNum: 1,
        totalCount: 0,
        expireStartTime: '', // 会员起始时间
		expireEndTime : '',  // 会员截止时间
		userLevel: '', // 用户等级
		bookVersionId: '',  // 教材版本id
		sex: '',  // 性别
		tutuNumber: '', // 图图号
		mobile: '',     // 手机号
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(location => {
				if (location.pathname === '/memberInfo') {
					dispatch({
						type: 'setParam',
						payload: {
							pageNum: 1,
							pageSize: 10,
							hasSetPassword: '',
							tutuNumber: '',
							mobile: '',
							userLevel: '',
							expireStartTime: '', // 会员起始时间
		                    expireEndTime : '',  // 会员截止时间
							bookVersionId: '',
							sex: ''
						}
					});
					dispatch({ type: 'getMember' });
				}
			})
		},
	},

	effects: {
		*getMember({ payload }, { call, put, select }) {
			const _state = yield select(state => state.memberInfo);
			const res = yield call(api.getMember, filterObj({
				userLevel: _state.userLevel,
				expireStartTime: _state.expireStartTime,
				expireEndTime: _state.expireEndTime,
				pageNum: _state.pageNum,
				pageSize: _state.pageSize,
				bookVersionId: _state.bookVersionId,
				tutuNumber: _state.tutuNumber,
				mobile: _state.mobile,
				sex: _state.sex
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
