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
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { orderList, selectList, pageNum, pageSize, totalCount, orderNo, tutuNumber, activityId, startTime, endTime, payType } = order;
    let { getFieldDecorator, getFieldValue } = form;

    const columns = [
        {
            title: '图图号',
            dataIndex: 'tutuNumber',
            sorter: true
        }, {
            title: '真实姓名',
            dataIndex: 'realName',
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '商品名称',
            dataIndex: 'itemName',
            sorter: true
        }, {
            title: '订单号',
            dataIndex: 'orderNo',
            sorter: true
        }, {
            title: '订单金额',
            dataIndex: 'orderAmount',
            sorter: true,
            render: (text) => (Number(text) / 100).toFixed(2)
        }, {
            title: '支付方式',
            dataIndex: 'payTypeName',
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '支付状态',
            dataIndex: 'orderStatusDesc',
            sorter: true
        }, {
            title: '支付时间',
            dataIndex: 'payTime',
        }, {
            title: '第三方交易号',
            dataIndex: 'outNo',
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '取消原因',
            dataIndex: 'cancelReason',
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '活动名称',
            dataIndex: 'activityName',
            render: (text) => <span>{ text ? text :  '无' }</span>
        }, {
            title: '创建时间',
            dataIndex: 'createdAt'
        } 
    ]

    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'order/setParam',
    		payload: param
        })
        dispatch({ type: 'order/getOrder' })
    }

    // 搜索
    const handleSearch = (param) => {
        dispatch({ type: 'order/getOrder' })
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

                    {/*图图号*/}
                    <FormItem label="图图号">
                        <Input placeholder="输入图图号" value={tutuNumber} onChange={(e) => handleInput(e, 'tutuNumber')}/>
                    </FormItem>

                    {/*订单号*/}
                    <FormItem label="订单号">
                        <Input placeholder="输入订单号" value={orderNo} onChange={(e) => handleInput(e, 'orderNo')}/>
                    </FormItem>

                    {/*支付类型*/}
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

                    {/*支付状态*/}
                    <FormItem label="支付状态">
                        <Select
                            showSearch
                            placeholder="请选择支付状态"
                            onChange={v => changeSelect({ orderStatus: v })}
                            >
                            <Option key={0} value={''}>全部</Option>
                            <Option key={1} value={1}>待支付</Option>
                            <Option key={2} value={2}>已支付</Option>
                            <Option key={3} value={3}>用户取消</Option>
                            <Option key={4} value={4}>超时关闭</Option>
                        </Select>
                    </FormItem>

                    {/*活动筛选*/}
                    <FormItem label="活动筛选">
                        <Select
                            showSearch
                            placeholder="请选择活动"
                            onFocus={() => dispatch({type: 'order/activeSelect'})}
                            onChange={v => changeSelect({activityId: v})}
                            >
                            {
                                selectList.map(item =>
                                    <Option key={item.id} value={item.id}>{item.title}</Option>
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
                dataSource={orderList}
                allColumns={columns}
                loading={ loading.effects['order/getOrder'] }
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

Order.propTypes = {
    order: PropTypes.object
};

export default connect(({ order, loading }) => ({ order, loading }))(Form.create()(Order));
	