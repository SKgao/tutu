import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';

import { Form, DatePicker, Input, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const BindingDaily = ({
	bindingDaily
}) => {
	return (
		<div>
			BindingDaily Page
		</div>
	)
};

BindingDaily.propTypes = {
	bindingDaily: PropTypes.object,
};

export default connect(({ bindingDaily }) => ({ bindingDaily }))(BindingDaily);
	