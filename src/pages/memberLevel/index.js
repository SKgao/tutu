import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import moment from 'moment';

import { Form, Input, Button, Modal, Icon, Popconfirm, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const MemberLevel = ({
    memberLevel,
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { levelList, startTime, endTime, userLevel} = memberLevel;
    let { getFieldDecorator, getFieldValue } = form;

    const columns = [
        {
            title: '会员等级名称',
            dataIndex: 'levelName',
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改会员等级名称'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'memberLevel/updateMemberLevel',
							payload: {
								userLevel: record.userLevel - 0,
								levelName: v
							}
						})
					}/>
        }, {
            title: '等级描述',
            dataIndex: 'explainInfo',
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改等级描述'}
					valueData={text || '无'}
					defaultValue={text || '无'}
					onOk={v => 
						dispatch({
							type: 'memberLevel/updateMemberLevel',
							payload: {
								userLevel: record.userLevel - 0,
								explainInfo: v
							}
						})
					}/>
        }, {
            title: '图标',
            dataIndex: 'icon'
        }, {
            title: '过期时间',
            dataIndex: 'exprieDays',
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改过期时间'}
					valueData={text || '0'}
					defaultValue={text || '0'}
					onOk={v => 
						dispatch({
							type: 'memberLevel/updateMemberLevel',
							payload: {
								userLevel: record.userLevel - 0,
								exprieDays: v
							}
						})
					}/>
        }, {
            title: '原始价格',
            dataIndex: 'orgMoney',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改原始价格'}
					valueData={text || '0'}
					defaultValue={text || '0'}
					onOk={v => 
						dispatch({
							type: 'memberLevel/updateMemberLevel',
							payload: {
								userLevel: record.userLevel - 0,
								orgMoney: v
							}
						})
					}/>
        }, {
            title: '需充值金额',
            dataIndex: 'needMoney',
            sorter: true,
            render: (text, record) =>
				<TablePopoverLayout
					title={'修改需充值金额'}
					valueData={text || '0'}
					defaultValue={text || '0'}
					onOk={v => 
						dispatch({
							type: 'memberLevel/updateMemberLevel',
							payload: {
								userLevel: record.userLevel,
								needMoney: v
							}
						})
					}/>
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

    // 删除会员等级
    const handleDelete = (param) => {
        dispatch({
    		type: 'memberLevel/deleteMemberLevel',
    		payload: {
                userLevel: param.userLevel
            }
        })
    }

    // 选择下拉框
    const changeSelect = (v) => {
    	dispatch({
    		type: 'memberLevel/setParam',
    		payload: v
    	})
    }
   
	return (
		<div>
			{/* <FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>            
                    <FormItem label="会员等级">
                        <Select
                            showSearch
                            onFocus={() => dispatch({type: 'memberLevel/getMemberLevel'})}
                            placeholder="请选择会员等级"
                            onChange={v => changeSelect({ userLevel: v })}
                            >
                            {
                                memberLevelList.map(item =>
                                    <Option key={item.userLevel} value={item.userLevel}>{item.levelName}</Option>
                                )
                            }
                        </Select>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                </Form>
            </FormInlineLayout> */}

            <TableLayout
                pagination={false}
                dataSource={levelList}
                allColumns={columns}
                loading={ loading.effects['memberLevel/getMemberLevel'] }
                />
		</div>
	)
};

MemberLevel.propTypes = {
    memberLevel: PropTypes.object
};

export default connect(({ memberLevel, loading }) => ({ memberLevel, loading }))(Form.create()(MemberLevel));
	