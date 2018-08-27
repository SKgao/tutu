import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';

import { filterObj } from '@/utils/tools';

import { Form, Input, Button, Modal, Icon } from 'antd';
const FormItem = Form.Item;

const Order = ({
    order,
    ...props
}) => {
    let { dispatch, form } = props;
    let { orderList, pageNum, pageSize, totalCount } = order;
    let { getFieldDecorator, getFieldValue } = form;

    const columns = [
        {
            title: '订单号',
            dataIndex: 'name',
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
    		payload: filterObj({ ...param })
    	})
    }

    // 搜索
    const handleSearch = (param) => {
        dispatch({
    		type: 'order/getOrder',
    		payload: filterObj({ pageNum, pageSize })
    	})
    }
   
	return (
		<div>
			<FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>
                    {/*订单号*/}
                    <FormItem label="订单号">
                        <Input placeholder="输入订单号"/>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                </Form>
            </FormInlineLayout>

            <TableLayout
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
	