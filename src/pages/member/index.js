import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import moment from 'moment';

import { Form, Input, Button, Modal, Icon, DatePicker, Select, Tabs } from 'antd';
import activity from '../activity';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

const Member = ({
    member,
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { memberList, feedList, memberLevelList, pageNum, pageSize, totalCount, activeKey} = member;
    let { getFieldDecorator, getFieldValue } = form;

    const columns = [
        {
            title: '图图号',
            dataIndex: 'tutuNumber',
            sorter: true
        }, {
            title: '用户名',
            dataIndex: 'realName'
        }, {
            title: '用户头像',
            dataIndex: 'icon',
            render: (text) => {
                return (text) ? <a href={ text } target='_blank'><img src={ text } style={{ width: 50, height: 35 }}/></a> : <span>无</span>
             }
        }, {
            title: '会员等级',
            dataIndex: 'userLevelName',
            // render: (text, record) =>
			// 	<TablePopoverLayout
			// 		title={'修改会员等级'}
			// 		valueData={memberLevelList}
			// 		focusSelect={() => dispatch({type: 'member/getMemberLevel'})}
			// 		optionKey={'userLevel'}
			// 		optionItem={'levelName'}
			// 		defaultValue={text || '无'}
            //         onOk={v => 
			// 			dispatch({
			// 				type: 'member/updateUserLevel',
			// 				payload: {
			// 					id: record.id,
			// 					userLevel: (v === '普通用户') ? 1 : v - 0
			// 				}
			// 			})
			// 		}/>
        }, {
            title: '会员到期时间',
            dataIndex: 'exprieTime',
            sorter: true
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            sorter: true,
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: 'E-mail',
            dataIndex: 'email',
            sorter: true
        }, {
            title: '会员生日',
            dataIndex: 'birthday',
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '性别',
            dataIndex: 'sex',
            sorter: true,
            render: (text) => <span>{ text === 1 ? '男' :  '女' }</span>
        }, {
            title: '是否设立密码',
            dataIndex: 'hasSetPassword',
            sorter: true,
            render: (text) => <span>{ text === 1 ? '是' :  '否' }</span>
        }, {
            title: '注册时间',
            dataIndex: 'createdAt'
        }, {
            title: '最近闯关记录',
            dataIndex: 'record',
            children: [
                {
                    title: '教材版本',
                    dataIndex: 'bookVersionName',
                    render: (text) => <span>{ text ? text :  '无' }</span>
                }, {
                    title: '练习教材名称',
                    dataIndex: 'textbookNamePractice',
                    render: (text) => <span>{ text ? text :  '无' }</span>
                },  {
                    title: '配音教材名称',
                    dataIndex: 'textbookNameAudio',
                    render: (text) => <span>{ text ? text :  '无' }</span>
                }, {
                    title: '闯关进度',
                    dataIndex: 'unitName',
                    render: (text, record) => {
                        let arr = [record.unitName, record.partTips, record.partName, record.customPassName]
                        return <span>{ arr.filter(e => e).join(' > ') }</span>
                    }
                }
            ]
        }, {
        	title: '操作',
            dataIndex: 'action',
            render: (txt, record, index) => {
                return <span>
                    <Button type="primary" size="small" onClick={() => handleUsing(record)}>启用</Button>
                    <Button type="danger" size="small" style={{ marginLeft: 5 }} onClick={() => handleForbidden(record)}>禁用</Button>
                </span>
            }
        }
    ]

    const infoColumns = [
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
            title: '反馈内容',
            dataIndex: 'content',
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '反馈时间',
            dataIndex: 'createdAt'
        }
    ]

    const _tableCols = (activeKey === '0') ? columns : infoColumns
    const _tableList = (activeKey === '0') ? memberList : feedList

    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'member/setParam',
    		payload: param
        })
        dispatch({ type: 'member/getMember' })
    }

    // 搜索
    const handleSearch = (param) => {
        if (activeKey === '0') {
            dispatch({ type: 'member/getMember' })
        } else if (activeKey === '1') {
            dispatch({ type: 'member/getFeedList' })
        }
    }

    // 会员-启用
    const handleUsing = (param) => {
        dispatch({
    		type: 'member/startMember',
    		payload: {
                id: param.userId
            }
        })
    }

    // 会员-禁用
    const handleForbidden = (param) => {
        dispatch({
    		type: 'member/forbiddenMember',
    		payload: {
                id: param.userId
            }
        })
    }

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'member/setParam',
        	payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }

    // 选择下拉框
    const changeSelect = (v) => {
    	dispatch({
    		type: 'member/setParam',
    		payload: v
    	})
    }

    // 输入框
    const handleInput = (e, m) => {
        dispatch({
    		type: 'member/setParam',
    		payload: {
                [m]: e.target.value
            }
    	})
    }

    // 切换tabs
    const handleTabChange = (key = '0') => {
    	dispatch({
    		type: 'member/setParam',
    		payload: {
                activeKey: key,
                startTime: '',
                endTime: '',
                pageNum: 1,
                pageSize: 10,
                tutuNumber: '',
                mobile: ''
			}
        })
        if (key === '0') {
            dispatch({ type: 'member/getMember' })
        } else if (key === '1') {
            dispatch({ type: 'member/getFeedList' })
        }
	}
   
	return (
		<div>
            <Tabs
				animated={false}
				activeKey={activeKey}
				onChange={handleTabChange}
            >
            <TabPane tab="会员列表" key="0">
                <FormInlineLayout>
                    <Form layout="inline" style={{ marginLeft: 15 }}>
                        {/*时间*/}
                        {/* <FormItem label="时间">
                            <RangePicker
                                format="YYYY-MM-DD HH:mm"
                                showTime={{
                                    huserLeveleDisabledOptions: true,
                                    defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                                }}
                                format="YYYY-MM-DD HH:mm"
                                onChange={datepickerChange}
                                />
                        </FormItem> */}
                    
                        {/*图图号*/}
                        <FormItem label="图图号">
                            <Input placeholder="输入图图号" value={member.tutuNumber} onChange={(e) => handleInput(e, 'tutuNumber')}/>
                        </FormItem>

                        {/*手机号*/}
                        <FormItem label="手机号">
                            <Input placeholder="输入手机号" value={member.mobile} onChange={(e) => handleInput(e, 'mobile')}/>
                        </FormItem>

                        {/*会员等级*/}
                        <FormItem label="会员等级">
                            <Select
                                showSearch
                                onFocus={() => dispatch({type: 'member/getMemberLevel'})}
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

                        {/*性别*/}
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

                        {/*是否设置密码*/}
                        <FormItem label="是否设置密码">
                            <Select
                                showSearch
                                placeholder="请选择是否设置密码"
                                onChange={v => changeSelect({ hasSetPassword: v })}
                                >
                                <Option key={0} value={''}>全部</Option>
                                <Option key={1} value={1}>是</Option>
                                <Option key={2} value={2}>否</Option>
                            </Select>
                        </FormItem>

                        <FormItem>
                            <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                        </FormItem>

                    </Form>
                </FormInlineLayout>
            </TabPane>
            <TabPane tab="反馈信息" key="1">
                {/*时间*/}
                <FormInlineLayout>
                    <Form layout="inline" style={{ marginLeft: 15 }}>
                        <FormItem label="时间">
                            <RangePicker
                                format="YYYY-MM-DD HH:mm"
                                showTime={{
                                    huserLeveleDisabledOptions: true,
                                    defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                                }}
                                format="YYYY-MM-DD HH:mm"
                                onChange={datepickerChange}
                                />
                        </FormItem>

                        {/*图图号*/}
                        <FormItem label="图图号">
                            <Input placeholder="输入图图号" onChange={(e) => handleInput(e, 'tutuNumber')}/>
                        </FormItem>

                        {/*手机号*/}
                        <FormItem label="手机号">
                            <Input placeholder="输入手机号" onChange={(e) => handleInput(e, 'mobile')}/>
                        </FormItem>

                        <FormItem>
                            <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                        </FormItem>
                    </Form>
                </FormInlineLayout>
            </TabPane>
            </Tabs>

            <TableLayout
                pagination={false}
                dataSource={_tableList}
                allColumns={_tableCols}
                loading={ loading.effects['member/getMember'] }
                scrollX={true}
                />
            <PaginationLayout
                total={totalCount}
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

Member.propTypes = {
    member: PropTypes.object
};

export default connect(({ member, loading }) => ({ member, loading }))(Form.create()(Member));
	