import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import moment from 'moment';

import { Form, Input, Button, Modal, Icon, DatePicker, Select, Tabs, Pagination } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

const MemberInfo = ({
    memberInfo,
    loading,
    ...props
}) => {
    let { dispatch } = props;
    let { memberList, memberLevelList, pageNum, pageSize, totalCount} = memberInfo;

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
            title: '会员开始时间',
            dataIndex: 'payTime',
        }, {
            title: '会员到期时间',
            dataIndex: 'exprieTime',
        }
    ]

    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'memberInfo/setParam',
    		payload: param
        })
        dispatch({ type: 'memberInfo/getMember' })
    }

    // 搜索
    const handleSearch = (param) => {
        dispatch({
			type: 'memberInfo/setParam',
			payload: {
				pageSize: 10,
				pageNum: 1
			}
		})
        dispatch({ type: 'memberInfo/getMember' })
    }

    // 选择下拉框
    const changeSelect = (v) => {
    	dispatch({
    		type: 'memberInfo/setParam',
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

    // 时间选择
    const datePickerChange = (d1, d2, param) => {
        dispatch({
    		type: 'member/setParam',
    		payload: {
                [param]: d2 ? d2 : '',
			}
        })
    }

	return (
		<div>
            <FormInlineLayout>
                <Form layout="inline" style={{ marginLeft: 15 }}>
                    {/*时间*/}
                    <FormItem label="会员起始时间">
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="选择起始时间"
                            onChange={(d1, d2) => datePickerChange(d1, d2, 'expireStartTime')}
                        />
                    </FormItem>

                    <FormItem label="会员到期时间">
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="选择到期时间"
                            onChange={(d1, d2) => datePickerChange(d1, d2, 'expireEndTime')}
                        />
                    </FormItem>

                    {/*会员等级*/}
                    <FormItem label="会员等级">
                        <Select
                            showSearch
                            onFocus={() => dispatch({type: 'memberInfo/getMemberLevel'})}
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

                    {/*图图号*/}
                    <FormItem label="图图号">
                        <Input placeholder="输入图图号" value={memberInfo.tutuNumber} onChange={(e) => handleInput(e, 'tutuNumber')}/>
                    </FormItem>

                    {/*手机号*/}
                    <FormItem label="手机号">
                        <Input placeholder="输入手机号" value={memberInfo.mobile} onChange={(e) => handleInput(e, 'mobile')}/>
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
                loading={ loading.effects['memberInfo/getMember'] }
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

MemberInfo.propTypes = {
    memberInfo: PropTypes.object
};

export default connect(({ memberInfo, loading }) => ({ memberInfo, loading }))(Form.create()(MemberInfo));
