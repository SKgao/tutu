import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import moment from 'moment';
import { filterObj } from '@/utils/tools';

import { Form, Input, Button, Modal, Icon, DatePicker, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const Member = ({
    member,
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { memberList, memberLevelList, pageNum, pageSize, totalCount, startTime, endTime, userLevel} = member;
    let { getFieldDecorator, getFieldValue } = form;

    const columns = [
        {
            title: '图图号',
            dataIndex: 'tutuNumber',
            sorter: true
        }, {
            title: '用户名',
            dataIndex: 'realName',
            sorter: true
        }, {
            title: '用户头像',
            dataIndex: 'icon',
            sorter: true,
            render: (text) => {
                return (text) ? <a href={ text } target='_blank'><img src={ text } style={{ width: 50, height: 35 }}/></a> : <span>无</span>
             }
        }, {
            title: '会员等级',
            dataIndex: 'userLevel',
            sorter: true
        }, {
            title: '等级名称',
            dataIndex: 'userLevelName',
            sorter: true
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
            sorter: true,
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
            dataIndex: 'createdAt',
            sorter: true
        }, {
            title: '最近闯关记录',
            dataIndex: 'record',
            children: [
                {
                    title: '教材名',
                    dataIndex: 'bookVersionName',
                    sorter: true,
                    render: (text) => <span>{ text ? text :  '无' }</span>
                }, {
                    title: '练习教材名称',
                    dataIndex: 'textbookNamePractice',
                    sorter: true,
                    render: (text) => <span>{ text ? text :  '无' }</span>
                },  {
                    title: '配音教材名称',
                    dataIndex: 'textbookNameAudio',
                    sorter: true,
                    render: (text) => <span>{ text ? text :  '无' }</span>
                }, {
                    title: '单元名',
                    dataIndex: 'unitName',
                    sorter: true
                }, {
                    title: 'partTips',
                    dataIndex: 'partTips',
                    sorter: true,
                    render: (text) => <span>{ text ? text :  '无' }</span>
                }, {
                    title: 'part名称',
                    dataIndex: 'partName',
                    sorter: true
                }, {
                    title: '关卡名',
                    dataIndex: 'customPassName',
                    sorter: true,
                    render: (text) => <span>{ text ? text :  '无' }</span>
                }
            ]
        }
    ]

    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'member/setParam',
    		payload: param
        })
        dispatch({
    		type: 'member/getMember',
    		payload: filterObj({ startTime, endTime, userLevel, ...param })
    	})
    }

    // 搜索
    const handleSearch = (param) => {
        dispatch({
    		type: 'member/getMember',
    		payload: filterObj({ pageNum, pageSize, totalCount, startTime, endTime, userLevel })
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
    		type: 'userSetting/setParam',
    		payload: {
                [m]: e.target.value
            }
    	})
    }
   
	return (
		<div>
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
                 
                    {/*会员名*/}
                    {/* <FormItem label="会员名">
                        <Input placeholder="输入会员名"/>
                    </FormItem> */}

                    {/*会员等级*/}
                    <FormItem label="会员等级">
                        <Select
                            showSearch
                            onFocus={() => dispatch({type: 'member/getMemberLevel'})}
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
            </FormInlineLayout>

            <TableLayout
                pagination={false}
                dataSource={memberList}
                allColumns={columns}
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
	