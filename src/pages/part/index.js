import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import AddForm from './addForm';
import EditForm from './editForm';

import moment from 'moment';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, Input, Button, Popconfirm, Modal, Tabs, Select, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

const partIndex = ({
    partmodel,
    ...props
}) => {
    let { dispatch, form } = props;
    let { partList, modalAddShow, modalEditShow, startTime, endTime, icon,title,tips,unitsId } = partmodel;
    let { getFieldDecorator, getFieldValue, resetFields,getFieldProps } = form;
    const columns = [
        {
            title: '单元',
            dataIndex: 'unitsId',
            sorter: true
        }, {
          title: 'part图片',
          dataIndex: 'icon',
          sorter: true,
          render: (text) => {
             return (text) ? <Popconfirm icon={<img src={ text } style={{ width: 110, height: 120 }}/>} cancelText="取消" okText="确定">
                    <img src={ text } style={{ width: 30, height: 40 }}/>
                </Popconfirm>: <span>无</span>
          }
        }, {
          title: 'part名称',
          dataIndex: 'title',
          sorter: true,
          render: (text, record) =>
            <TablePopoverLayout
    					title={'修改part名称'}
    					valueData={text || '无'}
    					defaultValue={text || '无'}
    					onOk={v =>
    						dispatch({
    							type: 'partmodel/editPart',
    							payload: {
    								id: record.id,
    								title: v
    							}
    						})
    					}/>
        }, {
          title: 'part描述',
          dataIndex: 'tips',
          sorter: true,
          render: (text,record) =>
            <TablePopoverLayout
    					title={'修改part描述'}
    					valueData={text || '无'}
    					defaultValue={text || '无'}
    					onOk={v =>
    						dispatch({
    							type: 'partmodel/editPart',
    							payload: {
    								id: record.id,
    								tips: v
    							}
    						})
    					}/>
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
     * 删除part
     * @param  {object} 列数据
     */
    const handleDelete = (param) => {
        dispatch({
          type: 'partmodel/deletePart',
          payload: {
                id:param.id
            }
        })
    }

    // 搜索
    const handleSearch = () => {
        let PP = {
          pageNum: 1,
          pageSize: 10,
          startTime: startTime,
          endTime: endTime
        }
      dispatch({
        type: 'partmodel/getSource',
        payload: filterObj(PP)
      })
    }
    // 添加part
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
                type: 'partmodel/addSource',
                payload: filterObj(PP)
            })
        }else{
            handleSubmit('modalAddShow',false)
        }
    }
    // 显示添加partmodal
    const handleSubmit=(flag, show)=>{
      dispatch({
        type: 'partmodel/setParam',
        payload: {
              [flag]: show
          }
      })
    }
    // 确定修改part
    const submitEditForm = (e) => {
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
                type: 'partmodel/addSource',
                payload: filterObj(PP)
            })
        }else{
            handleSubmit('modalEditShow',false)
        }
    }
    // 表单取消
    const handleReset  = () => {
        resetFields();
    }
    // 编辑part 显示modal
    const handleEdit=(e)=>{
        dispatch({
            type: 'partmodel/setParam',
            payload: {
                modalEditShow: true,
                icon:e.icon,
                title:e.title,
                tips:e.tips
            }
        })
    }

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
          type: 'partmodel/setParam',
          payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }
    // 文件上传成功
    const uploadSuccess = (url) => {
        dispatch({
          type: 'partmodel/setParam',
          payload: {
            icon: url
          }
        })
    }
    // 搜索part内容
    const changeText = (event) => {
        dispatch({
            type: 'partmodel/setParam',
            payload: {
                text: event.target.value
            }
        })
    }
  return (
    <div>
      <FormInlineLayout>
          <Form layout="inline" style={{ marginLeft: 15 }}>
              {/*时间*/}
              {/*}<FormItem label="时间">
                  <RangePicker
                      format="YYYY-MM-DD HH:mm"
                      showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                      }}
                      format="YYYY-MM-DD HH:mm"
                      onChange={datepickerChange}
                      />
              </FormItem>*/}
              {/*part内容
              <FormItem label="part内容">
                    <Input placeholder="请输入part内容" onChange={ changeText}/>
              </FormItem>

              <FormItem>
                  <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
              </FormItem>*/}

              <FormItem>
                  <Button type="primary" onClick={() => handleSubmit('modalAddShow', true)}>添加part</Button>
              </FormItem>

          </Form>
      </FormInlineLayout>

      <Modal
            title="新增part"
            visible={modalAddShow}
            onCancel= { () => handleSubmit('modalAddShow',false) }
            okText="确认"
            cancelText="取消"
            footer={null}
            maskClosable={false}
        >
            <AddForm>
            </AddForm>
        </Modal>
        <Modal
            title="修改part"
            visible={modalEditShow}
            onCancel= { () => handleSubmit('modalEditShow',false) }
            okText="确认"
            cancelText="取消"
            footer={null}
            maskClosable={false}
        >
            <EditForm></EditForm>
        </Modal>


      <TableLayout
          dataSource={partList}
          allColumns={columns}
          />
      <PaginationLayout
          total={10}
          current={1}
          pageSize={10} />
    </div>
  )
};

partIndex.propTypes = {
    partmodel: PropTypes.object
};

export default connect(({ partmodel }) => ({ partmodel }))(Form.create()(partIndex));
