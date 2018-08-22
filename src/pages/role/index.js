import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';

import { Form, Input, Button, Popconfirm, Modal, notification, Icon, Tree, Popover, Divider, message } from 'antd';
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

const RoleSetting = ({
    roleSetting,
    ...props
}) => {
    let { dispatch, form } = props;
    let { tableData, modalShow, account, siderList, menuIds, defaultCheckedKeys } = roleSetting;
    let { getFieldDecorator, getFieldValue } = form;

    const columns = [
        {
            title: '角色名',
            dataIndex: 'name',
            sorter: true
        }, {
        	title: '角色id',
        	dataIndex: 'id',
        	sorter: true
        }, {
        	title: '操作',
            dataIndex: 'action',
            render: (txt, record, index) => {
                return <span>
                    <Popover placement="left"
                        title={'授权菜单'} 
                        content={
                            <div>
                                <Tree
                                    checkable
                                    defaultCheckedKeys={defaultCheckedKeys}
                                    onCheck={checkTree}
                                >
                                    {
                                        siderList.map(item => renderTree(item))
                                    }
                                </Tree>

                                <a onClick={() => rolesetAuthority(record)} style={{ margin: 5 }}>确认授权</a>
                            </div>
                        } 
                        trigger="click">
                        <Button type="primary" size="small">授权</Button>
                    </Popover>
                    <Popconfirm title="是否删除?" onConfirm={() => handleDelete(record)}>
                        <Button type="danger" size="small" style={{ marginLeft: 10 }}>删除</Button>
                    </Popconfirm>
                </span>
            }
        }
    ]

    // 渲染权限树列表
	const renderTree = item => {
		if (item.children && item.children.length) {
            return (
				<TreeNode title={item.menuName} key={item.id + ''}>
					{
						item.children.map(subitem => renderTree(subitem))
					}
				</TreeNode>
			)
		} else {
			return <TreeNode title={item.menuName} key={item.id + ''} disableCheckbox={item.id === 113}/>
		}
    }
    
    // 点击权限数
    const checkTree = (checkedKeys, e) => {
        let menuIds = checkedKeys.map(e => e - 0);
        dispatch({
        	type: 'roleSetting/setParam',
        	payload: {
                menuIds
            }
        })
    }

    // 获取左侧菜单数据
    const getSiderData = () => {
        dispatch({
            type: 'roleSetting/getSliderBar'
        })
    }
    
    /**
     * 删除角色
     * @param  {object} 列数据
     */
    const handleDelete = (param) => {
        dispatch({
    		type: 'roleSetting/deleteRole',
    		payload: param.id
    	})
    }

    /**
     * 给角色授权
     * @param  {object} 列数据
     */
    const rolesetAuthority = (param) => {
        if (menuIds.length > 0) {
            dispatch({
            	type: 'roleSetting/setauthRole',
            	payload: {
            		menuIds: menuIds,
            		roleId: param.id
            	}
            })
        } else {
            message.warning('请选择菜单授权！')
        }
    }

    // 输入角色名
    const handleInput = (e) => {
        dispatch({
    		type: 'roleSetting/setParam',
    		payload: {
                account: e.target.value
            }
    	})
    }

    // 搜索
    const handleSearch = () => {
     	dispatch({
    		type: 'roleSetting/getRole',
    		payload: account
    	})
    }

    // 添加角色
    const handleSubmit = () => {
        dispatch({
        	type: 'roleSetting/addRole',
        	payload: getFieldValue('rolename')
        })
    }
    
    // 展示modal
    const changeModalState = (show) => {
        dispatch({
        	type: 'roleSetting/setParam',
        	payload: {
                modalShow: show
            }
        })
    }
   

	return (
		<div>
			<FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>
                    {/*角色名*/}
                    <FormItem label="角色名">
                        <Input placeholder="输入角色名" value={account} onChange={(e) => handleInput(e)}/>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={() => changeModalState(true)}>添加角色</Button>
                    </FormItem>

                </Form>
            </FormInlineLayout>

            <Modal
                title="新增角色"
                visible={modalShow}
                onOk={ () => changeModalState(false) }
                onCancel= { () => changeModalState(false) }
                okText="确认"
                cancelText="取消"
                footer={null}
                >
                <Form>
                    <FormItem>
                        {getFieldDecorator('rolename', {
                            rules: [{ required: true, message: '请输入角色名!', whitespace: true }],
                        })(
                            <Input placeholder="请输入角色名"/>
                        )}
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={handleSubmit}>提交</Button>
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

RoleSetting.propTypes = {
    roleSetting: PropTypes.object
};

export default connect(({ roleSetting }) => ({ roleSetting }))(Form.create()(RoleSetting));
	