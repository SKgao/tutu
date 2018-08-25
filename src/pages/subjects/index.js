import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import MyUpload from '@/components/UploadComponent';

import moment from 'moment';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, DatePicker, Input, Button, Popconfirm, Modal, message, Select, Icon, Upload } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const Subject = ({
    subject,
    ...props
}) => {
    let { dispatch, form } = props;
    let { subjectList, descList, modalShow, modal2Show, startTime, endTime, bookList, pageNum, pageSize, customsPassId, sort, textBookId, sourceIds } = subject;
    let { getFieldDecorator, getFieldValue, setFieldsValue, resetFields } = form;
    
    // 题目列表
    const subjectCol = [
        {
            title: '题型名称',
            dataIndex: 'subjectTypeName',
            sorter: true
        }, {
            title: '题目内容',
            dataIndex: 'sourceIds',
            sorter: true
        }, {
            title: '题目顺序',
            dataIndex: 'sort',
            sorter: true
        }
    ]
    
    // 关卡详情列表
    const descCol = [
        {
            title: '关卡id',
            dataIndex: 'customsPassId',
            sorter: true
        }, {
            title: '题目',
            dataIndex: 'sourceIds',
            sorter: true
        }, {
            title: '题目顺序',
            dataIndex: 'sort',
            sorter: true
        }, {
            title: '素材包',
            dataIndex: 'action',
            render: (text) => <a href="#">查看素材包</a>
        }
    ]

    const columns = (customsPassId) ? descCol : subjectCol;
    const dataSource = (customsPassId) ? descList : subjectList;

    // 添加题目
    const handleSubmitSubject = () => {
        let obj = {
            textbookId: textBookId,
            file: getFieldValue('file')
        }
        let formData = new FormData();
        for (let key in obj) {
            if (obj[key] || obj[key] === 0) {
                formData.append(key, obj[key]);
            }
        }
        dispatch({
        	type: 'subject/addSubject',
        	payload: formData
        })
    }

    // 添加素材
    const handleSubmitSource = () => {
        let audioArray = getFieldValue('audioArray')
        let imageArray = getFieldValue('imageArray')
        let obj = {
            audioArray: audioArray ? [audioArray] : '',
            imageArray: imageArray ? [imageArray] : ''
        }
        dispatch({
        	type: 'subject/addSource',
        	payload: filterObj(obj)
        })
    }
    
    // 展示modal
    const changeModalState = (_m, show) => {
        dispatch({
        	type: 'subject/setParam',
        	payload: {
                [_m]: show
            }
        })
    }

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'subject/setParam',
        	payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }

    // 表单取消
    const handleReset  = (_m) => {
        resetFields()
        dispatch({
    		type: 'subject/setParam',
    		payload: {
    			[_m]: false
    		}
    	})
    }

    // 文件上传成功
    const uploadSuccess = (url, _m) => setFieldsValue({ [_m]: url })

    // 返回
    const goBack = () => dispatch(routerRedux.goBack(-1))

    // 搜搜题目
    const handleSearch = () => {
        dispatch({
    		type: 'subject/getSubject',
    		payload: filterObj({ startTime, endTime, sourceIds, pageNum, pageSize })
    	})
    }
   
    const handleChange = (param) => {
        dispatch({
    		type: 'subject/setParam',
    		payload: param
        })
        dispatch({
    		type: 'subject/getSubject',
    		payload: filterObj({ startTime, endTime, sourceIds, ...param })
    	})
    }

    // 上传题目
    const handleUpload = (file) => {
        if (file.event && file.event.type === 'progress') {
            setFieldsValue({ 'file': file.fileList[0].originFileObj })
        }
    }

    // 改版教材id
    const changeTextBookId = (param) => {
        dispatch({
    		type: 'subject/setParam',
    		payload: param
        })
    }

    // 输入题目名
    const handleInput = (e) => {
        dispatch({
    		type: 'subject/setParam',
    		payload: {
                sourceIds: e.target.value
            }
        })
    }

	return (
		<div>
			<FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>
                    {/*时间*/}
                    <FormItem label="时间">
                        <RangePicker
                            format="YYYY-MM-DD HH:mm"
                            showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                            }}
                            format="YYYY-MM-DD HH:mm"
                            onChange={datepickerChange}
                            />
                    </FormItem>

                    {/*题目*/}
                    <FormItem label="题目">
                        <Input placeholder="输入题目名" onChange={(e) => handleInput(e)}/>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={() => changeModalState('modal2Show', true)}>导入素材</Button>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={() => changeModalState('modalShow',true)}>导入题目</Button>
                    </FormItem>
                    
                    {
                        !customsPassId  ? null : 
                        <FormItem>
                            <a className={'link-back'} onClick={goBack}><Icon type="arrow-left"/>后退</a>
                        </FormItem>
                    }

                </Form>
            </FormInlineLayout>

            <Modal
                title="导入题目"
                visible={modalShow}
                onOk={ () => changeModalState('modalShow', false) }
                onCancel= { () => changeModalState('modalShow', false) }
                okText="确认"
                cancelText="取消"
                footer={null}
                >
                <Form>
                    <FormItem
                        label="教材"
                        hasFeedback
                        {...formItemLayout}
                        >
                        {getFieldDecorator('textBookId', {
                            rules: [{ required: true, message: '请选择教材!' }],
                        })(
                            <Select
                                showSearch
                                onChange={v => changeTextBookId({ textBookId: v })}
                                onFocus={() => dispatch({type: 'subject/getBook'})}
                                >
                                {
                                    bookList.map(item =>
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem
                        label="题目"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('file', {
                            rules: [{ required: true, message: '请上传题目包!' }],
                        })(
                            <Upload onChange={handleUpload}>
                                <Button>
                                    <Icon type="upload"/>上传题目
                                </Button>
                            </Upload>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}>
                        <Button type="primary" onClick={handleSubmitSubject} style={{ marginLeft: 75 }}>提交</Button>
                        <Button onClick={() => handleReset('modalShow')} style={{ marginLeft: 15 }}>取消</Button>
                    </FormItem>
                </Form>
            </Modal>

            <Modal
                title="导入素材"
                visible={modal2Show}
                onOk={ () => changeModalState('modal2Show', false) }
                onCancel= { () => changeModalState('modal2Show', false) }
                okText="确认"
                cancelText="取消"
                footer={null}
                >
                <Form>
                    <FormItem
                        label="音频文件目录"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('audioArray', {
                            rules: [{ message: '请上传音频素材!' }],
                        })(
                            <MyUpload directory={true} uploadSuccess={(url) => uploadSuccess(url, 'audioArray')} uploadTxt={'上传音频素材'}></MyUpload>
                        )}
                    </FormItem>

                    <FormItem
                        label="图片文件目录"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('imageArray', {
                            rules: [{ message: '请上传图片素材!' }],
                        })(
                            <MyUpload directory={true} uploadSuccess={(url) => uploadSuccess(url, 'imageArray')} uploadTxt={'上传图片素材'}></MyUpload>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}>
                        <Button type="primary" onClick={handleSubmitSource} style={{ marginLeft: 45 }}>提交</Button>
                        <Button onClick={() => handleReset('modal2Show')} style={{ marginLeft: 15 }}>取消</Button>
                    </FormItem>
                </Form>
            </Modal>
             
            <div>
                <TableLayout
                    pagination={false}
                    dataSource={dataSource}
                    allColumns={columns}
                    />
                {
                    customsPassId ? null :
                    <PaginationLayout
                        total={subject.totalCount}
                        onChange={(page, pageSize) => handleChange({
                            pageNum: page,
                            pageSize
                        })}
                        onShowSizeChange={(current, pageSize) => handleChange({
                            pageNum: 1,
                            pageSize
                        })}
                        current={pageNum}
                        pageSize={pageSize} />
                }
            </div>
		</div>
	)
};

Subject.propTypes = {
    subject: PropTypes.object
};

export default connect(({ subject }) => ({ subject }))(Form.create()(Subject));
	