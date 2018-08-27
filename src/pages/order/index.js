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

const Order = ({
    order,
    ...props
}) => {
    let { dispatch, form } = props;
    let { orderList, pageNum, pageSize, totalCount, orderNo, tutuNumber, activityId, startTime, endTime, payType } = order;
    let { getFieldDecorator, getFieldValue } = form;

    const columns = [
        {
            title: '图图号',
            dataIndex: 'tutuNumber',
            sorter: true
        }, {
            title: '用户类型',
            dataIndex: 'itemName',
            sorter: true
        }, {
            title: '订单号',
            dataIndex: 'orderNo',
            sorter: true
        }, {
            title: '订单金额',
            dataIndex: 'orderAmount',
            sorter: true
        }, {
            title: '支付方式',
            dataIndex: 'payTypeName',
            sorter: true,
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '支付状态',
            dataIndex: 'orderStatusDesc',
            sorter: true
        }, {
            title: '支付时间',
            dataIndex: 'payTime',
            sorter: true
        }, {
            title: '取消原因',
            dataIndex: 'cancelReason',
            sorter: true,
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '第三方交易号',
            dataIndex: 'outNo',
            sorter: true,
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '活动名称',
            dataIndex: 'activityName',
            sorter: true,
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true
        } 
    ]

    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'order/setParam',
    		payload: param
        })
        dispatch({
    		type: 'order/getOrder',
    		payload: filterObj({ ...param, orderNo, tutuNumber, activityId, startTime, endTime, payType })
    	})
    }

    // 搜索
    const handleSearch = (param) => {
        dispatch({
    		type: 'order/getOrder',
    		payload: filterObj({ pageNum, pageSize, orderNo, tutuNumber, activityId, startTime, endTime, payType })
    	})
    }

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'order/setParam',
        	payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }

    // 输入框
    const handleInput = (e, m) => {
        dispatch({
    		type: 'order/setParam',
    		payload: {
                [m]: e.target.value
            }
    	})
    }

    // 选择下拉框
    const changeSelect = (v) => {
    	dispatch({
    		type: 'order/setParam',
    		payload: v
    	})
    }
   
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

                    {/*图图号*/}
                    <FormItem label="图图号">
                        <Input placeholder="输入图图号" onChange={(e) => handleInput(e, 'tutuNumber')}/>
                    </FormItem>

                    {/*订单号*/}
                    <FormItem label="订单号">
                        <Input placeholder="输入订单号" onChange={(e) => handleInput(e, 'orderNo')}/>
                    </FormItem>

                    {/*会员等级*/}
                    <FormItem label="支付类型">
                        <Select
                            showSearch
                            placeholder="请选择支付类型"
                            onChange={v => changeSelect({ payType: v })}
                            >
                            <Option key={0} value={''}>全部</Option>
                            <Option key={1} value={1}>微信</Option>
                            <Option key={2} value={2}>支付宝</Option>
                        </Select>
                    </FormItem>

                    {/*活动id*/}
                    <FormItem label="活动id">
                        <Input placeholder="输入活动id" onChange={(e) => handleInput(e, 'activityId')}/>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                </Form>
            </FormInlineLayout>

            <TableLayout
                pagination={false}
                dataSource={orderList}
                allColumns={columns}
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

Order.propTypes = {
    order: PropTypes.object
};

export default connect(({ order }) => ({ order }))(Form.create()(Order));
	