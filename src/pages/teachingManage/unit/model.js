import api from './service';
import { filterObj } from '@/utils/tools';
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
		bookList: [],
		pageSize: 10,
        pageNum: 1,
        totalCount: 0
	},

	subscriptions: {
		setup({ dispatch, history }) {
			dispatch({  type: 'getUnit' })
		}
	},

	effects: {
     	*getUnit({ payload }, { call, put, select }) {
			const { pageNum, pageSize, startTime, endTime, textBookId } = yield select(state => state.bookUnit);
            const res = yield call(api.getUnit, filterObj({ 
				pageNum, pageSize, startTime, endTime, textBookId 
			}));
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
                pageSize: 1000
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
				yield put({ type: 'getUnit' });
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
	