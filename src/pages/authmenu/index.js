import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import VaildForm from './VaildForm';
import { filterObj } from '@/utils/tools';

import { Form, Button, Popconfirm, Modal, Icon, DatePicker, Badge, Input } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const Authmenu = ({
    authmenu,
    ...props
}) => {
    let { dispatch } = props;
    let { tableData, modalShow, menuName } = authmenu;

    const columns = [
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true
        }, {
        	title: '更新时间',
        	dataIndex: 'updatedAt',
        	sorter: true
        }, {
        	title: '菜单id',
        	dataIndex: 'id',
        	sorter: true
        }, {
        	title: '菜单名称',
        	dataIndex: 'menuName',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改菜单名称'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'authmenu/updateMenu',
							payload: {
								id: record.id,
								menuName: v
							}
						})
					}/>
        }, {
        	title: '菜单路径',
        	dataIndex: 'path',
        	sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改菜单路径'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'authmenu/updateMenu',
							payload: {
								id: record.id,
								path: v
							}
						})
					}/>
        }, {
        	title: '菜单状态',
        	dataIndex: 'status',
			sorter: true,
			render: (txt) => {
				switch (txt) {
					case 1:
						return <Badge status="processing" text="正常"/>;	
					case 2:
						return <Badge status="warning" text="不可用"/>;
					default:
					    return <Badge status="warning" text="删除"/>;
				}
			}
        }, {
        	title: 'url',
        	dataIndex: 'url',
        	sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改url'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'authmenu/updateMenu',
							payload: {
								id: record.id,
								url: v
							}
						})
					}/>
        }, {
        	title: '图标',
        	dataIndex: 'icon',
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改图标'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'authmenu/updateMenu',
							payload: {
								id: record.id,
								icon: v
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
                </span>
            }
        }
    ]
    
    /**
     * 删除菜单
     * @param  {object} 列数据
     */
    const handleDelete = (param) => {
        dispatch({
    		type: 'authmenu/deleteMenu',
    		payload: param.id
        })
    }

    // 添加菜单
    const submitForm = (menuinfo) => {
    	dispatch({
    		type: 'authmenu/addMenu',
    		payload: filterObj(menuinfo)
    	})
    }
    
    // 展示modal
    const changeModalState = (show) => {
        dispatch({
        	type: 'authmenu/setParam',
        	payload: {
				modalShow: show
			}
        })
    }

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'authmenu/setParam',
        	payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
	}
	
	// 输入框收入
	const handleInput = (e) => {
		dispatch({
        	type: 'authmenu/setParam',
        	payload: {
                menuName: e.target.value
            }
        })
	}

    // 搜索
    const handleSearch = () => {
    	let PP = {
    		pageNum: 1,
    		pageSize: 10,
			menuName: menuName
    	}
    	dispatch({
    		type: 'authmenu/getMenu',
    		payload: filterObj(PP)
    	})
    }
   

	return (
		<div>
			<FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>
                    {/* <FormItem label="时间">
                        <RangePicker
                            format="YYYY-MM-DD HH:mm"
                            showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                            }}
                            format="YYYY-MM-DD HH:mm"
                            onChange={datepickerChange}
                            />
					</FormItem> */}
					
					{/*菜单名*/}
                    <FormItem label="菜单名">
                        <Input placeholder="输入菜单名" onChange={(e) => handleInput(e)}/>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={() => changeModalState(true)}>添加菜单</Button>
                    </FormItem>

                </Form>
            </FormInlineLayout>

            <Modal
                title="新增菜单"
                visible={modalShow}
                onOk={ () => changeModalState(false) }
                onCancel= { () => changeModalState(false) }
                footer={null}
                >
                <Form>
					<VaildForm 
					   submitForm={submitForm}
					   resetForm={() => changeModalState(false)}
					   >
                    </VaildForm>
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

Authmenu.propTypes = {
    authmenu: PropTypes.object
};

export default connect(({ authmenu }) => ({ authmenu }))(Authmenu);