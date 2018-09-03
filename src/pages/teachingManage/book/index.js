import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import MyUpload from '@/components/UploadComponent';

import moment from 'moment';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, Input, Button, Popconfirm, Modal, Tabs, Select, DatePicker, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

const TeachingManage = ({
    teachingmanage,
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { bookList, gradeList, versionList, modalShow, startTime, endTime, gradeId, activeKey, bookVersionName, gradeName, bookVersionId, pageNum, pageSize, totalCount } = teachingmanage;
    let { getFieldDecorator, getFieldValue, resetFields, setFieldsValue } = form;
    
    // 表格配置
    const columnsOpt = {
        bookList, gradeList, versionList,
        // 书籍管理表格
        bookColumns: [
            {
                title: '教材名',
                dataIndex: 'name',
                render: (text, record) =>
                    <TablePopoverLayout
                        title={'修改教材名'}
                        valueData={text || '无'}
                        defaultValue={text || '无'}
                        onOk={v => 
                            dispatch({
                                type: 'teachingmanage/updateBook',
                                payload: {
                                    id: record.id,
                                    name: v
                                }
                            })
                        }/>
            }, {
                title: '创建时间',
                dataIndex: 'createdAt'
            }, {
                title: '年级',
                dataIndex: 'gradeId',
                sorter: true,
                render: (text, record) =>
                    <TablePopoverLayout
                        title={'修改年级'}
                        valueData={gradeList}
                        focusSelect={() => dispatch({type: 'teachingmanage/getGrade'})}
                        optionKey={'id'}
                        optionItem={'gradeName'}
                        defaultValue={text || '无'}
                        onOk={v => 
                            dispatch({
                                type: 'teachingmanage/updateBook',
                                payload: {
                                    id: record.id,
                                    gradeId: v - 0
                                }
                            })
                        }/>
            }, {
                title: '教材版本',
                dataIndex: 'bookVersionId',
                sorter: true,
                render: (text, record) =>
                    <TablePopoverLayout
                        title={'修改教材版本'}
                        valueData={versionList}
                        focusSelect={() => dispatch({type: 'teachingmanage/getVersion'})}
                        optionKey={'id'}
                        optionItem={'name'}
                        defaultValue={text || '无'}
                        onOk={v => 
                            dispatch({
                                type: 'teachingmanage/updateBook',
                                payload: {
                                    id: record.id,
                                    bookVersionId: v - 0
                                }
                            })
                    }/>
            }, {
                title: '教材封面图',
                dataIndex: 'icon',
                sorter: true,
                render: (text) => {
                   return (text) ?  <a href={ text } target='_blank'><img src={ text } style={{ width: 35, height: 40 }}/></a> : <span>无</span>
                }
            }, {
                title: '上传封面图',
                dataIndex: 'updateicon',
                render: (text, record, index) => {
                    return <MyUpload uploadTxt={'上传封面图'} uploadSuccess={(url) => {
                        changeIcon(url, record)
                    }}></MyUpload>
                }
            }, {
                title: '操作',
                dataIndex: 'action',
                render: (txt, record, index) => {
                    return <span>
                        <Popconfirm title="是否删除?" onConfirm={() => handleDelete(record)}>
                            <Button type="danger" size="small" style={{ marginLeft: 10 }}>删除</Button>
                        </Popconfirm>

                        <Button type="primary" size="small" onClick={() => linktoUnit(record)} style={{ marginLeft: 10 }}>查看单元</Button>
                    </span>
                }
            }
        ],
        // 年级管理表格
        gradeColumns: [
            {
                title: '年级名称',
                dataIndex: 'gradeName',
                render: (text, record) =>
                    <TablePopoverLayout
                        title={'修改年级名称'}
                        valueData={text || '无'}
                        defaultValue={text || '无'}
                        onOk={v => 
                            dispatch({
                                type: 'teachingmanage/updateGrade',
                                payload: {
                                    id: record.id,
                                    gradeName: v
                                }
                            })
                        }/>
            }, {
                title: '年级id',
                dataIndex: 'id',
                sorter: true
            }, {
                title: '操作',
                dataIndex: 'action',
                render: (txt, record, index) => {
                    return <span>
                        <Popconfirm title="是否删除?" onConfirm={() => handleDeleteGrade(record)}>
                            <Button type="danger" size="small" style={{ marginLeft: 10 }}>删除</Button>
                        </Popconfirm>
                    </span>
                }
            }
        ],
        // 版本管理表格
        versionColumns: [
            {
                title: '教材版本名称',
                dataIndex: 'name',
                render: (text, record) =>
                    <TablePopoverLayout
                        title={'修改教材版本名称'}
                        valueData={text || '无'}
                        defaultValue={text || '无'}
                        onOk={v => 
                            dispatch({
                                type: 'teachingmanage/updateVersion',
                                payload: {
                                    id: record.id,
                                    name: v
                                }
                            })
                        }/>
            }, {
                title: '教材版本id',
                dataIndex: 'id',
                sorter: true
            }, {
                title: '操作',
                dataIndex: 'action',
                render: (txt, record, index) => {
                    return <span>
                        <Popconfirm title="是否删除?" onConfirm={() => handleDeleteVersion(record)}>
                            <Button type="danger" size="small" style={{ marginLeft: 10 }}>删除</Button>
                        </Popconfirm>
                    </span>
                }
            }
        ]
    }
    
    // 修改素材
    const changeIcon = (url, record) => {
        dispatch({
    		type: 'teachingManage/updateBook',
    		payload: {
                id: record.id,
                icon: url
            }
    	})
    }
    

    // 调转到单元页面
    const linktoUnit = (record) => {
        dispatch(routerRedux.push({
            pathname: '/teachingManage/unit'
        }));
    }
    
    /**
     * 删除年级
     * @param  {object} 列数据
     */
    const handleDeleteGrade = (param) => {
        dispatch({
    		type: 'teachingmanage/deleteGrade',
    		payload: {
                id: param.id
            }
    	})
    }

    /**
     * 删除教材版本
     * @param  {object} 列数据
     */
    const handleDeleteVersion = (param) => {
        dispatch({
    		type: 'teachingmanage/deleteVersion',
    		payload: {
                id: param.id
            }
    	})
    }

    /**
     * 删除教材
     * @param  {object} 列数据
     */
    const handleDelete = (param) => {
        dispatch({
    		type: 'teachingmanage/deleteBook',
    		payload: param.id
    	})
    }

    // 搜索
    const handleSearch = () => {
     	dispatch({ type: 'teachingmanage/getBook'})
    }

    // 添加书籍
    const handleSubmit = () => {
        let PP = {
            name: getFieldValue('name'),
            icon: getFieldValue('icon'),
            gradeId: getFieldValue('gradeId'),
            bookVersionId: getFieldValue('bookVersionId'),
            icon: getFieldValue('icon')
        }
        dispatch({
        	type: 'teachingmanage/addBook',
        	payload: filterObj(PP)
        })
    }

    // 添加年级、教材版本
    const handleAdd = (param) => {
        let _name = (param === 'Grade') ? gradeName : bookVersionName;
        if (_name.trim()) {
            dispatch({
                type: 'teachingmanage/add' + param,
                payload: _name
            })
        } else {
            let _msg = (param === 'Grade') ? '年级' : '教材版本';
            message.warning(`请输入${_msg}名称`)
        }
    }

    // 表单取消
    const handleReset  = () => {
        resetFields()
        dispatch({
    		type: 'teachingmanage/setParam',
    		payload: {
    			modalShow: false
    		}
    	})
    }

    // 选择下拉框
    const changeSelect = (v) => {
    	dispatch({
    		type: 'teachingmanage/setParam',
    		payload: v
    	})
    }
    
    // 展示modal
    const changeModalState = (flag, show) => {
        dispatch({
        	type: 'teachingmanage/setParam',
        	payload: {
                [flag]: show
            }
        })
    }

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
        	type: 'teachingmanage/setParam',
        	payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }

    // 切换tabs
    const handleTabChange = (key = 'book') => {
        if (key === 'grade') {
            dispatch({ type: 'teachingmanage/getGrade' })
        } else if (key === 'version') {
            dispatch({ type: 'teachingmanage/getVersion' })
        }
    	dispatch({
    		type: 'teachingmanage/setParam',
    		payload: {
                activeKey: key
            }
    	})
    }
    
    // 文件上传成功
    const uploadSuccess = (url) => {
        setFieldsValue({'icon': url})
    }

    // 存入输入框值
	const handleInput = (e, paramName) => {
		dispatch({
			type: 'teachingmanage/setParam',
			payload: {
				[paramName]: e.target.value
			}
		})
    }
    
    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'teachingmanage/setParam',
    		payload: param
        })
        dispatch({ type: 'teachingmanage/getBook' })
    }
   
	return (
		<div>
            <Tabs
                animated={false}
                activeKey={activeKey}
                onChange={handleTabChange}
            >
            <TabPane tab="书籍管理" key="book">
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
                        
                        {/*年级*/}
                        <FormItem label="年级">
                            <Select
                                showSearch
                                placeholder="请选择年级"
                                onFocus={() => dispatch({type: 'teachingmanage/getGrade'})}
                                onChange={v => changeSelect({gradeId: v})}
                                >
                                {
                                    [{id: '', gradeName: '全部'}, ...gradeList].map(item =>
                                        <Option key={item.id} value={item.id}>{item.gradeName}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>

                        {/*教材版本*/}
                        <FormItem label="教材版本">
                            <Select
                                showSearch
                                placeholder="请选择教材版本"
                                onFocus={() => dispatch({type: 'teachingmanage/getVersion'})}
                                onChange={v => changeSelect({bookVersionId: v})}
                                >
                                {
                                    [{id: '0', name: '全部'}, ...versionList].map(item =>
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    )
                                }
                            </Select>
                        </FormItem>

                        <FormItem>
                            <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
                        </FormItem>

                        <FormItem>
                            <Button type="primary" onClick={() => changeModalState('modalShow', true)}>添加教材</Button>
                        </FormItem>

                    </Form>
                </FormInlineLayout>

                <Modal
                    title="新增教材"
                    visible={modalShow}
                    onCancel= { () => changeModalState('modalShow',false) }
                    okText="确认"
                    cancelText="取消"
                    footer={null}
                    >
                    <Form>
                        <FormItem
                            label="教材名称"
                            {...formItemLayout}
                            >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入教材名!', whitespace: true }],
                            })(
                                <Input placeholder="请输入教材名"/>
                            )}
                        </FormItem>

                        <FormItem
                            label="教材封面图"
                            {...formItemLayout}
                            >
                            {getFieldDecorator('icon', {
                                rules: [{
                                    message: '请上传书本素材!', 
                                    whitespace: true
                                }],
                            })(
                                <MyUpload uploadSuccess={uploadSuccess}></MyUpload>
                            )}
                        </FormItem>

                        <FormItem
                            label="年级"
                            hasFeedback
                            {...formItemLayout}
                            >
                            {getFieldDecorator('gradeId', {
                                rules: [{ required: true, message: '请选择年级!' }],
                            })(
                                <Select
                                    placeholder="请选择年级"
                                    showSearch
                                    onFocus={() => dispatch({type: 'teachingmanage/getGrade'})}
                                    >
                                    {
                                        gradeList.map(item => 
                                            <Option key={item.id} value={item.id}>{item.gradeName}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>

                        <FormItem
                            label="教材版本"
                            hasFeedback
                            {...formItemLayout}
                            >
                            {getFieldDecorator('bookVersionId', {
                                rules: [{ required: true, message: '请选择教材版本!' }],
                            })(
                                <Select
                                    placeholder="请选择教材版本"
                                    showSearch
                                    onFocus={() => dispatch({type: 'teachingmanage/getVersion'})}
                                    >
                                    {
                                        versionList.map(item =>
                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}>
                            <Button type="primary" onClick={handleSubmit} style={{ marginLeft: 75 }}>提交</Button>
                            <Button onClick={handleReset} style={{ marginLeft: 15 }}>取消</Button>
                        </FormItem>
                    </Form>
                </Modal>
            </TabPane>

            <TabPane tab="年级管理" key="grade">
                <FormInlineLayout>
                    <Form layout="inline" style={{ marginLeft: 15 }}>
                        <FormItem>
                            <Input placeholder="请输入年级名称" onChange={(e) => handleInput(e, 'gradeName')}/>
                        </FormItem>
                     
                        <FormItem>
                            <Button type="primary" onClick={() => handleAdd('Grade')}>添加年级</Button>
                        </FormItem>
                    </Form>
                </FormInlineLayout>
            </TabPane>

            <TabPane tab="教材版本" key="version">
                <FormInlineLayout>
                    <Form layout="inline" style={{ marginLeft: 15 }}>
                        <FormItem>
                            <Input placeholder="请输入教材版本" onChange={(e) => handleInput(e, 'bookVersionName')}/>
                        </FormItem>
                     
                        <FormItem>
                            <Button type="primary" onClick={() => handleAdd('Version')}>添加教材版本</Button>
                        </FormItem>
                    </Form>
                </FormInlineLayout>
            </TabPane>
            </Tabs>
			

            <TableLayout
                pagination={false}
                loading={ loading.effects['teachingmanage/getBook'] || loading.effects['teachingmanage/getVersion'] }
                dataSource={columnsOpt[activeKey + 'List']}
                allColumns={columnsOpt[activeKey + 'Columns']}
                />
            {
                activeKey === 'book' &&
                <PaginationLayout
                    total={totalCount}
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
	)
};

TeachingManage.propTypes = {
    teachingmanage: PropTypes.object
};

export default connect(({ teachingmanage, loading }) => ({ teachingmanage, loading }))(Form.create()(TeachingManage));
	