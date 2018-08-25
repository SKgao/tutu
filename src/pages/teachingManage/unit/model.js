import api from './service';
import api_teachingManage from '@/pages/teachingManage/book/service';
import { message } from 'antd';

export default {
	namespace: 'bookUnit',

	state: {
		tableData: [],
        modalShow: false,
        startTime: '',
        endTime: '',
        textBookId: '',
        bookList: []
	},

	subscriptions: {
		setup({ dispatch, history }) {
			dispatch({ 
                type: 'getUnit',
                payload: {
                    pageNum: 1,
                    pageSize: 10
                }
            })
		}
	},

	effects: {
     	*getUnit({ payload }, { call, put, select }) {
            const res = yield call(api.getUnit, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						tableData: (res.data.data) ? res.data.data.data : []
					}
				})
			}
        },
        
        *getBook({ payload }, { call, put, select }) {
			const res = yield call(api_teachingManage.getBook, {
                pageNum: 1,
                pageSize: 20
            });
			if (res) {
				yield put({
					type: 'save',
					payload: {
						bookList: (res.data.data) ? res.data.data.data : []
					}
				})
			}
		},
		
		*addUnit({ payload }, { call, put }) {
			const res = yield call(api.addUnit, payload);
			if (res) {
				message.success(res.data.message);
				yield put({ type: 'getUnit' });
			}
        },
        
        *updateUnit({ payload }, { call, put }) {
			const res = yield call(api.updateUnit, payload);
			if (res) {
				message.success(res.data.message);
				yield put({
                    type: 'getUnit',
                    payload: {
                        pageNum: 1,
                        pageSize: 20
                    }
                });
			}
		},

		*deleteUnit({ payload }, { call, select, put }) {
			const { tableData } = yield select(state => state.bookUnit);
			const res = yield call(api.deleteUnit, payload);
			if (res) {
				message.success(res.data.message);
				yield put({
					type: 'save',
					payload: {
						tableData: tableData.filter(e => e.id !== payload)
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
	