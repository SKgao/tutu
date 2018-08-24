
import PropTypes from 'prop-types';
import { Form, Input, Row, Col, Checkbox, Button, Radio, message } from 'antd';
import { formItemLayout } from '@/configs/layout';
import MyUpload from '@/components/UploadComponent';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const ValidForm = ({
    submitForm,
    ...props
}) => {
    let { form } = props;
    const { getFieldDecorator, validateFieldsAndScroll, resetFields, setFieldsValue, getFieldsValue } = form;

    // 提交表单
    const handleSubmit = (e) => {
        e.preventDefault();
        // submitForm({
        //   audio: 1,
        //   icon: 2,
        //   text: 3
        // })
        validateFieldsAndScroll((err, values) => {
          //   if (!err) {
          //     console.log(111)
          //       for (let key in values) {
          //           if (key === 'text' || key === 'icon' || key === 'audio') {
          //               if (values[key]) {
          //                   values[key] = values[key] - 0
          //               }
          //           }
          //       }
          //       submitForm(values);
          // }
          if (!err) {
              submitForm && submitForm(values);
          }

        })
      }

    // 重置表单
    const handleReset = (e) => {
    	 resetFields();
        submitForm("false")
    }
    // 上传图片回调
    // const iconUploadSuccess = (url) => {
    //     console.log(this.props.form.getFieldsValue())
    // }
    // 上传音频回调
    const iconUploadSuccess = (url) => {
        setFieldsValue({'icon': url})
        console.log(this.props.form.getFieldsValue())
    }
    // 上传音频回调
    const audioUploadSuccess = (url) => {
        setFieldsValue({'audio': url})
    }
	return (
        <div>
            <Form onSubmit={handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="素材内容"
                    >
                    {getFieldDecorator('text', {
                        rules: [{ required: true, message: '请输入素材内容!', whitespace: true }],
                    })(
                        <Input placeholder="请输入素材内容"/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="素材图标地址"
                    >
                    {getFieldDecorator('icon')(
                        <MyUpload uploadSuccess={iconUploadSuccess}></MyUpload>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="音频地址"
                    >
                    {getFieldDecorator('audio', {
                        // rules: [{ required: true, message: '请输入音频地址!' }],
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

ValidForm.propTypes = {
    submitForm: PropTypes.func // 表单提交
};

export default (Form.create()(ValidForm));
