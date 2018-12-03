import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import MyUpload from '@/components/UploadComponent';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, Button, Badge, Icon, Modal, Input, Popconfirm } from 'antd';
const FormItem = Form.Item;

const CourseList = ({
    courseList,
    loading,
    ...props
}) => {
    let { dispatch, form } = props;
    let { tableList, pageNum, pageSize, totalCount, modalShow } = courseList;
    let { getFieldDecorator, resetFields, validateFieldsAndScroll } = form;

    const columns = [
        {
            title: '课程名称',
            dataIndex: 'name'
        }, {
            title: '精品课程版本',
            dataIndex: 'bookVersionId'
        }, {
            title: '年级',
            dataIndex: 'gradeId'
        }, {
            title: '课程类型',
            dataIndex: 'type'
        }, {
            title: '封面',
            dataIndex: 'icon',
            render: (text) => {
                return (text) ? <a href={ text } target='_blank'><img src={ text } style={{ width: 50, height: 35 }}/></a> : <span>无</span>
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            render: (txt) => {
				switch (txt) {
					case 1:
						return <Badge status="processing" text="启用"/>;
					default:
                        return <Badge status="warning" text="禁用"/>;
				}
			}
        }, {
            title: '创建时间',
            dataIndex: 'createdAt'
        },
        {
        	title: '操作',
            dataIndex: 'action',
            render: (txt, row, index) => {
                return <span>
                    <Button
                        type={row.status === 1 ? 'danger' : 'primary'}
                        size="small" style={{ marginLeft: 5 }}
                        onClick={() => handleChangeStatus(row)}>
                        {row.status === 1 ? '禁用' : '启用'}
                    </Button>
                    <Popconfirm title="是否删除?" onConfirm={() => handleDelete(row)}>
                        <Button type="danger" size="small" style={{ marginLeft: 5 }}>删除</Button>
                    </Popconfirm>
                    <Button type="primary" size="small" onClick={() => linktoActivity(row)} style={{ marginLeft: 10 }}>查看活动</Button>
                </span>
            }
        }
    ]

    // 调转到课程页面
    const linktoActivity = (record) => {
        dispatch(routerRedux.push({
            pathname: '/courseBag/activity',
            search: `id=${record.id}`
        }));
    }

    // 改变状态
    const handleChangeStatus = (row) => {
        dispatch({
            type: 'courseList/changeStatus',
            payload: {
                id: row.id - 0,
                status: row.status === 1 ? 2 : 1
            }
        })
    }

    // 删除
    const handleDelete = (row) => {
        dispatch({
            type: 'courseList/delCourse',
            payload: {
                id: row.id - 0
            }
        })
    }

    // 操作分页
    const handleChange = (param) => {
        dispatch({
    		type: 'courseList/setParam',
    		payload: param
        })
        dispatch({ type: 'courseList/getBagList' })
    }

    // 展示modal
    const changeModalState = (flag, show) => {
        dispatch({
        	type: 'courseList/setParam',
        	payload: {
                [flag]: show
            }
        })
    }

    // 返回
    const goBack = () => dispatch(routerRedux.goBack(-1))

    // 添加课程包
	const handleSubmit = (e) => {
		e.preventDefault()
		validateFieldsAndScroll((err, values) => {
			if (!err) {
                const { id, icon } = courseList
                values.bagId = id - 0
                values.icon = icon
                delete values.title
                dispatch({
                    type: 'courseList/addCourse',
                    payload: filterObj(values)
                }).then(() => {
                    handleReset()
                })
			}
		});
    }

    // 表单取消
    const handleReset  = () => {
        resetFields()
        dispatch({
    		type: 'courseList/setParam',
    		payload: {
                modalShow: false
    		}
    	})
    }

    // 文件上传成功
    const uploadSuccess = (url, filed) => {
        dispatch({
    		type: 'courseList/setParam',
    		payload: {
    			[filed]: url
    		}
        })
    }

	return (
		<div>
			<FormInlineLayout>
			    <Form layout="inline" style={{ marginLeft: 15 }}>

                    <FormItem>
                        <Button type="primary" onClick={() => changeModalState('modalShow', true)}>添加课程</Button>
                    </FormItem>

                    <FormItem>
                        <a className={'link-back'} onClick={goBack}><Icon type="arrow-left"/>后退</a>
                    </FormItem>

                </Form>
            </FormInlineLayout>

            <Modal
                title="新增课程"
                visible={modalShow}
                onCancel= { () => changeModalState('modalShow', false) }
                okText="确认"
                cancelText="取消"
                footer={null}
                >
                <Form>
                    <FormItem
                        label="课程包名称"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('title', {
                            initialValue: courseList.title,
                            rules: [{ required: true, message: '请输入课程包id!' }],
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>

                    <FormItem
                        label="课程名称"
                        {...formItemLayout}
                        >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入课程包名称!' }],
                        })(
                            <Input placeholder="请输入课程包名称"/>
                        )}
                    </FormItem>

                    <FormItem
                        label="图标"
                        {...formItemLayout}
                        >
                        <MyUpload uploadSuccess={url => uploadSuccess(url, 'icon')}></MyUpload>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}>
                        <Button type="primary" onClick={handleSubmit} style={{ marginLeft: 75 }}>提交</Button>
                        <Button onClick={handleReset} style={{ marginLeft: 15 }}>取消</Button>
                    </FormItem>
                </Form>
            </Modal>

            <TableLayout
                pagination={false}
                dataSource={tableList}
                allColumns={columns}
                loading={ loading.effects['courseList/getCourseList'] }
                scrollX={true}
                />
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
		</div>
	)
};

CourseList.propTypes = {
    courseList: PropTypes.object
};

export default connect(({ courseList, loading }) => ({ courseList, loading }))(Form.create()(CourseList));
