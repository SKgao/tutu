import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import VaildForm from './VaildForm';

import { filterObj } from '@/utils/tools';

import { Form, DatePicker, Input, Button, Popconfirm, message, Modal } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const UserSetting = ({
    userSetting,
    ...props
}) => {
    let { dispatch } = props;
    let { tableData, account, startTime, endTime, modalShow, avatar, roleList } = userSetting;
    const columns = [
        {
            title: '用户名',
            dataIndex: 'account',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改用户名'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'userSetting/updateUser',
							payload: {
								id: record.id,
								account: v
							}
						})
					}/>
        }, {
        	title: '用户头像',
            dataIndex: 'avatar',
            render: (text) => {
               return (text) ? <a href={ text } target='_blank'><img src={ text } style={{ width: 50, height: 35 }}/></a> : <span>无</span>
            }
        }, {
        	title: '手机号',
            dataIndex: 'phone',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改手机号'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'userSetting/updateUser',
							payload: {
								id: record.id,
								phone: v
							}
						})
					}/>
        }, {
        	title: '邮箱',
            dataIndex: 'email',
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改邮箱'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'userSetting/updateUser',
							payload: {
								id: record.id,
								email: v
							}
						})
					}/>
        }, {
        	title: '姓名',
            dataIndex: 'name',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改姓名'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'userSetting/updateUser',
							payload: {
								id: record.id,
								name: v
							}
						})
					}/>
        }, {
        	title: '性别',
            dataIndex: 'sex',
        	sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改性别'}
					valueData={ (text == 1) ? '男' : (text == 2) ? '女' : '未知' }
					defaultValue={ (text == 1) ? '男' : (text == 2) ? '女' : '未知' }
					onOk={v => 
						dispatch({
							type: 'userSetting/updateUser',
							payload: {
								id: record.id,
								sex: v
							}
						})
					}/>
        }, {
        	title: '用户id',
        	dataIndex: 'id',
        	sorter: true
        }, {
        	title: '角色',
        	dataIndex: 'roleName',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改角色'}
					valueData={roleList}
					focusSelect={() => dispatch({type: 'userSetting/getRoleList'})}
					optionKey={'id'}
					optionItem={'name'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'userSetting/updateUser',
							payload: {
								id: record.id,
								roleId: v - 0
							}
						})
					}/>
        }, {
        	title: '创建时间',
        	dataIndex: 'createtime',
        	sorter: true
        }, {
        	title: '操作',
            dataIndex: 'action',
            render: (txt, record, index) => {
                return <span>
                    <Button type="primary" size="small" onClick={() => handleUsing(record)}>启动</Button>
                    <Button size="small" style={{ marginLeft: 5 }} onClick={() => handleForbidden(record)}>禁用</Button>
                    <Popconfirm title="是否删除?" onConfirm={() => handleDelete(record)}>
                        <Button type="danger" size="small" style={{ marginLeft: 5 }}>删除</Button>
                    </Popconfirm>
                </span>
            }
        }
    ]
    
    /**
     * 删除用户
     * @param  {object} 列数据
     */
    const handleDelete = (param) => {
        dispatch({
    		type: 'userSetting/deleteUser',
    		payload: param.id
    	})
    }

    /**
     * 启用
     * @param  {object} 列数据
     */
    const handleUsing = (param) => {
    	dispatch({
    		type: 'userSetting/usingUser',
    		payload: param.id
    	})
    }

    /**
     * 禁用
     * @param  {object} 列数据
     */
    const handleForbidden = (param) => {
    	dispatch({
    		type: 'userSetting/forbiddenUser',
    		payload: param.id
    	})
    }

    // 输入用户名
    const handleInput = (e) => {
        dispatch({
    		type: 'userSetting/setParam',
    		payload: {
                account: e.target.value
            }
    	})
    }
    
    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'userSetting/setParam',
        	payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }

    // 搜索
    const handleSearch = () => {
        let PP = {
            pageNum: 1,
            pageSize: 10,
            startTime: startTime,
            endTime: endTime,
            account: account
        }
     	dispatch({
    		type: 'userSetting/getUser',
    		payload: filterObj(PP)
    	})
    }
    
    // 展示modal
    const changeModalState = (show) => {
        dispatch({
        	type: 'userSetting/setParam',
        	payload: {
                modalShow: show
            }
        })
    }

    // 提交表单
    const submitForm = (userinfo) => {
        avatar && (userinfo.avatar = avatar);
        dispatch({
        	type: 'userSetting/addUser',
        	payload: filterObj(userinfo)
        })
    }

    // 获取角色列表
    const getRoleList = () => {
        dispatch({ type: 'userSetting/getRoleList' })
    }

    // 确认密码
    // const compareToFirstPassword = (rule, value, callback) => {
    // 	if (value && value !== getFieldValue('password')) {
    // 		callback('两次密码输入不相同！');
    // 	} else {
    // 		callback();
    // 	}
    // }

	return (
		<div>
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

                    {/*用户名*/}
                    <FormItem label="用户名">
                        <Input placeholder="输入用户名" value={account} onChange={(e) => handleInput(e)}/>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={() => changeModalState(true)}>添加用户</Button>
                    </FormItem>

                </Form>
            </FormInlineLayout>

            <Modal
                title="新增用户"
                visible={modalShow}
                onOk={ () => changeModalState(false) }
                onCancel= { () => changeModalState(false) }
                okText="确认"
                cancelText="取消"
                footer={null}
                >
                <VaildForm 
                    submitForm={submitForm}
                    getRoleList={getRoleList}
                    roleList={roleList}
                    resetForm={() => changeModalState(false)}
                    >
                </VaildForm>
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

UserSetting.propTypes = {
    userSetting: PropTypes.object
};

export default connect(({ userSetting }) => ({ userSetting }))(UserSetting);
	