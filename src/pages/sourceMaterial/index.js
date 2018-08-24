<<<<<<< HEAD

=======
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import VaildForm from './VaildForm';
<<<<<<< HEAD
=======
import EditForm from './editForm';
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8

import moment from 'moment';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, Input, Button, Popconfirm, Modal, Tabs, Select, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

const sourceMaterial = ({
    sourcematerial,
    ...props
}) => {
    let { dispatch, form } = props;
    let { materialList, modalShow, modal2Show, startTime, endTime, audio, icon,text } = sourcematerial;
<<<<<<< HEAD
=======

>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
    let { getFieldDecorator, getFieldValue, resetFields,getFieldProps } = form;

    // 鼠标放在图片上的事件
    const mouseEnter=(e)=>{

    }
    const columns = [
        {
            title: '素材内容',
            dataIndex: 'text',
            sorter: true
        }, {
<<<<<<< HEAD
        	title: '素材图标',
        	dataIndex: 'icon',
=======
          title: '素材图标',
          dataIndex: 'icon',
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
          sorter: true,
          render: (text) => {
             return (text) ? <Popconfirm icon={<img src={ text } style={{ width: 110, height: 120 }}/>} cancelText="取消" okText="确定">
                    <img src={ text } style={{ width: 30, height: 40 }}/>
                </Popconfirm>: <span>无</span>
          }
        }, {
<<<<<<< HEAD
        	title: '素材音频',
        	dataIndex: 'audio',
=======
          title: '素材音频',
          dataIndex: 'audio',
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
          sorter: true,
          render: (audio) => {
             return (audio) ? <audio src={audio} controls="controls"></audio> : <span>无</span>
          }
        }, {
<<<<<<< HEAD
        	title: '操作',
=======
          title: '操作',
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
            dataIndex: 'action',
            render: (txt, record, index) => {
                return <span>
                    <Popconfirm title="是否删除?" onConfirm={() => handleDelete(record)}>
                        <Button type="danger" size="small" style={{ marginLeft: 10 }}>删除</Button>
                    </Popconfirm>
<<<<<<< HEAD
                    <Button type="primary" size="small" style={{ marginLeft: 10 }} onClick={()=>handleEdit('modal2Show', true)}>修改</Button>
=======
                    <Button type="primary" size="small" style={{ marginLeft: 10 }} onClick={()=>handleEdit(record)}>修改</Button>
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
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
<<<<<<< HEAD
      		type: 'sourcematerial/deleteSource',
      		payload: {
                id:param.id
            }
      	})
=======
          type: 'sourcematerial/deleteSource',
          payload: {
                id:param.id
            }
        })
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
    }

    // 搜索
    const handleSearch = () => {
        let PP = {
<<<<<<< HEAD
        	pageNum: 1,
        	pageSize: 10,
        	startTime: startTime,
        	endTime: endTime,
        	text: text
        }
     	dispatch({
    		type: 'sourcematerial/getSource',
    		payload: filterObj(PP)
    	})
    }
    // 添加素材
    const submitForm = (e) => {
        console.log(11111);
        console.log(e)
        if (e!="false") {
            let PP = {
<<<<<<< HEAD
=======
                audio: getFieldValue('audio'),
                icon: getFieldValue('icon'),
                text: getFieldValue('text')
=======
          pageNum: 1,
          pageSize: 10,
          startTime: startTime,
          endTime: endTime,
          text: text
        }
      dispatch({
        type: 'sourcematerial/getSource',
        payload: filterObj(PP)
      })
    }
    // 添加素材
    const submitForm = (e) => {
        if (e!="false") {
            let PP = {
>>>>>>> dev
                // audio: getFieldValue('audio'),
                // icon: getFieldValue('icon'),
                // text: getFieldValue('text')
                audio: e.audio,
                icon: e.icon,
                text: e.text
<<<<<<< HEAD
=======
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
>>>>>>> dev
            }
            dispatch({
                type: 'sourcematerial/addSource',
                payload: filterObj(PP)
            })
        }else{
            handleSubmit('modalShow',false)
        }
<<<<<<< HEAD

=======
<<<<<<< HEAD
        
>>>>>>> dev
    }
    // 显示添加素材modal
    const handleSubmit=(flag, show)=>{
      dispatch({
        type: 'sourcematerial/setParam',
        payload: {
              [flag]: show
          }
      })
=======
    }
    // 确定修改素材
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
                type: 'sourcematerial/addSource',
                payload: filterObj(PP)
            })
        }else{
            handleSubmit('modal2Show',false)
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
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
    }
    // 表单取消
    const handleReset  = () => {
        resetFields();
    }
    // 编辑素材 显示modal
