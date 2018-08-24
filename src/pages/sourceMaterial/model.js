import api from './service';
import { message } from 'antd';

export default {
	namespace: "sourcematerial",

	state: {
    startTime: '',
    endTime: '',
    text: '',  // 素材内容
    materialList: [], // 素材数据
		modalShow: false,
    modal2Show:false,
		icon: '',//素材图标
    audio:''//素材音频
	},

	subscriptions: {
    setup({ dispatch, history }) {
    	dispatch({
    		type: 'getSource',
    		payload: {
    			pageNum: 1,
    			pageSize: 10
    		}
    	});
    },
	},

	effects: {
		*getSource({ payload }, { call, put }) {
      const res = yield call(api.getSource, payload);
      if (res) {
        yield put({
        	type: 'save',
        	payload: {
        		materialList: (res.data.data) ? res.data.data.data: [],
						modalShow:false,
						modal2Show:false
        	}
        })
      }
    },

    *addSource({ payload }, { call, put }) {
      const res = yield call(api.addSource, payload);
      if (res) {
        message.success(res.data.message);
				this.state.modalShow=false;
        yield put({
          type: 'getSource',
          payload: {
            pageNum: 1,
            pageSize: 10
          }
        });
      }
    },

    *deleteSource({ payload }, { call }) {
        console.log(payload);
        const res = yield call(api.deleteSource, payload);
        res && message.success(res.data.message);
    },
    *editSource({ payload }, { call, put }) {
      const res = yield call(api.addSource, payload);
      if (res) {
        message.success(res.data.message);
        yield put({
          type: 'getSource',
          payload: {
            pageNum: 1,
            pageSize: 10
          }
        });
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
