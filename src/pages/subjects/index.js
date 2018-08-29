import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import UploadProgress from '@/components/UploadProgress';
import moment from 'moment';
import { axios } from '@/configs/request';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, DatePicker, Input, Button, notification, Modal, Select, Icon, Upload, Tabs, Card, Col, Row, message, Popconfirm, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

const Subject = ({
    subject,
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { modalShow, modal2Show, startTime, endTime, pageNum, pageSize, customsPassId, sourceIds, activeKey, customsPassName} = subject;
    let { getFieldDecorator, setFieldsValue, resetFields } = form;
    
    // 题目列表
    const subjectCol = [
        {
            title: '教材名称',
            dataIndex: 'textBookName',
            sorter: true
        }, {
            title: '单元名称',
            dataIndex: 'unitsName',
            sorter: true
        }, {
            title: 'part描述',
            dataIndex: 'partsTips',
            sorter: true
        }, {
            title: 'part标题',
            dataIndex: 'partsTitle',
            sorter: true
        }, {
            title: '关卡名称',
            dataIndex: 'customsPassName',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改关卡名称'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'subject/updateSubject',
							payload: {
                                customsPassId: record.customsPassId - 0,
                                sort: record.sort - 0,
								customsPassName: v
							}
						})
					}/>
        }, {
            title: '题目内容',
            dataIndex: 'sourceIds',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改题目内容'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'subject/updateSubject',
							payload: {
                                customsPassId: record.customsPassId - 0,
                                sort: record.sort - 0,
								sourceIds: v
							}
						})
					}/>
        }, {
            title: '题目顺序',
            dataIndex: 'sort',
            sorter: true
        }
    ]
    
    // 关卡详情列表
    const descCol = [
        {
            title: '关卡id',
            dataIndex: 'customsPassId',
            sorter: true
        }, {
            title: '题目',
            dataIndex: 'sourceIds',
            sorter: true
        }, {
            title: '题目顺序',
            dataIndex: 'sort',
            sorter: true
        }, {
            title: '素材包',
            dataIndex: 'action',
            render: (text) => <span>点击表格查看素材包</span>
        }
    ]

    const columns = (customsPassId) ? descCol : subjectCol
    const dataSource = (customsPassId) ? subject.descList : subject.subjectList

    const openNotification = () => {
        notification.open({
            duration: 1,
            message: '暂不支持查看素材包~',
            description: '请等待后续开发。',
            icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />
        });
      }
    
    const expandedRowRender = () => {
        const sourceCol = [
            { 
                title: '题目', 
                dataIndex: 'text',
                key: '_text' 
            }, { 
                title: '图标', 
                dataIndex: 'icon',
                key: '_icon',
                render: (text) => {
                    return (!text) ? <span>无</span> :
                        <Popconfirm icon={<img src={ text } style={{ width: 110, height: 120 }}/>} cancelText="取消" okText="确定">
                            <img src={ text } style={{ width: 30, height: 40 }}/>
                        </Popconfirm>
                }
            }, { 
                title: '音频', 
                dataIndex: 'audio',
                key: '_audio',
                render: (audio) => {
                    return (audio) ? <audio src={audio} controls="controls"></audio> : <span>无</span>
                 }
            },
        ]

        return (
            <Table
              columns={sourceCol}
              dataSource={dataSource[0].sourceVOS}
              pagination={false}
            />
          )
    }

    // 添加题目
    const handleSubmitSubject = () => {
        let { textbookId, file } = subject
        let formData = new FormData()
        formData.append('textbookId', textbookId)
        file[0] && formData.append('file', file[0])
        axios.post('subject/subject/import', formData)
            .then((res) => {
                if (res.data.code === 0) {
                    dispatch({
                        type: 'subject/setParam',
                        payload: {
                            file: [],
                            modalShow: false,
                            activeKey: '1'
                        }
                    })
                } else {
                    message.error(res.data.message)
                }
            })
    }

    // 添加题目资源(音频集合、图片集合)
    const handleSubmitSource = () => {
        let { audioArray, imageArray } = subject
        dispatch({
        	type: 'subject/addSource',
        	payload: { audioArray, imageArray }
        })
    }
    
    // 展示modal
    const changeModalState = (_m, show) => {
        dispatch({
        	type: 'subject/setParam',
        	payload: {
                [_m]: show
            }
        })
    }

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'subject/setParam',
        	payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }

    // 表单取消
    const handleReset  = (_m) => {
        resetFields()
        dispatch({
    		type: 'subject/setParam',
    		payload: {
    			[_m]: false
    		}
    	})
    }

    // 返回
    const goBack = () => dispatch(routerRedux.goBack(-1))

    // 搜搜题目
    const handleSearch = () => {
        dispatch({
    		type: 'subject/getSubject',
    		payload: filterObj({ startTime, endTime, sourceIds, customsPassName, pageNum, pageSize })
    	})
    }
   
    const handleChange = (param) => {
        dispatch({
    		type: 'subject/setParam',
    		payload: param
        })
        dispatch({
    		type: 'subject/getSubject',
    		payload: filterObj({ startTime, endTime, sourceIds, customsPassName, ...param })
    	})
    }

    // 上传音频、图片目录
    const uploadFileArray = (file, fileList, array) => {
        dispatch({
            type: 'subject/setParam',
            payload: {
                [array]: fileList.map(e => (array === 'file') ? e : e.name)
            }
        })
        return false;
    }

    // 改版教材id
    const changeTextBookId = (param) => {
        dispatch({
    		type: 'subject/setParam',
    		payload: param
        })
    }

    // 输入题目名
    const handleInput = (e) => {
        dispatch({
    		type: 'subject/setParam',
    		payload: {
                customsPassName: e.target.value
            }
        })
    }

    // 切换tabs标签页
    const handleTabChange = (key = '0') => {
    	dispatch({
    		type: 'subject/setParam',
    		payload: {
				activeKey: key
			}
    	})
	}

	return (
		<div>
            <Tabs
                animated={false}
                activeKey={activeKey}
				onChange={handleTabChange}
            >
                <TabPane tab="题目列表" key="0">
                    <FormInlineLayout>
                        <Form layout="inline" style={{ marginLeft: 15 }}>
                            {/*时间*/}
                            <FormItem label="时间">
                                <RangePicker
                                    format="YYYY-MM-DD HH:mm"
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                                    }}
                                    format="YYYY-MM-DD HH:mm"
                                    onChange={datepickerChange}
                                    />
                            </FormItem>

                            {/*关卡名称*/}
                            <FormItem label="关卡名称">
                                <Input placeholder="输入关卡名称名" onChange={(e) => handleInput(e)}/>
                            </FormItem>

                            <FormItem>
                                <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                            </FormItem>

                            {/* <FormItem>
                                <Button type="primary" onClick={() => changeModalState('modal2Show', true)}>导入素材</Button>
                            </FormItem> */}

                            <FormItem>
                                <Button type="primary" onClick={() => changeModalState('modalShow',true)}>导入题目</Button>
                            </FormItem>
                            
                            {
                                !customsPassId  ? null : 
                                <FormItem>
                                    <a className={'link-back'} onClick={goBack}><Icon type="arrow-left"/>后退</a>
                                </FormItem>
                            }

                        </Form>
                    </FormInlineLayout>

                    <Modal
                        title="导入题目"
                        visible={modalShow}
                        onOk={ () => changeModalState('modalShow', false) }
                        onCancel= { () => changeModalState('modalShow', false) }
                        okText="确认"
                        cancelText="取消"
                        footer={null}
                        >
                        <Form>
                            <FormItem
                                label="教材"
                                hasFeedback
                                {...formItemLayout}
                                >
                                {getFieldDecorator('textbookId', {
                                    initialValue: subject.textbookId,
                                    rules: [{ required: true, message: '请选择教材!' }],
                                })(
                                    <Select
                                        showSearch
                                        onChange={v => changeTextBookId({ textbookId: v })}
                                        onFocus={() => dispatch({type: 'subject/getBook'})}
                                        >
                                        {
                                            subject.bookList.map(item =>
                                                <Option key={item.id} value={item.id}>{item.name}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem
                                label="题目"
                                {...formItemLayout}
                                >
                                {getFieldDecorator('file', {
                                    rules: [{ required: true, message: '请上传题目包!' }],
                                })(
                                    <Upload beforeUpload={(a, b) => uploadFileArray(a, b, 'file')}>
                                        <Button>
                                            <Icon type="upload"/>上传题目
                                        </Button>
                                    </Upload>
                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}>
                                <Button type="primary" onClick={handleSubmitSubject} style={{ marginLeft: 75 }}>提交</Button>
                                <Button onClick={() => handleReset('modalShow')} style={{ marginLeft: 15 }}>取消</Button>
                            </FormItem>
                        </Form>
                    </Modal>

                    <Modal
                        title="导入素材"
                        visible={modal2Show}
                        onOk={ () => changeModalState('modal2Show', false) }
                        onCancel= { () => changeModalState('modal2Show', false) }
                        okText="确认"
                        cancelText="取消"
                        footer={null}
                        >
                        <Form>
                            <FormItem
                                label="音频文件目录"
                                {...formItemLayout}
                                >
                                {getFieldDecorator('audioArray', {
                                    // rules: [{ message: '请上传音频素材!' }],
                                })(
                                    <Upload beforeUpload={(a, b) => uploadFileArray(a, b, 'audioArray')} directory multiple showUploadList={false}>
                                        <Button>
                                            <Icon type="upload"/>上传音频
                                        </Button>
                                    </Upload>
                                )}
                            </FormItem>

                            <FormItem
                                label="图片文件目录"
                                {...formItemLayout}
                                >
                                {getFieldDecorator('imageArray', {
                                // rules: [{ message: '请上传图片素材!' }],
                                })(
                                    <Upload beforeUpload={(a, b) => uploadFileArray(a, b, 'imageArray')} directory multiple showUploadList={false}>
                                        <Button>
                                            <Icon type="upload"/>上传图片
                                        </Button>
                                    </Upload>
                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}>
                                <Button type="primary" onClick={handleSubmitSource} style={{ marginLeft: 45 }}>提交</Button>
                                <Button onClick={() => handleReset('modal2Show')} style={{ marginLeft: 15 }}>取消</Button>
                            </FormItem>
                        </Form>
                    </Modal>

                    <div>
                        <TableLayout
                            pagination={false}
                            dataSource={dataSource}
                            allColumns={columns}
                            expandedRowRender={customsPassId ? expandedRowRender : null}
                            expandRowByClick={true}
                            loading={ loading.effects['subject/getSubject'] }
                            />
                        {
                            customsPassId ? null :
                            <PaginationLayout
                                total={subject.totalCount}
                                onChange={(page, pageSize) => handleChange({
                                    pageNum: page,
                                    pageSize
                                })}
                                onShowSizeChange={(current, pageSize) => handleChange({
                                    pageNum: 1,
                                    pageSize
                                })}
                                current={pageNum}
                                pageSize={pageSize} />
                        }
                    </div>
                </TabPane>
                
                {
                    (customsPassId || activeKey === '0') ? null :
                    <TabPane tab="上传进度" key="1">
                        <UploadProgress
                           cardTitle={'题目上传进度'}
                           url={'subject/subject/import/progress'}
                        >
                        </UploadProgress>
                    </TabPane>
                }
            </Tabs>
		</div>
	)
};

Subject.propTypes = {
    subject: PropTypes.object
};

export default connect(({ subject, loading }) => ({ subject, loading }))(Form.create()(Subject));
	