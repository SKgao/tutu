import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';

import { Form, DatePicker, Input, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const Download = ({
	download
}) => {
	return (
		<div>
			Download Page
		</div>
	)
};

Download.propTypes = {
	download: PropTypes.object,
};

export default connect(({ download }) => ({ download }))(Download);
	