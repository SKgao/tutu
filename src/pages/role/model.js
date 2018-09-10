import api from './service';
import api_authmenu from '@/pages/authmenu/service';
import { message } from 'antd';

export default {
	namespace: 'roleSetting',

	state: {
		tableData: [],
		account: '',
		modalShow: false,
		siderList: [],
		menuIds: [],   // 授权菜单
		defaultCheckedKeys: [],  // 权限树默认选中
	},

	subscriptions: {
		setup({ dispatch, history }) {
			dispatch({ type: 'getRole' })
			dispatch({ type: 'getSliderBar' })
		}
	},

	effects: {
		*getSliderBar({ payload }, { call, put, select }) {
			const res = yield call(api.menusRole);
			yield put({
				type: 'save',
				payload: {
					siderList: (res.data) ? res.data.data : [],
					defaultCheckedKeys: (res.data) ? res.data.data.map(e => e.id + '') : []
				}
			});
		},

		*getRole({ payload }, { call, put, select }) {
			const res = yield call(api.getRole, payload);
			if (res) {
				yield put({
					type: 'save',
					payload: {
						tableData: (res.data) ? res.data.data : []
					}
				})
			}
		},
		
		*addRole({ payload }, { call, put }) {
			const res = yield call(api.addRole, payload);
			if (res) {
				message.success(res.data.message);
				yield put({ type: 'getRole' });
				yield put({ 
					type: 'setParam',
					payload: {
						modalShow: false
					}
				 });
			}
		},

		*deleteRole({ payload }, { call, select, put }) {
			const { tableData } = yield select(state => state.roleSetting);
			const res = yield call(api.deleteRole, payload);
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

		*setauthRole({ payload }, { call, put }) {
			const pay = {
				menuIds: payload.menuIds.map(e => e - 0),
				roleId: payload.roleId - 0
			}
			console.log(payload, pay)
			const res = yield call(api.setauthRole, pay);
			if (res) {
				yield put({ type: 'app/fetch' });
				message.success(res.data.message);
			}
		},

		*menusRole({ payload }, { call }) {

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
	