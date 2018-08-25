import PropTypes from 'prop-types';
import { connect } from 'dva';
import FormInlineLayout from '@/components/FormInlineLayout';
import TableLayout from '@/components/TableLayout';
import PaginationLayout from '@/components/PaginationLayout';
import TablePopoverLayout from '@/components/TablePopoverLayout';
import ImportUpload from './importUpload';
import ImportMeterial from './importMeterial';

import moment from 'moment';
import { filterObj } from '@/utils/tools';
import { formItemLayout } from '@/configs/layout';

import { Form, Input, Button, Popconfirm, Modal, Tabs, Select, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

const subjectIndex = ({
    subjectmodel,
    ...props
}) => {
    let { dispatch, form } = props;
    let { subjectList,customsPassId,subjectTypeId,sort,tips,subjectTypeName,sourceIds,modalShow,modal2Show } = subjectmodel;
    let { getFieldDecorator, getFieldValue, resetFields,getFieldProps } = form;
    const columns = [
        {
            title: '题型名字',
            dataIndex: 'subjectTypeName',
            sorter: true
        }, {
          title: '题目内容',
          dataIndex: 'sourceIds',
          sorter: true
        }, {
          title: '排序',
          dataIndex: 'sort',
          sorter: true
        }
    ]

    /**
     * 删除part
     * @param  {object} 列数据
     */
    const handleDelete = (param) => {
        dispatch({
          type: 'subjectmodel/deletePart',
          payload: {
                id:param.id
            }
        })
    }

    // 搜索
    const handleSearch = () => {
        let PP = {
          pageNum: 1,
          pageSize: 10
        }
      dispatch({
        type: 'subjectmodel/getSource',
        payload: filterObj(PP)
      })
    }
    // 添加part
    const importSubject = (e) => {
          let PP = {
              audio: e.audio,
              icon: e.icon,
              text: e.text
          }
          dispatch({
              type: 'subjectmodel/addSource',
              payload: filterObj(PP)
          })
    }
    // 显示添加partmodal
    const handleSubmit=()=>{
      dispatch({
        type: 'subjectmodel/setParam',
        payload: {
            modalShow:true
          }
      })
    }
    // 显示导入素材页面
    const handleSubmi=()=>{
      dispatch({
        type: 'subjectmodel/setParam',
        payload: {
            modal2Show:true
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
                type: 'subjectmodel/addSource',
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
            type: 'subjectmodel/setParam',
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
          type: 'subjectmodel/setParam',
          payload: {
                startTime: t[0] + ':00',
                endTime: t[1] + ':00'
            }
        })
    }
    // 文件上传成功
    const uploadSuccess = (url) => {
        dispatch({
          type: 'subjectmodel/setParam',
          payload: {
            icon: url
          }
        })
    }
    // 搜索part内容
    const changeText = (event) => {
        dispatch({
            type: 'subjectmodel/setParam',
            payload: {
                text: event.target.value
            }
        })
    }
  return (
    <div>
      <FormInlineLayout>
          <Form layout="inline" style={{ marginLeft: 15 }}>
              <FormItem >
                    <Button type="primary" onClick={handleSubmit}>导入题目</Button>
              </FormItem>
              <FormItem >
                    <Button type="primary" onClick={handleSubmi}>素材导入</Button>
              </FormItem>
          </Form>
      </FormInlineLayout>
      <ImportUpload modalShow={modalShow} />
      <ImportMeterial modal2Show={modal2Show}/>

      <TableLayout
          dataSource={subjectList}
          allColumns={columns}
          />
      <PaginationLayout
          total={10}
          current={1}
          pageSize={10} />
    </div>
  )
};

subjectIndex.propTypes = {
    subjectmodel: PropTypes.object
};

export default connect(({ subjectmodel }) => ({ subjectmodel }))(Form.create()(subjectIndex));
