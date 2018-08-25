import api from './service';
import { message } from 'antd';

export default {
	namespace: 'partPass',

	state: {
        tableData: [],
        subjectList: [],
		modalShow: false,
		partsId: 0,  // partsId
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
							partsId: arr[1]
						}
					})
					dispatch({ 
						type: 'getPass',
						payload: {
							pageNum: 1,
						    pageSize: 100,
							partsId: arr[1]
						}
					})
				}
			});
		}
	},

	effects: {
     	*getPass({ payload }, { call, put }) {
			const res = yield call(api.getPass, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						tableData: (res.data) ? res.data.data : []
					}
				})
			}
        },
        
        *getSubject({ }, { call, put }) {
			const res = yield call(api.getSubject);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						subjectList: (res.data.data) ? res.data.data.data : []
					}
				})
			}
		},
		
		*addPass({ payload }, { call, put, select }) {
			const res = yield call(api.addPass, payload);
			const { partsId } = yield select(state => state.partPass);
			if (res) {
				message.success(res.data.message);
				yield put({
                    type: 'getPass',
                    payload: {
                        pageNum: 1,
						pageSize: 100,
						partsId
                    }
                });
			}
        },
        
        *updatePass({ payload }, { call, put, select }) {
			const { partsId } = yield select(state => state.partPass);
			const res = yield call(api.updatePass, payload);
			if (res) {
				message.success(res.data.message);
				yield put({
                    type: 'getPass',
                    payload: {
                        pageNum: 1,
						pageSize: 100,
						partsId
                    }
                });
			}
		},

		*deletePass({ payload }, { call, select, put }) {
			const { tableData } = yield select(state => state.partPass);
			const res = yield call(api.deletePass, payload);
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
	