import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import MyUpload from '@/components/UploadComponent';

import moment from 'moment';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, Input, Button, Popconfirm, Modal, Icon, message, Select, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const UnitPart = ({
    unitPart,
    location,
    ...props
}) => {
    let { dispatch, form } = props;
    let { partList, modalShow, pageNum, pageSize} = unitPart;
    let { getFieldDecorator, validateFieldsAndScroll, resetFields, setFieldsValue } = form;

    const columns = [
        {
            title: 'part名称',
            dataIndex: 'title',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改part名称'}
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
            render: (text) => {
                return (text) ? <a href={ text } target='_blank'><img src={ text } style={{ width: 50, height: 35 }}/></a> : <span>无</span>
             }
        }, {
        	title: '修改图片',
        	dataIndex: 'updateicon',
            render: (text, record, index) => {
                return <MyUpload uploadSuccess={(url) => {
                    changeIcon(url, record)
                }}></MyUpload>
            }
        },{
            title: 'part描述',
            dataIndex: 'tips',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改part描述'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'partPass/updatePass',
							payload: {
								id: record.id,
								tips: v
							}
						})
					}/>
        }, {
        	title: '操作',
            dataIndex: 'action',
            render: (txt, record, index) => {
                return <span>
                    <Popconfirm title="是否删除?" onConfirm={() => handleDelete(record)}>
                        <Button type="danger" size="small" style={{ marginLeft: 10 }}>删除</Button>
                    </Popconfirm>

                    <Button type="primary" size="small" onClick={() => linktoPass(record)} style={{ marginLeft: 10 }}>查看关卡</Button>
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
    		type: 'unitPart/deletePart',
    		payload: param.id
    	})
    }

    // 调转到关卡页面
    const linktoPass = (record) => {
        dispatch(routerRedux.push({
            pathname: '/teachingManage/pass',
            search: `partsId=${record.id}`
        }));
    }

    // 修改素材
    const changeIcon = (url, record) => {
        dispatch({
    		type: 'unitPart/updatePart',
    		payload: {
                id: record.id,
                icon: url
            }
    	})
    }
    
    // 展示modal
    const changeModalState = (show) => {
        dispatch({
        	type: 'unitPart/setParam',
        	payload: {
                modalShow: show
            }
        })
    }

    // 表单取消
    const handleReset  = () => {
        resetFields()
        dispatch({
    		type: 'unitPart/setParam',
    		payload: {
    			modalShow: false
    		}
    	})
    }

    // 添加单元
    const handleSubmit = (e) => {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            values.unitsId && (values.unitsId = values.unitsId - 0);
            !err && dispatch({
                type: 'unitPart/addPart',
                payload: filterObj(values)
            })
        });
    }
    
    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'unitPart/setParam',
    		payload: param
        })
        dispatch({
    		type: 'unitPart/getPart',
    		payload: param
    	})
    }

    // 文件上传成功
    const uploadSuccess = (url) => setFieldsValue({'icon': url})

    // 返回
    const goBack = () => dispatch(routerRedux.goBack(-1))
   
	return (
		<div>
			<FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>
                    <FormItem>
                        <Button type="primary" onClick={() => changeModalState(true)}>添加Part</Button>
                    </FormItem>

                    <FormItem>
                        <a className={'link-back'} onClick={goBack}><Icon type="arrow-left"/>后退</a>
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
                        label="part名称"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入part名称!', whitespace: true }],
                        })(
                            <Input placeholder="请输入part名称"/>
                        )}
                    </FormItem>

                    <FormItem
                        label="part图片"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('icon', {
                            rules: [{
                                message: '请上传part图片!', 
                                whitespace: true
                            }],
                        })(
                            <MyUpload uploadSuccess={uploadSuccess}></MyUpload>
                        )}
                    </FormItem>

                    <FormItem
                        label="单元id"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('unitsId', {
                            rules: [{ required: true, message: '请输入单元id!', whitespace: true }],
                        })(
                            <Input placeholder="请输入单元id"/>
                        )}
                    </FormItem>

                    <FormItem
                        label="part描述"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('tips', {
                            rules: [{ required: true, message: '请输入part描述!', whitespace: true }],
                        })(
                            <TextArea placeholder="请输入part描述!" autosize={{ minRows: 3, maxRows: 6 }} />
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
                pagination={false}
                dataSource={partList}
                allColumns={columns}
                />
            <PaginationLayout
                total={unitPart.totalCount}
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
		</div>
	)
};

UnitPart.propTypes = {
    unitPart: PropTypes.object
};

export default connect(({ unitPart }) => ({ unitPart }))(Form.create()(UnitPart));
	