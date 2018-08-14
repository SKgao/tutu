import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';

import { Form, DatePicker, Input, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const DailySign = ({
	dailySign
}) => {
	return (
		<div>
			DailySign Page
		</div>
	)
};

DailySign.propTypes = {
	dailySign: PropTypes.object,
};

export default connect(({ dailySign }) => ({ dailySign }))(DailySign);
	