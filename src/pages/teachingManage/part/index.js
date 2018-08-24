import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';

import { Form, Input, Button, message } from 'antd';
const FormItem = Form.Item;

const UnitPart = ({
    unitPart,
    ...props
}) => {
    let { dispatch } = props;
    let { part } = unitPart;

    /**
     * 添加单元
     * @param  {object} 列数据
     */
    const addUnitPart = () => {
        // if (part.trim()) {
        //     dispatch({
        //         type: 'unitPart/addPart',
        //         payload: part
        //     })
        // } else {
        //     message.warning('请输入part')
        // }
    }

    // 输入part
    const handleInput = (e) => {
        dispatch({
            type: 'unitPart/setParam',
            payload: {
                part: e.target.value
            }
        })
    }

	return (
		<div>
			<FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>
                    <FormItem label="part">
                        <Input placeholder="输入part" onChange={(e) => handleInput(e)}/>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={addUnitPart}>添加part</Button>
                    </FormItem>

                </Form>
            </FormInlineLayout>
		</div>
	)
};

UnitPart.propTypes = {
    unitPart: PropTypes.object
};

export default connect(({ unitPart }) => ({ unitPart }))(UnitPart);
	