import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';

import { Form, DatePicker, Input, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const DailyDetail = ({
	dailyDetail
}) => {
	return (
		<div>
			DailyDetail Page
		</div>
	)
};

DailyDetail.propTypes = {
	dailyDetail: PropTypes.object,
};

export default connect(({ dailyDetail }) => ({ dailyDetail }))(DailyDetail);
	