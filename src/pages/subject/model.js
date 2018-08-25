import api from './service';
import { message } from 'antd';

export default {
	namespace: "subjectmodel",

	state: {
    subjectTypeName: '',  // 题目类型名称
    subjectTypeId:'',//subject类型id
    subjectList: [], // subject数据
		customsPassId : '',//关卡id
    sourceIds:'',//题目内容
		sort: '',//排序
    modalShow:false
	},

	subscriptions: {
    setup({ dispatch, history }) {
    	dispatch({
    		type: 'getSubject',
    		payload: {
    			pageNum: 1,
    			pageSize: 10
    		}
    	});
    },
	},

	effects: {
		*getSubject({ payload }, { call, put }) {
      const res = yield call(api.getSubject, payload);
      if (res) {
        yield put({
        	type: 'save',
        	payload: {
        		subjectList: (res.data.data) ? res.data.data.data: [],
            modalShow:false
        	}
        })
      }
    },

    *importSubject({ payload }, { call, put }) {
      const res = yield call(api.importSubject, payload);
      if (res) {
        message.success(res.data.message);
        yield put({
          type: 'getSubject',
          payload: {
            pageNum: 1,
            pageSize: 10
          }
        });
      }
    },

    *progressSubject({ payload }, { call,put }) {
        const res = yield call(api.progressSubject, payload);
        if (res) {
          message.success(res.data.message);
          yield put({
            type: 'getSubject',
            payload: {
              pageNum: 1,
              pageSize: 10
            }
          });
        }
    },
    *detailSubject({ payload }, { call, put }) {
      const res = yield call(api.detailSubject, payload);
      if (res) {
        message.success(res.data.message);
        yield put({
          type: 'getSubject',
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
