import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';

import { filterObj } from '@/utils/tools';

import { Form, Input, Button, Modal, Icon } from 'antd';
const FormItem = Form.Item;

const Activity = ({
    activity,
    ...props
}) => {
    let { dispatch, form } = props;
    let { tableData, pageNum, pageSize, totalCount } = activity;
    let { getFieldDecorator, getFieldValue } = form;

    const columns = [
        {
            title: '活动名',
            dataIndex: 'name',
            sorter: true
        } 
    ]

    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'activity/setParam',
    		payload: param
        })
        dispatch({
    		type: 'activity/getActivity',
    		payload: filterObj({ ...param })
    	})
    }

    // 搜索
    const handleSearch = (param) => {
        dispatch({
    		type: 'activity/getActivity',
    		payload: filterObj({ pageNum, pageSize })
    	})
    }
   
	return (
		<div>
			<FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>
                    {/*活动id*/}
                    <FormItem label="活动id">
                        <Input placeholder="输入活动名"/>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                </Form>
            </FormInlineLayout>

            <TableLayout
                dataSource={tableData}
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

Activity.propTypes = {
    activity: PropTypes.object
};

export default connect(({ activity }) => ({ activity }))(Form.create()(Activity));
	