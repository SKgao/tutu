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
    audio:'',//素材音频
    iconUrl:'',//素材地址
    audioUrl:'',//音频地址
    pageSize: 10,
    pageNum: 1,
    totalCount: 0
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
            totalCount: (res.data.data) ? res.data.data.totalCount : 0,
						modalShow:false,
						modal2Show:false
        	}
        })
      }
    },

    *addSource({ payload }, { call, put, select }) {
      const { pageNum, pageSize } = yield select(state => state.sourcematerial);
      const res = yield call(api.addSource, payload);
      if (res) {
        message.success(res.data.message);
        yield put({
          type: 'getSource',
          payload: {
            pageNum,
            pageSize
          }
        });
      }
    },

    *deleteSource({ payload }, { call, put, select }) {
        const { materialList } = yield select(state => state.sourcematerial);
        const res = yield call(api.deleteSource, payload);
        if (res) {
          message.success(res.data.message);
          yield put({
            type: 'save',
            payload: {
              materialList: materialList.filter(e => e.id !== payload.id)
            }
          })
        }
    },
    *editSource({ payload }, { call, put, select }) {
      const { pageNum, pageSize } = yield select(state => state.sourcematerial);
      const res = yield call(api.editSource, payload);
      if (res) {
        message.success(res.data.message);
        yield put({
          type: 'getSource',
          payload: {
            pageNum,
            pageSize
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
