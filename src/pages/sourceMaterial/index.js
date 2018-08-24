
import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import VaildForm from './VaildForm';

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
        	title: '素材图标',
        	dataIndex: 'icon',
          sorter: true,
          render: (text) => {
             return (text) ? <Popconfirm icon={<img src={ text } style={{ width: 110, height: 120 }}/>} cancelText="取消" okText="确定">
                    <img src={ text } style={{ width: 30, height: 40 }}/>
                </Popconfirm>: <span>无</span>
          }
        }, {
        	title: '素材音频',
        	dataIndex: 'audio',
          sorter: true,
          render: (audio) => {
             return (audio) ? <audio src={audio} controls="controls"></audio> : <span>无</span>
          }
        }, {
        	title: '操作',
            dataIndex: 'action',
            render: (txt, record, index) => {
                return <span>
                    <Popconfirm title="是否删除?" onConfirm={() => handleDelete(record)}>
                        <Button type="danger" size="small" style={{ marginLeft: 10 }}>删除</Button>
                    </Popconfirm>
                    <Button type="primary" size="small" style={{ marginLeft: 10 }} onClick={()=>handleEdit('modal2Show', true)}>修改</Button>
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
    const handleReset  = () => {
        resetFields();
    }
    // 编辑素材 显示modal
    const handleEdit=(flag, show)=>{
      dispatch({
        type: 'sourcematerial/setParam',
        payload: {
              [flag]: show
          }
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
    // 文件上传成功
    const uploadSuccess = (url) => {
        dispatch({
        	type: 'sourcematerial/setParam',
        	payload: {
        		icon: url
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
          {/*// <Form>
          //     <VaildForm submitForm={submitForm}>
          //     </VaildForm>
          // </Form>*/}
           <VaildForm submitForm={submitForm}>
           </VaildForm>
      </Modal>
      <TableLayout
          dataSource={materialList}
          allColumns={columns}
          />
      <PaginationLayout
          total={10}
          current={1}
          pageSize={10} />
		</div>
	)
};

sourceMaterial.propTypes = {
    sourcematerial: PropTypes.object
};

export default connect(({ sourcematerial }) => ({ sourcematerial }))(Form.create()(sourceMaterial));
