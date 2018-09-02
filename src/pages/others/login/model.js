import api from './service';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import axios from 'axios';

export default {
	namespace: "login",

	state: {
		username: '',
		password: ''
	},
	
	subscriptions: {
		setup({ dispatch, history }) {
			dispatch({ type: 'clearStorage' });
			return history.listen(({ pathname }) => {
				if (pathname !== '/login') {
					dispatch({ type: 'app/fetch' })
				}
			});
		},
	},

	effects: {
		*login({ payload }, { call, put, select }) {
			const res = yield call(api.login, {
				account: payload.username,
				password: payload.password
			});
			if (res) {
				localStorage.setItem('token', res.data.data.token);
				localStorage.setItem('account', res.data.data.account);
				localStorage.setItem('avatar', res.data.data.avatar);
				localStorage.setItem('HAS_LOGIN', true);
				// yield put({type: 'save', payload});
				axios.defaults.headers = { 'token': res.data.data.token }
				yield put(routerRedux.push('/'));
			}
		},
		
		// 进页面先清除localStorage
		*clearStorage({}, {}) {
            localStorage.removeItem('token');
			localStorage.removeItem('account');
			localStorage.removeItem('avatar');
			localStorage.removeItem('firPath');
			localStorage.removeItem('secPath');
			localStorage.removeItem('HAS_LOGIN', false);
			axios.defaults.headers = { 'token': '' }
		}
	},

	reducers: {
		save(state, { payload }) {
			return { ...state, ...payload }
		}
	},
};
	