import api from './service';
import api_authmenu from '@/pages/authmenu/service';
import { filterObj } from '@/utils/tools';
import { message } from 'antd';

export default {
	namespace: 'specialCourse',

	state: {
        tableData: [],
        pageNum: 1,
        pageSize: 20,
        totalCount: 0,
        startTime: '',
        endTime: '',
        beginAt: '',
        endAt: '',
        iconDetail: '',
        iconTicket: ''
	},

	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(location => {
				if (location.pathname === '/specialCourse') {
					dispatch({
						type: 'setParam',
						payload: {
							pageNum: 1,
                            pageSize: 20,
                            totalCount: 0,
                            startTime: '',
                            endTime: '',
                            beginAt: '',
                            endAt: '',
                            iconDetail: '',
                            iconTicket: ''
						}
					});
					dispatch({ type: 'getCourse' })
				}
			});
		}
	},

	effects: {
		*getCourse({ payload }, { call, put, select }) {
            const { startTime, endTime, pageNum, pageSize } = yield select(state => state.specialCourse);
            const res = yield call(api.getCourse, filterObj({ startTime, endTime, pageNum, pageSize }));
			if (res) {
                yield put({
					type: 'save',
					payload: {
                        tableData: [],
                        totalCount: 0
					}
				})
				yield put({
					type: 'save',
					payload: {
                        tableData: (res.data.data) ? res.data.data.data : [],
                        totalCount: (res.data.data) ? res.data.data.totalCount : 0
					}
				})
			}
		},

		*addCourse({ payload }, { call, put }) {
			const res = yield call(api.addCourse, payload);
			if (res) {
				message.success(res.data.message);
				yield put({ type: 'getCourse' });
				yield put({
					type: 'setParam',
					payload: {
						modalShow: false
					}
				 });
			}
		},

		*deleteCourse({ payload }, { call, select, put }) {
			const res = yield call(api.deleteCourse, payload.textbookId);
			if (res) {
				message.success(res.data.message);
				yield put({ type: 'getCourse' });
			}
		},

		*changeCourse({ payload }, { call, put, select }) {
            const handleType = (payload.type === 'down') ? 'downCourse' : 'upCourse';
			const res = yield call(api[handleType], payload.textbookId - 0);
			if (res) {
                message.success(res.data.message);
                yield put({ type: 'getCourse' });
			}
		},

		*updateCourse({ payload }, { call, put, select }) {
            const res = yield call(api.updateCourse, payload);
			if (res) {
                message.success(res.data.message);
                yield put({ type: 'getCourse' });
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
