import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, Input, Button, Modal, Select, Pagination, Radio} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const CourseUser = ({
    courseUser,
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { tableList, pageNum, pageSize, totalCount, modalShow, bookList} = courseUser;
    let { getFieldDecorator, resetFields, validateFieldsAndScroll } = form;

    const allColumns = [
        {
            title: '精品课程名称',
            dataIndex: 'textbookName',
            sorter: true
        },
        {
            title: '图图号',
            dataIndex: 'tutuNumber',
            sorter: true
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            sorter: true,
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '用户名',
            dataIndex: 'realName',
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '性别',
            dataIndex: 'sex',
            sorter: true,
            render: (text) => <span>{ text === 1 ? '男' :  '女' }</span>
        }, {
            title: '付款金额',
            dataIndex: 'payAmt',
            sorter: true,
            render: (text) => (Number(text) / 100).toFixed(2) + '元'
        }, {
            title: '购买时间',
            dataIndex: 'buyAt'
        }, {
            title: '开课时间',
            dataIndex: 'beginAt'
        }, {
            title: '结课时间',
            dataIndex: 'endAt'
        },
    ]

    // 调转到关卡页面
    const linktoCourse= (record) => {
        dispatch(routerRedux.push({
            pathname: '/specialCourse',
            search: `userId=${record.tutuNumber}`
        }))
    }

    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'courseUser/setParam',
    		payload: param
        })
        dispatch({ type: 'courseUser/getUser' })
    }

    // 搜索
    const handleSearch = (param) => {
        dispatch({
			type: 'courseUser/setParam',
			payload: {
				pageSize: 10,
				pageNum: 1
			}
        })
        dispatch({ type: 'courseUser/getUser' })
    }

    // 选择下拉框
    const changeSelect = (v) => {
    	dispatch({
    		type: 'courseUser/setParam',
    		payload: v
    	})
    }

    // 输入框
    const handleInput = (e, m) => {
        dispatch({
    		type: 'courseUser/setParam',
    		payload: {
                [m]: e.target.value
            }
    	})
    }

    // 时间选择
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'courseUser/setParam',
        	payload: {
                expireStartTime: t[0] ? t[0] + ':00' : '',
                expireEndTime: t[1] ? t[1] + ':00' : ''
            }
        })
    }

    // 时间选择
    const datepickerChange2 = (d, t) => {
        dispatch({
        	type: 'courseUser/setParam',
        	payload: {
                payStartTime: t[0] ? t[0] + ':00' : '',
                payEndTime: t[1] ? t[1] + ':00' : ''
            }
        })
    }

    // 时间选择
    const datepickerChangeReg = (d, t) => {
        dispatch({
        	type: 'courseUser/setParam',
        	payload: {
                registerStartTime: t[0] ? t[0] + ':00' : '',
                registerEndTime: t[1] ? t[1] + ':00' : ''
            }
        })
    }

    // 展示modal
    const changeModalState = (flag, show) => {
        dispatch({
        	type: 'courseUser/setParam',
        	payload: {
                [flag]: show
            }
        })
    }

    // 添加用户信息
	const handleSubmit = (e) => {
		e.preventDefault();
		validateFieldsAndScroll((err, values) => {
			if (!err) {
                values.sex && (values.sex = values.sex - 0);
                values.textbookId && (values.textbookId = values.textbookId - 0);
                values.payAmt && (values.payAmt = values.payAmt * 100);
                dispatch({
                    type: 'courseUser/addMember',
                    payload: filterObj(values)
                }).then(() => {
                    handleReset()
                })
			}
		});
    }

    // 表单取消
    const handleReset  = () => {
        resetFields()
        dispatch({
    		type: 'courseUser/setParam',
    		payload: {
                modalShow: false
    		}
    	})
    }

	return (
		<div>
            <FormInlineLayout>
                <Form layout="inline" style={{ marginLeft: 15 }}>
                <FormItem label="精品课程">
                    <Select
                        showSearch
                        onFocus={() => dispatch({type: 'courseUser/getBooklist'})}
                        placeholder="请选择精品课程"
                        onChange={v => changeSelect({ textbookId: v })}
                        >
                        {
                            [{textbookId: '', textbookName: '全部'}, ...bookList].map(item =>
                                <Option key={item.textbookId} value={item.textbookId}>{item.textbookName + ''}</Option>
                            )
                        }
                    </Select>
                </FormItem>

                    <FormItem label="图图号">
                        <Input placeholder="输入图图号" value={courseUser.tutuNumber} onChange={(e) => handleInput(e, 'tutuNumber')}/>
                    </FormItem>

                    <FormItem label="手机号">
                        <Input placeholder="输入手机号" value={courseUser.mobile} onChange={(e) => handleInput(e, 'mobile')}/>
                    </FormItem>

                    <FormItem label="用户名">
                        <Input placeholder="输入用户名" value={courseUser.realName} onChange={(e) => handleInput(e, 'mobile')}/>
                    </FormItem>

                    <FormItem label="性别">
                        <Select
                            showSearch
                            placeholder="请选择性别"
                            onChange={v => changeSelect({ sex: v })}
                            >
                            <Option key={0} value={''}>全部</Option>
                            <Option key={1} value={1}>男</Option>
                            <Option key={2} value={2}>女</Option>
                        </Select>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={() => changeModalState('modalShow', true)}>开通精品课程</Button>
                    </FormItem>

                </Form>
            </FormInlineLayout>


            <Modal
                title="开通精品课程"
                visible={modalShow}
                onCancel= { () => changeModalState('modalShow', false) }
                okText="确认"
                cancelText="取消"
                footer={null}
                >
                <Form>
                    <FormItem
                        label="用户名"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('realName', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input placeholder="请输入用户名"/>
                        )}
                    </FormItem>

                    <FormItem
                        label="手机号"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('mobile', {
                            rules: [{ required: true, message: '手机号格式有误!', pattern: /^[1][3,4,5,7,8][0-9]{9}$/ }],
                        })(
                            <Input placeholder="请输入手机号"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="性别"
                        >
                        {getFieldDecorator('sex', {
                            initialValue: '1'
                        })(
                            <RadioGroup>
                                <Radio value='1'>男</Radio>
                                <Radio value='2'>女</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        label="付款金额"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('payAmt', {
                            rules: [{ required: true, message: '请输入付款金额!' }],
                        })(
                            <Input placeholder="请输入付款金额"/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="精品课程"
                        >
                        {getFieldDecorator('textbookId', {
                            rules: [{ required: true, message: '请选择精品课程!' }],
                        })(
                            <Select
                                showSearch
                                onFocus={() => dispatch({type: 'courseUser/getBooklist'})}
                                placeholder="请选择精品课程"
                                >
                                {
                                    bookList.map(item =>
                                        <Option key={item.textbookId} value={item.textbookId}>{item.textbookName + ''}</Option>
                                    )
                                }
                            </Select>
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
                dataSource={tableList}
                allColumns={allColumns}
                loading={ loading.effects['courseUser/getUser'] }
                scrollX={true}
                />

            <div className="main-pagination">
                {
                    totalCount > 0 ? <div className="pagination-info">总人数 <span className="mr10">{totalCount}</span> 第 <span>{pageNum}</span> / {Math.ceil(totalCount/pageSize)} 页</div> : null
                }
                <Pagination
                    showSizeChanger
                    showQuickJumper
                    hideOnSinglePage
                    pageSizeOptions={['10', '20', '50', '100']}
                    onChange={(page, pageSize) => handleChange({
                        pageNum: page,
                        pageSize
                    })}
                    onShowSizeChange={(current, pageSize) => handleChange({
                        pageNum: 1,
                        pageSize
                    })}
                    total={totalCount}
                    current={pageNum}
                    pageSize={pageSize} />
            </div>
		</div>
	)
};

CourseUser.propTypes = {
    courseUser: PropTypes.object
};

export default connect(({ courseUser, loading }) => ({ courseUser, loading }))(Form.create()(CourseUser));
