import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import moment from 'moment';

import { Form, Input, Button, Modal, Icon, DatePicker, Select, Tabs, Pagination } from 'antd';
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
            title: '用户昵称',
            dataIndex: 'realName'
        }, {
            title: '用户头像',
            dataIndex: 'icon',
            render: (text) => {
                return (text) ? <a href={ text } target='_blank'><img src={ text } style={{ width: 50, height: 35 }}/></a> : <span>无</span>
            }
        }, {
            title: '会员等级',
            dataIndex: 'userLevelName'
        }, {
            title: '是否购买精品课程',
            dataIndex: 'hasBuyTextbook',
            sorter: true,
            render: (txt) => {
                return txt === 0 ? '未购买' : '已购买'
            }
        }, {
            title: '会员开始时间',
            dataIndex: 'payTime',
        }, {
            title: '会员到期时间',
            dataIndex: 'exprieTime',
        }, {
            title: '累计消费金额',
            dataIndex: 'userMoney',
            sorter: true,
            render: (text) => (Number(text) / 100).toFixed(2) + '元'
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            sorter: true,
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: 'E-mail',
            dataIndex: 'email',
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
            title: '教材版本',
            dataIndex: 'bookVersionName',
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '练习教材名称',
            dataIndex: 'textbookNamePractice',
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
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
        }, {
        	title: '操作',
            dataIndex: 'action',
            render: (txt, record, index) => {
                return <span>
                    {
                        record.hasBuyTextbook !==  0 && <Button type="primary" size="small" onClick={() => linktoCourse(record)} style={{ marginLeft: 10 }}>已买课程</Button>
                    }
                    <Button type="primary" size="small" style={{ marginLeft: 5 }} onClick={() => handleUsing(record)}>启用</Button>
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
    		type: 'member/setParam',
    		payload: param
        })
        dispatch({ type: 'member/getMember' })
    }

    // 搜索
    const handleSearch = (param) => {
        dispatch({
			type: 'member/setParam',
			payload: {
				pageSize: 10,
				pageNum: 1
			}
		})
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

    // 时间选择
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'member/setParam',
        	payload: {
                expireStartTime: t[0] ? t[0] + ':00' : '',
                expireEndTime: t[1] ? t[1] + ':00' : ''
            }
        })
    }

    // 时间选择
    const datepickerChangeReg = (d, t) => {
        dispatch({
        	type: 'member/setParam',
        	payload: {
                registerStartTime: t[0] ? t[0] + ':00' : '',
                registerEndTime: t[1] ? t[1] + ':00' : ''
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
            <TabPane tab="用户列表" key="0">
                <FormInlineLayout>
                    <Form layout="inline" style={{ marginLeft: 15 }}>
                        {/*时间*/}
                        <FormItem label="注册时间">
                            <RangePicker
                                format="YYYY-MM-DD HH:mm"
                                placeholder={['开始时间', '截止时间']}
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                                }}
                                format="YYYY-MM-DD HH:mm"
                                onChange={datepickerChangeReg}
                                />
                        </FormItem>

                        {/*时间*/}
                        <FormItem label="过期时间">
                            <RangePicker
                                format="YYYY-MM-DD HH:mm"
                                placeholder={['开始时间', '截止时间']}
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00', 'HH:mm'), moment('23:59', 'HH:mm')],
                                }}
                                format="YYYY-MM-DD HH:mm"
                                onChange={datepickerChange}
                                />
                        </FormItem>

                        {/*会员等级*/}
                        <FormItem label="会员等级">
                            <Select
                                mode="multiple"
                                showSearch
                                onFocus={() => dispatch({type: 'member/getMemberLevel'})}
                                placeholder="请选择会员等级"
                                style={{ minWidth: 150, width: '100%' }}
                                onChange={v => changeSelect({ userLevelIds: v })}
                                >
                                {
                                    memberLevelList.map(item =>
                                        <Option key={item.userLevel} value={item.userLevel}>{item.levelName}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>

                        {/*图图号*/}
                        <FormItem label="图图号">
                            <Input placeholder="输入图图号" value={member.tutuNumber} onChange={(e) => handleInput(e, 'tutuNumber')}/>
                        </FormItem>

                        {/*手机号*/}
                        <FormItem label="手机号">
                            <Input placeholder="输入手机号" value={member.mobile} onChange={(e) => handleInput(e, 'mobile')}/>
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

Member.propTypes = {
    member: PropTypes.object
};

export default connect(({ member, loading }) => ({ member, loading }))(Form.create()(Member));
