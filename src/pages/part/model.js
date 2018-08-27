import api from './service';
import { message } from 'antd';

export default {
	namespace: "partmodel",

	state: {
    startTime: '',
    endTime: '',
    title: '',  // part名称
    tips:'',//part描述
    partList: [], // part数据
		modalAddShow: false,
    modalEditShow:false,
		icon: '',//part图标
    iconUrl:'',//part地址
    unitsId:''
	},

	subscriptions: {
    setup({ dispatch, history }) {
    	dispatch({
    		type: 'getPart',
    		payload: {
    			pageNum: 1,
    			pageSize: 10
    		}
    	});
    },
	},

	effects: {
		*getPart({ payload }, { call, put }) {
      const res = yield call(api.getPart, payload);
      if (res) {
        yield put({
        	type: 'save',
        	payload: {
        		partList: (res.data.data) ? res.data.data.data: [],
						modalShow:false,
						modal2Show:false
        	}
        })
      }
    },

    *addPart({ payload }, { call, put }) {
      const res = yield call(api.addPart, payload);
      if (res) {
        message.success(res.data.message);
        yield put({
          type: 'getPart',
          payload: {
            pageNum: 1,
            pageSize: 10
          }
        });
      }
    },

    *deletePart({ payload }, { call,put }) {
        const res = yield call(api.deletePart, payload);
        if (res) {
          message.success(res.data.message);
          yield put({
            type: 'getPart',
            payload: {
              pageNum: 1,
              pageSize: 10
            }
          });
        }
    },
    *editPart({ payload }, { call, put }) {
      const res = yield call(api.editPart, payload);
      if (res) {
        message.success(res.data.message);
        yield put({
          type: 'getPart',
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
