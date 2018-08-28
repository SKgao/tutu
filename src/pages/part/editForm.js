import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Row, Col, Checkbox, Button, Radio, message } from 'antd';
import { formItemLayout } from '@/configs/layout';
import MyUpload from '@/components/UploadComponent';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const editForm = ({
    partmodel,
    ...props
}) => {
  let { dispatch, form } = props;
  let { partList, modalAddShow, icon,title,tips,unitsId } = partmodel;
    const { getFieldDecorator, validateFieldsAndScroll, resetFields,setFieldsValue,getFieldsValue } = form;
    // 提交表单
    const handleSubmit = (e) => {
        e.preventDefault();
        let data={
            icon:icon|| '',
            title:title|| '',
            tips:tips||'',
            unitsId:64
        }
        validateFieldsAndScroll((err, values) => {
            validateFieldsAndScroll((err, values) => {
                if (!err) {
                    for (let key in values) {
                        if (values[key]) {
                            data[key]=values[key]
                        }
                    }
                }
            })
        });
        dispatch({
            type: 'partmodel/addPart',
            payload: data
        })
    }

    // 取消重置表单
    const handleReset = (e) => {
        resetFields();
        dispatch({
            type: 'partmodel/setParam',
            payload: {
                modal2Show:false
            }
        })
    }
    // 上传音频回调
    const iconUploadSuccess = (url) => {
        // setFieldsValue({'icon': url})
        dispatch({
            type: 'partmodel/setParam',
            payload: {
                icon:url
            }
        })
    }
    // 上传音频回调
    const audioUploadSuccess = (url) => {
        // setFieldsValue({'audio': url})
        dispatch({
            type: 'partmodel/setParam',
            payload: {
                audio:url
            }
        })
    }
	return (
        <div>
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="part名称"
                    >
                    {getFieldDecorator('title', {
                        initialValue:title || '',
                        rules: [{ required: true, message: '请输入part名称!', whitespace: true }],
                    })(
                        <Input placeholder="请输入part名称"/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="part描述"
                    >
                    {getFieldDecorator('tips',{
                        initialValue:tips || '',
                        rules: [{ required: true, message: '请输入part描述!', whitespace: true }],
                    })(
                        <Input placeholder="请输入part描述"/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="part图标"
                    >
                    {getFieldDecorator('icon',{
                      initialValue:icon || '',
                    })(
                        <img src={ icon } style={{ width: 30, height: 40 }}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="上传part图标"
                    >
                    {getFieldDecorator('icon')(
                        <MyUpload uploadSuccess={iconUploadSuccess}></MyUpload>
                    )}
                </FormItem>

                <FormItem>
                    <Button type="primary" onClick={handleSubmit} style={{ marginLeft: 75 }}>提交</Button>
                    <Button onClick={handleReset} style={{ marginLeft: 15 }}>取消</Button>
                </FormItem>
            </Form>
		</div>
	)
};
editForm.propTypes = {
    partmodel: PropTypes.object // 表单提交
};

export default connect(({partmodel}) => ({ partmodel }))(Form.create()(editForm));
