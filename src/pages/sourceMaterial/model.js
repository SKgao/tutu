import api from './service';
import { message } from 'antd';
import { filterObj } from '@/utils/tools';
export default {
	namespace: "sourcematerial",

	state: {
    startTime: '',
    endTime: '',
    text: '',  // 素材内容
    materialList: [], // 素材数据
		modalShow: false,
    modal2Show:false,
    modal3Show: false,
    modal4Show: false,
    id: '',  // 修改素材id
		icon: '',//素材图标
    audio:'',//素材音频
    iconUrl:'',//素材地址
    audioUrl:'',//音频地址
    phonetic: '', // 音标
    translation: '', // 释义
    explainsArray: '', // 多次释义
    audioArray: [],      // 音频文件
    imageArray: [],      // 图片文件
    sentensArray: [],    // 句子文件
    activeKey: '0',      // tabs选项
    pageSize: 10,
    pageNum: 1,
    totalCount: 0,
    sourceIds: [], // 批量删除素材
    selectedRowKeys: [], // 默认选中项
    openLike: ''       // 是否开启模糊搜索
	},

	subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(location => {
				if (location.pathname === '/sourceMaterial') {
          dispatch({
            type: 'setParam',
            payload: {
              startTime: '',
              endTime: '',
              pageNum: 1,
              pageSize: 10,
              text: '',
              openLike: ''
            }
          });
          dispatch({
            type: 'getSource',
            payload: {
              startTime: '',
              endTime: '',
              pageNum: 1,
              pageSize: 10,
              text: '',
              openLike: ''
            }
          });
        }
      })
    }
	},

	effects: {
		*getSource({ payload }, { call, put }) {
      const res = yield call(api.getSource, filterObj(payload));
      if (res) {
        yield put({
        	type: 'save',
        	payload: {
            materialList: [],
            totalCount: 0,
						modalShow: false,
						modal2Show: false
        	}
        })
        yield put({
        	type: 'save',
        	payload: {
            materialList: (res.data.data) ? res.data.data.data: [],
            totalCount: (res.data.data) ? res.data.data.totalCount : 0,
						modalShow: false,
						modal2Show: false
        	}
        })
      }
    },

    *addSource({ payload }, { call, put, select }) {
      const { pageNum, pageSize, startTime, endTime, openLike } = yield select(state => state.sourcematerial);
      const res = yield call(api.addSource, payload);
      if (res) {
        message.success(res.data.message);
        yield put({
          type: 'getSource',
          payload: { pageNum, pageSize, startTime, endTime, openLike }
        });
      }
    },

    *addSubjectSource({ payload }, { call, put, select }) {
      const res = yield call(api.addSubjectSource, payload);
			if (res) {
				message.success(res.data.message);
				yield put({
					type: 'setParam',
					payload: {
						audioArray: [],
            imageArray: [],
            sentensArray: [],
            modal3Show: false,
            activeKey: '1'
					}
				})
			}
    },

    *deleteSource({ payload }, { call, put, select }) {
      const { pageNum, pageSize, startTime, endTime, text, openLike } = yield select(state => state.sourcematerial);
        const res = yield call(api.deleteSource, payload);
        if (res) {
          message.success(res.data.message);
          yield put({
            type: 'getSource',
            payload: { pageNum, pageSize, startTime, endTime, text, openLike }
          })
        }
    },

    *batchDeleteSource({ payload }, { call, put, select }) {
        const { pageNum, pageSize, startTime, endTime, openLike } = yield select(state => state.sourcematerial);
        const res = yield call(api.batchDeleteSource, payload);
        if (res) {
          message.success(res.data.message);
          yield put({
            type: 'setParam',
            payload: { 
              sourceIds: [],
              selectedRowKeys: []
            }
          })

          yield put({
            type: 'getSource',
            payload: { pageNum, pageSize, startTime, endTime, openLike }
          })
        }
    },

    *editSource({ payload }, { call, put, select }) {
      const { pageNum, pageSize, startTime, endTime, text, openLike } = yield select(state => state.sourcematerial);
      const res = yield call(api.editSource, payload);
      if (res) {
        message.success(res.data.message);
        yield put({
          type: 'setParam',
          payload: {
            arrId: '',
            explainsArray: '',
            modal4Show: false
          }
        });
        yield put({
          type: 'getSource',
          payload: { pageNum, pageSize, startTime, endTime, text, openLike }
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
