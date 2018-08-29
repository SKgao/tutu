import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import MyUpload from '@/components/UploadComponent';
import moment from 'moment';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, Input, Button, Modal, Icon, DatePicker, Select, Popconfirm, Radio, Badge } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const Activity = ({
    activity,
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { tableData, selectList, modalShow, addStatus} = activity;
    let { getFieldDecorator, getFieldValue, resetFields, setFieldsValue, validateFieldsAndScroll } = form;

    const columns = [
        {
            title: '活动名称',
            dataIndex: 'title',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改活动名称'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'activity/updateActivity',
							payload: {
								id: record.id,
								title: v
							}
						})
					}/>
        }, {
            title: '活动内容',
            dataIndex: 'content',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改活动内容'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'activity/updateActivity',
							payload: {
								id: record.id,
								content: v
							}
						})
					}/>
        }, {
            title: '活动图片',
            dataIndex: 'icon',
            sorter: true,
            render: (text) => {
               return (text) ? <a href={ text } target='_blank'><img src={ text } style={{ width: 50, height: 35 }}/></a> : <span>无</span>
            }
        }, {
            title: '活动金额',
            dataIndex: 'orgAmount',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改活动金额'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'activity/updateActivity',
							payload: {
								id: record.id,
								orgAmount: (Number(v) / 100).toFixed(2)
							}
						})
					}/>
        }, {
            title: '活动状态',
            dataIndex: 'status',
            sorter: true,
            render: (txt) => {
				switch (txt) {
					case 1:
						return <Badge status="processing" text="启动"/>;
					case 2:
						return <Badge status="error" text="关闭"/>;
				}
			}
        }, {
            title: '活动持续时间',
            dataIndex: 'activeExpireDays',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改活动开始时间'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'activity/updateActivity',
							payload: {
								id: record.id,
								activeExpireDays: v - 0
							}
						})
					}/>
        }, {
            title: '活动开始时间',
            dataIndex: 'beginAt',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改活动开始时间'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'activity/updateActivity',
							payload: {
								id: record.id,
								beginAt: v
							}
						})
					}/>
        }, {
            title: '活动结束时间',
            dataIndex: 'endAt',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改活动结束时间'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'activity/updateActivity',
							payload: {
								id: record.id,
								endAt: v
							}
						})
					}/>
        }, {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true
        }, {
        	title: '操作',
            dataIndex: 'action',
            render: (txt, record, index) => {
                return <span>
                    <Popconfirm title="是否删除?" onConfirm={() => handleDelete(record)}>
                        <Button type="danger" size="small" style={{ marginLeft: 5 }}>删除</Button>
                    </Popconfirm>
                </span>
            }
        }
    ]

    // 删除活动
    const handleDelete = (record) => {
        dispatch({
    		type: 'activity/deleteActivity',
    		payload: {
                id: record.id
            }
    	})
    }

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'activity/setParam',
        	payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }

    // 搜索
    const handleSearch = (param) => {
        dispatch({ type: 'activity/getActivity' })
    }

    // 展示modal
    const changeModalState = (flag, show) => {
        dispatch({
        	type: 'activity/setParam',
        	payload: {
                [flag]: show
            }
        })
    }

    // 选择下拉框
    const changeSelect = (v) => {
    	dispatch({
    		type: 'activity/setParam',
    		payload: v
    	})
    }

    // 表单取消
    const handleReset  = () => {
        resetFields()
        dispatch({
    		type: 'activity/setParam',
    		payload: {
                modalShow: false,
                addStatus: 1
    		}
    	})
    }

    // 添加版本信息
	const handleSubmit = (e) => {
        const { beginAt, endAt } = activity;
		e.preventDefault();
		validateFieldsAndScroll((err, values) => {
			if (!err) {
				values.status = addStatus;
                values.activeMoney && (values.activeMoney = values.activeMoney - 0);
                values.activeExpireDays && (values.activeExpireDays = values.activeExpireDays - 0);
                values.userLevel && (values.userLevel = values.userLevel - 0);
                values.itemId && (values.itemId = values.itemId - 0);
                values.beginAt = beginAt;
                values.endAt = endAt;
				dispatch({
					type: 'activity/addActivity',
					payload: filterObj(values)
				})
			}
		});
    }
    
    // 切换活动类型
    const changeAddstatus = (e) => {
        dispatch({
    		type: 'activity/setParam',
    		payload: {
    			addStatus: e.target.value - 0
    		}
    	})
    }

    // 设置表单时间
    const onChangeDate = (a, b, c) => {
        dispatch({
    		type: 'activity/setParam',
    		payload: {
    			[c]: b
    		}
    	})
    }

    // 文件上传成功
    const uploadSuccess = (url) => setFieldsValue({'icon': url})
   
	return (
		<div>
			<FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>
                    {/*时间*/}
                    <FormItem label="活动时间">
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

                    {/*活动筛选*/}
                    <FormItem label="活动筛选">
                        <Select
                            showSearch
                            onFocus={() => dispatch({type: 'activity/activeSelect'})}
                            onChange={v => changeSelect({id: v})}
                            >
                            {
                                selectList.map(item =>
                                    <Option key={item.id} value={item.id}>{item.title}</Option>
                                )
                            }
                        </Select>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={() => changeModalState('modalShow', true)}>添加活动</Button>
                    </FormItem>

                </Form>

                <Modal
                    title="新增活动"
                    visible={modalShow}
                    onCancel= { () => changeModalState('modalShow', false) }
                    okText="确认"
                    cancelText="取消"
                    footer={null}
                    >
                    <Form>
                        <FormItem
                            label="活动标题"
                            {...formItemLayout}
                            >
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: '请输入活动标题!' }],
                            })(
                                <Input placeholder="请输入活动标题"/>                            
                            )}
                        </FormItem>

                        <FormItem
                            label="活动开始时间"
                            {...formItemLayout}
                            >
                            {getFieldDecorator('beginAt', {
                                rules: [{ required: true, message: '请选择活动开始时间!' }],
                            })(
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择活动开始时间"
                                    onChange={ (a, b) => onChangeDate(a, b, 'beginAt') }
                                    />
                            )}
                        </FormItem>

                        <FormItem
                            label="活动结束时间"
                            {...formItemLayout}
                            >
                            {getFieldDecorator('endAt', {
                                rules: [{ required: true, message: '请选择活动结束时间!' }],
                            })(
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择活动结束时间"
                                    onChange={ (a, b) => onChangeDate(a, b, 'endAt') }
                                    />
                            )}
                        </FormItem>

                        <FormItem
                            label="活动持续时间"
                            {...formItemLayout}
                            >
                            {getFieldDecorator('activeExpireDays', {
                                rules: [{ required: true, message: '请输入活动持续时间!' }],
                            })(
                                <Input placeholder="活动持续时间（以天为单位）"/>
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="活动类型"
                            >
                            {getFieldDecorator('status', {
                                initialValue: 1
                            })(
                                <RadioGroup onChange={changeAddstatus}>
                                    <Radio value={1}>购买活动</Radio>
                                    <Radio value={2}>分享活动</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        
                        {   addStatus === 1 &&
                            <FormItem
                                {...formItemLayout}
                                label="参与活动商品"
                                >
                                {getFieldDecorator('activeMoney', {
                                    rules: [{ required: true, message: '输入会员等级!' }],
                                })(
                                    <Input placeholder="输入会员等级"/>                            
                                )}
                            </FormItem>
                        }

                        {   addStatus === 1 &&
                            <FormItem
                                {...formItemLayout}
                                label="活动价格"
                                >
                                {getFieldDecorator('itemId', {
                                    rules: [{ required: true, message: '请输入活动价格!' }],
                                })(
                                    <Input placeholder="请输入活动价格"/>                            
                                )}
                            </FormItem>
                        }

                        {   addStatus === 1 &&
                            <FormItem
                                {...formItemLayout}
                                label="用户等级"
                                >
                                {getFieldDecorator('userLevel', {
                                    rules: [{ required: false }],
                                })(
                                    <Input placeholder="请输入用户等级"/>                            
                                )}
                            </FormItem>
                        }

                        <FormItem
                            {...formItemLayout}
                            label="活动内容"
                            >
                            {getFieldDecorator('content', {
                                rules: [{ required: false }],
                            })(
                                <TextArea placeholder="请输入活动内容" autosize={{ minRows: 3, maxRows: 6 }} />                         
                            )}
                        </FormItem>  

                        <FormItem
                            label="活动图片"
                            {...formItemLayout}
                            >
                            <MyUpload uploadSuccess={uploadSuccess}></MyUpload>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="活动链接"
                            >
                            {getFieldDecorator('url', {
                                rules: [{ required: false }],
                            })(
                                <Input placeholder="请输入活动链接"/>                            
                            )}
                        </FormItem>                   

                        <FormItem
                            {...formItemLayout}>
                            <Button type="primary" onClick={handleSubmit} style={{ marginLeft: 75 }}>提交</Button>
                            <Button onClick={handleReset} style={{ marginLeft: 15 }}>取消</Button>
                        </FormItem>
                    </Form>
                </Modal>
            </FormInlineLayout>

            <TableLayout
                dataSource={tableData}
                allColumns={columns}
                loading={ loading.effects['activity/getActivity'] }
                />
		</div>
	)
};

Activity.propTypes = {
    activity: PropTypes.object
};

export default connect(({ activity, loading }) => ({ activity, loading }))(Form.create()(Activity));
	