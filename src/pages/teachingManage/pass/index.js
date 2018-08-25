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

import { Form, Input, Button, Popconfirm, Modal, Icon, message, DatePicker } from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const PartPass = ({
    partPass,
    location,
    ...props
}) => {
    let { dispatch, form } = props;
    let { tableData, modalShow, subjectList} = partPass;
    let { getFieldDecorator, validateFieldsAndScroll, resetFields, setFieldsValue } = form;

    const columns = [
        {
            title: '关卡标题',
            dataIndex: 'title',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改关卡标题'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'partPass/updatePass',
							payload: {
								id: record.id,
								title: v
							}
						})
					}/>
        }, {
        	title: '图片',
        	dataIndex: 'icon',
            sorter: true,
            render: (text, record, index) => {
                return (text) ? <a href={ text } target='_blank'><img src={ text } style={{ width: 50, height: 35 }}/></a> : <span>无</span>
            }
        }, {
        	title: '修改图片',
        	dataIndex: 'updateicon',
            render: (text, record, index) => {
                return <MyUpload uploadSuccess={(url) => {
                    changeIcon(url, record)
                }} uploadTxt={0}></MyUpload>
            }
        }, {
        	title: '闯关人数',
        	dataIndex: 'customerNumber',
            sorter: true
        }, {
        	title: '关卡顺序',
        	dataIndex: 'sort',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改关卡顺序'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'partPass/updatePass',
							payload: {
								id: record.id,
								sort: v
							}
						})
					}/>
        }, {
        	title: '总分数',
        	dataIndex: 'totalScore',
            sorter: true
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
                        <Button type="danger" size="small" style={{ marginLeft: 10 }}>删除</Button>
                    </Popconfirm>
                </span>
            }
        }
    ]
    
    

    /**
     * 删除角色
     * @param  {object} 列数据
     */
    const handleDelete = (param) => {
        dispatch({
    		type: 'partPass/deletePass',
    		payload: param.id
    	})
    }

    // 修改素材
    const changeIcon = (url, record) => {
        dispatch({
    		type: 'partPass/updatePass',
    		payload: {
                id: record.id,
                icon: url
            }
    	})
    }
    
    // 展示modal
    const changeModalState = (show) => {
        dispatch({
        	type: 'partPass/setParam',
        	payload: {
                modalShow: show
            }
        })
    }

    // 表单取消
    const handleReset  = () => {
        resetFields()
        dispatch({
    		type: 'partPass/setParam',
    		payload: {
    			modalShow: false
    		}
    	})
    }

    // 添加单元
    const handleSubmit = (e) => {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            !err && dispatch({
                type: 'partPass/addPass',
                payload: filterObj(values)
            })
        });
    }

    // 文件上传成功
    const uploadSuccess = (url) => {
        setFieldsValue({'icon': url})
    }
   
	return (
		<div>
			<FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>
                    <FormItem>
                        <Button type="primary" onClick={() => changeModalState(true)}>添加关卡</Button>
                    </FormItem>
                </Form>
            </FormInlineLayout>

            <Modal
                title="新增关卡"
                visible={modalShow}
                onOk={ () => changeModalState(false) }
                onCancel= { () => changeModalState(false) }
                okText="确认"
                cancelText="取消"
                footer={null}
                >
                <Form>
                    <FormItem
                        label="关卡标题"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入关卡标题!', whitespace: true }],
                        })(
                            <Input placeholder="请输入关卡标题"/>
                        )}
                    </FormItem>

                    <FormItem
                        label="关卡图片"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('icon', {
                            rules: [{
                                message: '请上传关卡图片!', 
                                whitespace: true
                            }],
                        })(
                            <MyUpload uploadSuccess={uploadSuccess}></MyUpload>
                        )}
                    </FormItem>

                    <FormItem
                        label="partsId"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('partsId', {
                            rules: [{ required: true, message: '请输入partsId!', whitespace: true }],
                        })(
                            <Input placeholder="请输入partsId"/>
                        )}
                    </FormItem>

                    <FormItem
                        label="关卡顺序"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('sort', {
                            rules: [{ required: true, message: '请输入关卡顺序!', whitespace: true }],
                        })(
                            <Input placeholder="请输入关卡顺序"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}>
                        <Button type="primary" onClick={handleSubmit} style={{ marginLeft: 75 }}>提交</Button>
                        <Button onClick={handleReset} style={{ marginLeft: 15 }}>取消</Button>
                    </FormItem>
                </Form>
            </Modal>

            <TableLayout
                dataSource={tableData}
                allColumns={columns}
                />
            <PaginationLayout
                total={10}        
                current={1}
                pageSize={10} />
		</div>
	)
};

PartPass.propTypes = {
    partPass: PropTypes.object
};

export default connect(({ partPass }) => ({ partPass }))(Form.create()(PartPass));
	