<<<<<<< HEAD
    const handleEdit=(flag, show)=>{
      dispatch({
        type: 'sourcematerial/setParam',
        payload: {
              [flag]: show
          }
      })
=======
    const handleEdit=(e)=>{
        dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                modal2Show: true,
                icon:e.icon,
                audio:e.audio,
                text:e.text
            }
        })
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
    }

    // 选择时间框
    const datepickerChange = (d, t) => {
        dispatch({
<<<<<<< HEAD
        	type: 'sourcematerial/setParam',
        	payload: {
=======
          type: 'sourcematerial/setParam',
          payload: {
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }
    // 文件上传成功
    const uploadSuccess = (url) => {
        dispatch({
<<<<<<< HEAD
        	type: 'sourcematerial/setParam',
        	payload: {
        		icon: url
        	}
        })
    }

=======
          type: 'sourcematerial/setParam',
          payload: {
            icon: url
          }
        })
    }
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
    // 搜索素材内容
    const changeText = (event) => {
        dispatch({
            type: 'sourcematerial/setParam',
            payload: {
                text: event.target.value
            }
        })
    }
<<<<<<< HEAD
	return (
		<div>
=======
  return (
    <div>
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
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
<<<<<<< HEAD

=======
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
              {/*素材内容*/}
              <FormItem label="素材内容">
                    {/*{getFieldDecorator('text')(<Input placeholder="请输入素材内容" onChange={ changeText(text)}/>)} {...getFieldProps('text', {})}*/}
                    <Input placeholder="请输入素材内容" onChange={ changeText}/>
              </FormItem>

              <FormItem>
                  <Button type="primary" icon="search" onClick={handleSearch}>搜索</Button>
              </FormItem>

              <FormItem>
                  <Button type="primary" onClick={() => handleSubmit('modalShow', true)}>添加素材</Button>
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
          >
<<<<<<< HEAD
          {/*// <Form>
          //     <VaildForm submitForm={submitForm}>
          //     </VaildForm>
          // </Form>*/}
           <VaildForm submitForm={submitForm}>
           </VaildForm>
=======
<<<<<<< HEAD
          <Form>
              <VaildForm submitForm={submitForm}>
              </VaildForm>
          </Form>
=======
           <VaildForm submitForm={submitForm}>
           </VaildForm>
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
>>>>>>> dev
      </Modal>
      <TableLayout
          dataSource={materialList}
          allColumns={columns}
          />
      <PaginationLayout
          total={10}
          current={1}
          pageSize={10} />
<<<<<<< HEAD
		</div>
	)
=======
    </div>
  )
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
};

sourceMaterial.propTypes = {
    sourcematerial: PropTypes.object
};

<<<<<<< HEAD
export default connect(({ sourcematerial }) => ({ sourcematerial }))(Form.create()(sourceMaterial));
=======
<<<<<<< HEAD
export default connect(({ sourcematerial }) => ({ sourcematerial }))(Form.create()(sourceMaterial));
=======
export default connect(({ sourcematerial }) => ({ sourcematerial }))(Form.create()(sourceMaterial));
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
>>>>>>> dev
