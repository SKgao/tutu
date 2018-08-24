<<<<<<< HEAD

=======
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
import PropTypes from 'prop-types';
import { Form, Input, Row, Col, Checkbox, Button, Radio, message } from 'antd';
import { formItemLayout } from '@/configs/layout';
import MyUpload from '@/components/UploadComponent';
<<<<<<< HEAD
=======
<<<<<<< HEAD
import audioUpload from '@/components/audioUpload';
=======
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
>>>>>>> dev
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const ValidForm = ({
    submitForm,
    ...props
}) => {
    let { form } = props;
<<<<<<< HEAD
    const { getFieldDecorator, validateFieldsAndScroll, resetFields, setFieldsValue, getFieldsValue } = form;
=======
<<<<<<< HEAD
    const { getFieldDecorator, validateFieldsAndScroll, resetFields,setFieldsValue,getFieldsValue } = form;
>>>>>>> dev

    // 提交表单
    const handleSubmit = (e) => {
        e.preventDefault();
        // submitForm({
        //   audio: 1,
        //   icon: 2,
        //   text: 3
        // })
        validateFieldsAndScroll((err, values) => {
<<<<<<< HEAD
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
=======
            console.log(values);
            if (!err) {
                for (let key in values) {
                    if (key === 'text' || key === 'icon' || key === 'audio') {
                        if (values[key]) {
                            values[key] = values[key] - 0
                        }
                    }
                }
                submitForm(values);
=======
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
            if (!err) {
                submitForm && submitForm(values);
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
            }
        });
    }

    // 重置表单
    const handleReset = (e) => {
<<<<<<< HEAD
    	resetFields();
        submitForm("false")
    }
    // 上传图片回调
    const iconUploadSuccess = (url) => {
        console.log(this.props.form.getFieldsValue())
        // this.props.form.setFieldsValue('icon', url)
    }
    // 上传音频回调
    const audioUploadSuccess = (url) => {
        form.setFieldsValue('audio', url)
    }
	return (
=======
        resetFields();
        submitForm("false")
    }
    // 上传图片回调
    // const iconUploadSuccess = (url) => {
    //     console.log(this.props.form.getFieldsValue())
    // }
    // 上传音频回调
>>>>>>> dev
    const iconUploadSuccess = (url) => {
        setFieldsValue({'icon': url})
        console.log(this.props.form.getFieldsValue())
    }
    // 上传音频回调
    const audioUploadSuccess = (url) => {
        setFieldsValue({'audio': url})
    }
    return (
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
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
<<<<<<< HEAD
		</div>
	)
};

ValidForm.propTypes = {
    submitForm: PropTypes.func // 表单提交
<<<<<<< HEAD
};

export default (Form.create()(ValidForm));
=======
};

export default (Form.create()(ValidForm));
=======
        </div>
    )
};

ValidForm.propTypes = {
    submitForm: PropTypes.func, // 表单提交
};

export default (Form.create()(ValidForm));
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
>>>>>>> dev
