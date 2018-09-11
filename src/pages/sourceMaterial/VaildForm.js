import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Row, Col, Checkbox, Button, Radio, message, Select } from 'antd';
import { formItemLayout } from '@/configs/layout';
import MyUpload from '@/components/UploadComponent';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const ValidForm = ({
    submitForm,
    sourcematerial,
    changeTextBookId,
    ...props
}) => {
    let { form, dispatch } = props;
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
                values.text = sourcematerial.content;
                submitForm && submitForm(values);
                resetFields();
            }
        });
    }

    // 重置表单
    const handleReset = (e) => {
        resetFields();
        dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                content: '',
                iconUrl: '',
                audioUrl: ''
            }
        })
        submitForm("false")
    }
    // 上传图片回调
    // const iconUploadSuccess = (url) => {
    //     console.log(this.props.form.getFieldsValue())
    // }
    
    // 上传音频回调
    const iconUploadSuccess = (url) => {
        setFieldsValue({
            'icon': url
        })
        dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                iconUrl: url
            }
        })
    }
    
    // 获取文件信息
    const getFileInfo = (file, tag) => {
        if (tag === 'icon') {
            dispatch({
                type: 'sourcematerial/setParam',
                payload: {
                    content: file.name.trim().slice(0, -4)
                }
            })
        } else if (tag === 'audio') {
            let reg = /[a-zA-Z]|\s+/g;
            if (sourcematerial.iconUrl) {
                return;
            } else {
                dispatch({
                    type: 'sourcematerial/setParam',
                    payload: {
                        content: file.name.trim().slice(0, -4).match(reg).join('').toLowerCase()
                    }
                })
            }
        }
    }

    // 上传音频回调  sourcematerial.bookList
    const audioUploadSuccess = (url) => {
        setFieldsValue({'audio': url})
        dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                audioUrl: url
            }
        })
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <FormItem
                    label="教材"
                    hasFeedback
                    {...formItemLayout}
                    >
                    {getFieldDecorator('textbookId', {
                        initialValue: sourcematerial.textbookId,
                        rules: [{ required: true, message: '请选择教材!' }],
                    })(
                        <Select
                            showSearch
                            placeholder="请选择教材"
                            onChange={v => changeTextBookId({ textbookId: v })}
                            onFocus={() => dispatch({type: 'sourcematerial/getBook'})}
                            > 

                            {
                                sourcematerial.bookList.map(item =>
                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                )
                            }
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="素材内容"
                    >
                    {getFieldDecorator('text', {
                        initialValue: sourcematerial.content,
                        rules: [{ required: true, message: '请输入素材内容!', whitespace: true }],
                    })(
                        <Input placeholder="请上传素材图片、音频" readOnly/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="素材图标地址"
                    >
                    {getFieldDecorator('icon')(
                        <MyUpload
                           uploadSuccess={iconUploadSuccess}
                           getFileInfo={ (file) => getFileInfo(file, 'icon') }>
                        </MyUpload>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="音频地址"
                    >
                    {getFieldDecorator('audio')(
                        <MyUpload 
                            uploadSuccess={audioUploadSuccess}
                            getFileInfo={ (file) => getFileInfo(file, 'audio') }>>
                        </MyUpload>
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
    submitForm: PropTypes.func, // 表单提交
    changeTextBookId: PropTypes.func
};

export default connect(({ sourcematerial }) => ({ sourcematerial }))(Form.create()(ValidForm));