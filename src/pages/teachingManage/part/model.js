import api from './service';
import { message } from 'antd';

export default {
	namespace: 'unitPart',

	state: {
		partList: [],
		startTime: '',
		endTime: '',
		unitsId: 0
	},

	subscriptions: {
		setup({ dispatch, history }) {
            return history.listen(location => {
				let _search = location.search.slice(1)
				let arr = (_search) ? _search.split('=') : []
				if (arr.length) {
					dispatch({ 
						type: 'setParam',
						payload: {
							unitsId: arr[1]
						}
					})
					dispatch({ 
						type: 'getPart',
						payload: {
							pageNum: 1,
						    pageSize: 100,
							unitsId: arr[1]
						}
					})
				}
			});
		}
	},

	effects: {
		  
		*getPart({ payload }, { call, put }) {
            const res = yield call(api.getPart, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						partList: (res.data.data) ? res.data.data.data : []
					}
				})
			}
		},

		*addPart({ payload }, { call, put, select }) {
			const res = yield call(api.addPart, payload);
			const { unitsId } = yield select(state => state.unitPart);
			if (res) {
				message.success(res.data.message);
				yield put({
                    type: 'getPart',
                    payload: {
                        pageNum: 1,
						pageSize: 100,
						unitsId
                    }
                });
			}
		},
		
		*updatePart({ payload }, { call, put, select }) {
			const res = yield call(api.updatePart, payload);
			const { unitsId } = yield select(state => state.unitPart);
			if (res) {
				message.success(res.data.message);
				yield put({
                    type: 'getPart',
                    payload: {
                        pageNum: 1,
						pageSize: 100,
						unitsId
                    }
                });
			}
		},

		*deletePart({ payload }, { call, put, select }) {
			const { partList } = yield select(state => state.unitPart);
			const res = yield call(api.deletePart, payload);
			if (res) {
				message.success(res.data.message);
				yield put({
					type: 'save',
					payload: {
						partList: partList.filter(e => e.id !== payload)
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
	