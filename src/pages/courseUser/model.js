import api from './service';
import { message } from 'antd';
import { filterObj } from '@/utils/tools';

export default {
	namespace: 'courseUser',

	state: {
        tableList: [],
        bookList: [],
        pageSize: 10,
        pageNum: 1,
		totalCount: 0,
		modalShow: false,
		sex: '',  // 性别
        tutuNumber: '', // 图图号
        realName: '',
        textbookId: '',
		mobile: '',     // 手机号
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(location => {
				if (location.pathname === '/couUser') {
					dispatch({
						type: 'setParam',
						payload: {
							pageNum: 1,
							pageSize: 10,
							tutuNumber: '',
                            mobile: '',
                            textbookId: '',
                            realName: '',
							sex: ''
						}
					});
					dispatch({ type: 'getUser' });
				}
			})
		},
	},

	effects: {
		*getUser({ payload }, { call, put, select }) {
			const _state = yield select(state => state.courseUser);
			const res = yield call(api.getUser, filterObj({
				pageNum: _state.pageNum,
				pageSize: _state.pageSize,
				textbookId: _state.textbookId,
				tutuNumber: _state.tutuNumber,
				mobile: _state.mobile,
                sex: _state.sex,
                realName: _state.realName,
			}));
			if (res) {
				yield put({
					type: 'save',
					payload: {
						tableList: (res.data.data) ? res.data.data.data : [],
						totalCount: (res.data.data) ? res.data.data.totalCount : 0
					}
				});
			}
		},

		*addMember({ payload }, { call, put }) {
			const res = yield call(api.addMember, payload);
			if (res) {
				message.success(res.data.message);
				yield put({ type: 'getUser'})
			}
        },

        *getBooklist({ payload }, { call, put, select }) {
			const res = yield call(api.getBooklist, {
                pageNum: 1,
                pageSize: 100
			});
			if (res) {
				yield put({
					type: 'save',
					payload: {
						bookList: (res.data) ? res.data.data : []
					}
				})
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
