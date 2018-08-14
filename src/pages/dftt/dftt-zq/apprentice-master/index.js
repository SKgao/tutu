import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';

import { Form, DatePicker, Input, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const ApprenticeMaster = ({
	apprenticeMaster
}) => {
	return (
		<div>
			ApprenticeMaster Page
		</div>
	)
};

ApprenticeMaster.propTypes = {
	apprenticeMaster: PropTypes.object,
};

export default connect(({ apprenticeMaster }) => ({ apprenticeMaster }))(ApprenticeMaster);
	