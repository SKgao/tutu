import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import moment from 'moment';
import { filterObj } from '@/utils/tools';

import { Form, Input, Button, Modal, Icon, DatePicker } from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const Activity = ({
    activity,
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { tableData, startTime, endTime} = activity;
    let { getFieldDecorator, getFieldValue } = form;

    const columns = [
        {
            title: '活动名称',
            dataIndex: 'title',
            sorter: true
        }, {
            title: '活动内容',
            dataIndex: 'content',
            sorter: true
        }, {
            title: '活动图片',
            dataIndex: 'icon',
            sorter: true,
            render: (text) => {
               return (text) ? <a href={ text } target='_blank'><img src={ text } style={{ width: 50, height: 35 }}/></a> : <span>无</span>
            }
        }, {
            title: '活动金额',
            dataIndex: 'orgAmount',
            sorter: true
        }, {
            title: '活动状态',
            dataIndex: 'status',
            sorter: true
        }, {
            title: '活动持续时间',
            dataIndex: 'activeExpireDays',
            sorter: true
        }, {
            title: '活动开始时间',
            dataIndex: 'beginAt',
            sorter: true
        }, {
            title: '活动结束时间',
            dataIndex: 'endAt',
            sorter: true
        }, {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true
        }, {
        	title: '操作',
            dataIndex: 'action',
            render: (txt, record, index) => {
                return <span>
                    <a href={ record.url } target='_blank'>活动链接</a>
                </span>
            }
        } 
    ]

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'activity/setParam',
        	payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }

    // 搜索
    const handleSearch = (param) => {
        dispatch({
    		type: 'activity/getActivity',
    		payload: filterObj({ startTime, endTime })
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

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                </Form>
            </FormInlineLayout>

            <TableLayout
                dataSource={tableData}
                allColumns={columns}
                loading={ loading.effects['activity/getActivity'] }
                />
		</div>
	)
};

Activity.propTypes = {
    activity: PropTypes.object
};

export default connect(({ activity, loading }) => ({ activity, loading }))(Form.create()(Activity));
	