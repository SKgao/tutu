import PropTypes from 'prop-types';
import { Form, Input, Button, message, Tooltip, Icon } from 'antd';
import { formItemLayout } from '@/configs/layout';
import { filterObj } from '@/utils/tools';
import MyUpload from '@/components/UploadComponent';
import { connect } from 'dva';
const FormItem = Form.Item;

const AddProject = ({
    session,
    ...props
}) => {
    let { dispatch, form } = props;
    const { getFieldDecorator, validateFieldsAndScroll, resetFields, setFieldsValue } = form;

    // 添加题目
	const handleAddSubject = (e) => {
		e.preventDefault()
		validateFieldsAndScroll((err, values) => {
            console.log('添加题目::', values, err)
			if (!err) {
                const { sentenceAudio, sceneGraph } = session;
                values.customsPassId && (values.customsPassId = values.customsPassId - 0);
                values.id && (values.id = values.id - 0);
                values.partId && (values.partId = values.partId - 0);
                values.sort && (values.sort = values.sort - 0);
                values.sentenceAudio = sentenceAudio;
                values.sceneGraph = sceneGraph;
                values.showIndex = values.showIndex.split(/\s+/g);
                dispatch({
                    type: 'session/addTopic',
                    payload: filterObj(values)
                }).then(() => {
                    handleReset()
                })
			}
		});
    }

    // 重置表单
    const handleReset = (e) => {
        resetFields()
        dispatch({
    		type: 'session/setParam',
    		payload: {
    			modalShow3: false
    		}
    	})
    }

    // 设置头像
    const uploadSuccess = (url, field) => {
        setFieldsValue({ [field]: url });
    }

	return (
        <div>
            <Form>
                <FormItem
                    label="题目id"
                    {...formItemLayout}
                    >
                    {getFieldDecorator('id', {
                        rules: [{ required: true, message: '请输入题目id!' }],
                    })(
                        <Input placeholder="请输入题目id"/>
                    )}
                </FormItem>

                <FormItem
                    label="题目内容"
                    {...formItemLayout}
                    >
                    {getFieldDecorator('sourceIds', {
                        rules: [{ required: true, message: '请输入题目内容!' }],
                    })(
                        <Input placeholder="请输入题目内容"/>
                    )}
                </FormItem>

                <FormItem
                    label="题目顺序"
                    {...formItemLayout}
                    >
                    {getFieldDecorator('sort', {
                        rules: [{ required: true, message: '请输入题目顺序!' }],
                    })(
                        <Input placeholder="请输入题目顺序"/>
                    )}
                </FormItem>

                <FormItem
                    label={(
                        <span>
                            挖空规则&nbsp;
                            <Tooltip title="听音拼写挖空规则1  2，表示第1个和第2个提示，例如：do_ dog拼写">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                        )}
                    {...formItemLayout}
                    >
                    {getFieldDecorator('showIndex', {
                        rules: [{ required: false, message: '请输入挖空规则, 数字之间用 空格 分隔开!' }],
                    })(
                        <Input placeholder="请输入挖空规则, 数字之间用 空格 分隔开!"/>
                    )}
                </FormItem>

                <FormItem
                    label="场景图片"
                    {...formItemLayout}
                    >
                    <MyUpload uploadSuccess={url => uploadSuccess(url, 'sceneGraph')}></MyUpload>
                </FormItem>

                <FormItem
                    label="题目图片"
                    {...formItemLayout}
                    >
                    <MyUpload uploadSuccess={url => uploadSuccess(url, 'icon')}></MyUpload>
                </FormItem>

                    <FormItem
                    label={(
                        <span>
                            句子音频&nbsp;
                            <Tooltip title="题目是句子+词组时导入">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                        )}
                    {...formItemLayout}
                    >
                    <MyUpload uploadSuccess={url => uploadSuccess(url, 'sentenceAudio')}></MyUpload>
                </FormItem>

                <FormItem
                    label="音频地址"
                    {...formItemLayout}
                    >
                    <MyUpload uploadSuccess={url => uploadSuccess(url, 'audio')}></MyUpload>
                </FormItem>


                <FormItem
                    {...formItemLayout}>
                    <Button type="primary" onClick={handleAddSubject} style={{ marginLeft: 45 }}>提交</Button>
                    <Button onClick={() => handleReset('modalShow3')} style={{ marginLeft: 15 }}>取消</Button>
                </FormItem>
            </Form>
		</div>
	)
};

AddProject.propTypes = {
    session: PropTypes.object
};

export default connect(({ session }) => ({ session }))(Form.create()(AddProject));