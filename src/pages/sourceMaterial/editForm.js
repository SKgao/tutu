import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Row, Col, Checkbox, Button, Radio, message } from 'antd';
import { formItemLayout } from '@/configs/layout';
import MyUpload from '@/components/UploadComponent';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const editForm = ({
    sourcematerial,
    ...props
}) => {
    let { form,dispatch } = props;
    const { getFieldDecorator, validateFieldsAndScroll, resetFields,setFieldsValue,getFieldsValue } = form;
    let { materialList, modalShow, modal2Show, startTime, endTime, audio, icon,text,iconUrl } = sourcematerial;
    // 提交表单
    const handleSubmit = (e) => {
        e.preventDefault();
        let data={
            icon:icon|| '',
            audio:audio|| '',
            text:text||''
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
        console.log(data)
        dispatch({
            type: 'sourcematerial/editSource',
            payload: data
        }) 
    }

    // 取消重置表单
    const handleReset = (e) => {
        resetFields();
        dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                modal2Show:false
            }
        }) 
    }
    // 上传音频回调
    const iconUploadSuccess = (url) => {
        // setFieldsValue({'icon': url})
        dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                icon:url
            }
        }) 
    }
    // 上传音频回调
    const audioUploadSuccess = (url) => {
        // setFieldsValue({'audio': url})
        dispatch({
            type: 'sourcematerial/setParam',
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
                    label="素材内容"
                    >
                    {getFieldDecorator('text', {
                        initialValue:text || '',
                        rules: [{ required: true, message: '请输入素材内容!', whitespace: true }],
                    })(
                        <Input placeholder="请输入素材内容"/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="素材图标地址"
                    >
                    {getFieldDecorator('icon',{
                        initialValue:icon || ''
                    })(
                        <Input placeholder="请输入素材内容" disabled/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="上传素材图标"
                    >
                    {getFieldDecorator('icon')(
                        <MyUpload uploadSuccess={iconUploadSuccess}></MyUpload>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="音频地址"
                    >
                    {getFieldDecorator('audio',{
                        initialValue:audio || ''
                    })(
                        <Input placeholder="请输入素材内容" disabled/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="音频地址"
                    >
                    {getFieldDecorator('audio', {
                        rules: [{ required: true, message: '请输入音频地址!' }],
                    })(
                        <MyUpload uploadSuccess={audioUploadSuccess}></MyUpload>
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
    sourcematerial: PropTypes.object // 表单提交
};

export default connect(({sourcematerial}) => ({ sourcematerial }))(Form.create()(editForm));