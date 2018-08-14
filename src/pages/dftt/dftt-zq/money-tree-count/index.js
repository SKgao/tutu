import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';

import { Form, DatePicker, Input, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const MoneyTreeCount = ({
	moneyTreeCount
}) => {
	return (
		<div>
			MoneyTreeCount Page
		</div>
	)
};

MoneyTreeCount.propTypes = {
	moneyTreeCount: PropTypes.object,
};

export default connect(({ moneyTreeCount }) => ({ moneyTreeCount }))(MoneyTreeCount);
	