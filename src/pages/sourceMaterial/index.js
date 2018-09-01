import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import UploadProgress from '@/components/UploadProgress';
import VaildForm from './VaildForm';
import EditForm from './editForm';

import moment from 'moment';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, Input, Button, Popconfirm, Modal, Tabs, Select, DatePicker, Upload, Icon, message, Tooltip, Checkbox } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

const sourceMaterial = ({
    sourcematerial,
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { materialList, modalShow, modal2Show, modal3Show, startTime, endTime, text, pageNum, pageSize, activeKey, audioArray, imageArray, sentensArray, openLike } = sourcematerial;
    let { getFieldDecorator, getFieldValue, resetFields } = form;

    // 鼠标放在图片上的事件
    const mouseEnter=(e)=>{

    }
    const columns = [
        {
            title: '素材内容',
            dataIndex: 'text',
            sorter: true
        }, {
          title: '素材图标',
          dataIndex: 'icon',
          render: (text) => {
             return (text) ? <Popconfirm icon={<img src={ text } style={{ width: 110, height: 120 }}/>} cancelText="取消" okText="确定">
                    <img src={ text } style={{ width: 30, height: 40 }}/>
                </Popconfirm>: <span>无</span>
          }
        }, {
          title: '素材音频',
          dataIndex: 'audio',
          render: (audio) => {
             return (audio) ? <audio src={audio} controls="controls"></audio> : <span>无</span>
          }
        }, {
            title: '音标',
            dataIndex: 'phonetic'
        }, {
            title: '单次释义',
            dataIndex: 'translation',
            render: (text) => <span>{ text.replace(/\[|\]|\"/g, '') }</span>
        }, {
            title: '多次释义',
            dataIndex: 'explainsArray',
            render: (text) => {
                let str = text.replace(/\[|\]|\"/g, '')
                if (!str) {
                    return <span>无</span>
                } else if (str.length < 20) {
                    return <span>{ str }</span>
                } else {
                    return <Tooltip title={str}>
                        <span>{ str.substr(0, 20) + '...' }</span>
                    </Tooltip>
                }
            }
        }, {
          title: '操作',
            dataIndex: 'action',
            render: (txt, record, index) => {
                return <span>
                    <Popconfirm title="是否删除?" onConfirm={() => handleDelete(record)}>
                        <Button type="danger" size="small" style={{ marginLeft: 10 }}>删除</Button>
                    </Popconfirm>
                    <Button type="primary" size="small" style={{ marginLeft: 10 }} onClick={()=>handleEdit(record)}>修改</Button>
                </span>
            }
        }
    ]

    /**
     * 删除教材
     * @param  {object} 列数据
     */
    const handleDelete = (param) => {
        dispatch({
          type: 'sourcematerial/deleteSource',
          payload: {
                id: param.id
            }
        })
    }

    // 搜索
    const handleSearch = () => {
      dispatch({
        type: 'sourcematerial/getSource',
        payload: filterObj({ startTime, endTime, text, pageNum, pageSize, openLike })
      })
    }
    // 添加素材
    const submitForm = (e) => {
        if (e!="false") {
            let PP = {
                // audio: getFieldValue('audio'),
                // icon: getFieldValue('icon'),
                // text: getFieldValue('text')
                audio: e.audio,
                icon: e.icon,
                text: e.text
            }
            dispatch({
                type: 'sourcematerial/addSource',
                payload: filterObj(PP)
            })
        }else{
            handleSubmit('modalShow',false)
        }
    }
    // 显示添加素材modal
    const handleSubmit=(flag, show)=>{
      dispatch({
        type: 'sourcematerial/setParam',
        payload: {
            [flag]: show
          }
      })
    }

    // 表单取消
    const handleReset  = (m) => {
        resetFields();
        dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                [m]: false,
                audioArray: [],
                imageArray: [],
                sentensArray: []
            }
        })
    }
    // 编辑素材 显示modal
    const handleEdit= (e) =>{
        dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                modal2Show: true,
                id: e.id,
                icon: e.icon,
                audio: e.audio,
                text: e.text,
                phonetic: e.phonetic,
                translation: e.translation,
                explainsArray: e.explainsArray
            }
        })
    }
    
    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'sourcematerial/setParam',
    		payload: param
        })
        dispatch({
    		type: 'sourcematerial/getSource',
    		payload: filterObj({ startTime, endTime, openLike, text, ...param })
    	})
    }

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
          type: 'sourcematerial/setParam',
          payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }

    // 搜索素材内容
    const changeText = (event) => {
        dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                text: event.target.value
            }
        })
    }

    // 上传音频、图片目录
    const uploadFileArray = (file, fileList, array) => {
        const MAX_LEN = 500
        fileList.length < MAX_LEN  && dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                [array]: fileList.map(e => e.name)
            }
        })
        return false;
    }

    // 导入资源(音频集合、图片集合)
    const handleSubmitSource = () => {
        dispatch({
            type: 'sourcematerial/addSubjectSource',
            payload: { 
                audioArray: audioArray.filter(e => e.slice(0, 1) !== '.' && e.slice(-4) === '.png'),
                imageArray: imageArray.filter(e => e.slice(0, 1) !== '.' && e.slice(-4) === '.mp3'),
                sentensArray: sentensArray.filter(e => e.slice(0, 1) !== '.')
            }
        })
    }

    // 切换tabs标签页
    const handleTabChange = (key = '0') => {
        if (key === '0') {
            dispatch({
                type: 'sourcematerial/getSource',
                payload: { pageNum, pageSize, startTime, endTime, openLike }
            })
        }
    	dispatch({
    		type: 'sourcematerial/setParam',
    		payload: {
				activeKey: key
			}
    	})
    }
    
    // table选中
    const tableRowSelectd = (selectedRowKeys, selectedRows) => {
        let sourceIds = selectedRows.map(e => e.id)
        dispatch({
    		type: 'sourcematerial/setParam',
    		payload: {
                selectedRowKeys,
				sourceIds
			}
    	})
    }
     
    // 批量删除素材
    const handleBatchDelete = () => {
        dispatch({
    		type: 'sourcematerial/batchDeleteSource',
    		payload: sourcematerial.sourceIds
    	})
    }
    
    // 是否开启模糊搜索
    const handleOpenlike = (e) => {
        let isopen = e.target.checked
        dispatch({
    		type: 'sourcematerial/setParam',
    		payload: {
                openLike: e.target.checked ? '' : 1
            }
    	})
    }

  return (
    <div>
      <Tabs
        animated={false}
        activeKey={activeKey}
        onChange={handleTabChange}
      >
        <TabPane tab="素材列表" key="0">
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
                    {/*素材内容*/}
                    <FormItem label="素材内容">
                            {/*{getFieldDecorator('text')(<Input placeholder="请输入素材内容" onChange={ changeText(text)}/>)} {...getFieldProps('text', {})}*/}
                            <Input placeholder="请输入素材内容" onChange={ changeText}/>
                    </FormItem>

                    <FormItem>
                        <Checkbox onChange={handleOpenlike} checked={openLike ? false : true}>模糊搜索</Checkbox>
                        <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={() => handleSubmit('modalShow', true)}>添加素材</Button>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={() => handleSubmit('modal3Show', true)}>导入素材</Button>
                    </FormItem>

                    <FormItem>
                        <Popconfirm title="是否删除选中素材?" onConfirm={handleBatchDelete}>
                            <Button type="danger" disabled={!sourcematerial.sourceIds.length}>批量删除</Button>
                        </Popconfirm>
                    </FormItem>

                </Form>
            </FormInlineLayout>

            <Modal
                title="新增素材"
                visible={modalShow}
                onCancel= { () => handleSubmit('modalShow',false) }
                okText="确认"
                cancelText="取消"
                footer={null}
                sourcematerial={sourcematerial}
                maskClosable={false}
                >
                    {/*// <Form>
                    //     <VaildForm submitForm={submitForm}>
                    //     </VaildForm>
                    // </Form>*/}
                    <VaildForm submitForm={submitForm}>
                    </VaildForm>
                </Modal>
                <Modal
                    title="修改素材"
                    visible={modal2Show}
                    onCancel= { () => handleSubmit('modal2Show',false) }
                    okText="确认"
                    cancelText="取消"
                    footer={null}
                    sourcematerial={sourcematerial}
                    maskClosable={false}
                >
                <EditForm></EditForm>
                </Modal>

                <Modal
                    title="导入素材"
                    visible={modal3Show}
                    onOk={ () => handleSubmit('modal3Show', false) }
                    onCancel= { () => handleSubmit('modal3Show', false) }
                    okText="确认"
                    cancelText="取消"
                    footer={null}
                    >
                    <Form>
                        <FormItem
                            label="音频文件目录"
                            help={ audioArray.length ? `已选择${audioArray.length}个音频文件` : '请选择音频文件，不能超过500个' }
                            {...formItemLayout}
                            >
                            {getFieldDecorator('audioArray', {
                                // rules: [{ message: '请上传音频素材!' }],
                            })(
                                <Upload beforeUpload={(a, b) => uploadFileArray(a, b, 'audioArray')} directory multiple showUploadList={false}>
                                    <Button>
                                        <Icon type="upload"/>上传音频
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem
                            label="图片文件目录"
                            help={imageArray.length ? `已选择${imageArray.length}个图片文件` : '请选择图片文件，不能超过500个'}
                            {...formItemLayout}
                            >
                            {getFieldDecorator('imageArray', {
                            // rules: [{ message: '请上传图片素材!' }],
                            })(
                                <Upload beforeUpload={(a, b) => uploadFileArray(a, b, 'imageArray')} directory multiple showUploadList={false}>
                                    <Button>
                                        <Icon type="upload"/>上传图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem
                            label="句子素材目录"
                            help={sentensArray.length ? `已选择${sentensArray.length}个句子文件` : '请选择句子文件，不能超过500个'}
                            {...formItemLayout}
                            >
                            {getFieldDecorator('sentensArray', {
                            // rules: [{ message: '请上传图片素材!' }],
                            })(
                                <Upload beforeUpload={(a, b) => uploadFileArray(a, b, 'sentensArray')} directory multiple showUploadList={false}>
                                    <Button>
                                        <Icon type="upload"/>上传句子文件
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}>
                            <Button type="primary" onClick={handleSubmitSource} style={{ marginLeft: 45 }}>提交</Button>
                            <Button onClick={() => handleReset('modal3Show')} style={{ marginLeft: 15 }}>取消</Button>
                        </FormItem>
                    </Form>
                </Modal>
            <TableLayout
                //expandedRowRender={ record => <span>{ record.explainsArray }</span> }
                rowSelection={{
                    fixed: true,
                    type: 'checkbox',
                    onChange: tableRowSelectd,
                    selectedRowKeys: sourcematerial.selectedRowKeys
                }}
                pagination={false}
                dataSource={materialList}
                allColumns={columns}
                loading={ loading.effects['sourcematerial/getSource'] }
                />
            <PaginationLayout
                total={sourcematerial.totalCount}
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
            </TabPane>

            {
                (activeKey === '0') ? null :
                <TabPane tab="上传进度" key="1">
                    <UploadProgress
                        cardTitle={'素材上传进度'}
                        url={'subject/source/import/progress'}
                    >
                    </UploadProgress>
                </TabPane>
            }
        </Tabs>
    </div>
  )
};

sourceMaterial.propTypes = {
    sourcematerial: PropTypes.object
};

export default connect(({ sourcematerial, loading }) => ({ sourcematerial, loading }))(Form.create()(sourceMaterial));
