import { Component } from 'react';
import { Upload, Icon, message, Button,Form,Modal } from 'antd';
import PropTypes from 'prop-types';
import { formItemLayout } from '@/configs/layout';
import { axios } from '@/configs/request';
import SelectBook from '@/components/selectBook';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;

// let { getFieldDecorator, getFieldValue, resetFields,getFieldProps } = form;
/**
 * 上传文件组件
 */
class ImportUpload extends Component {
    constructor(props) {
        super(props);
        this.state ={
          fileList: [],
          uploading: false,
          modalShow:this.props.modalShow,
          textbookId:'',
          p:[],
          fileName:[]
        }
    }
    componentWillReceiveProps(props){
      this.setState({modalShow:this.props.modalShow})
    }
    handleUpload = () => {
        let formData = new FormData();
        const { fileList } = this.state;
        let { uploadSuccess } = this.props
        let _this=this;
        formData.append('file',fileList[0])
        formData.append('textbookId', this.state.textbookId)
        axios.post('/subject/subject/import', formData)
            .then((res) => {
                if (res.data.code === 0) {
                  this.linktoPart()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch((err) => {

            });
    }
    linktoPart = (record) => {
        routerRedux.push({
            pathname: '/progress'
        });
    }
    // 表单取消
    handleReset  = () => {
        // resetFields();
        this.setState({
          modalShow:false
        });
        this.setState(({ fileList }) => ({
          fileList: []
        }));
    }
    selectBookVule = (e)=>{
      console.log(e)
      this.setState({
        textbookId:e
      });
    }
    render() {
        const { uploadTxt } = this.props;
        // let {modalShow}=this.props
        // this.setState({
        //   modalShow:this.props
        // });
        let audioArray=[]
        const props = {
          onRemove: (file) => {
            this.setState(({ fileList }) => {
              const index = fileList.indexOf(file);
              const newFileList = fileList.slice();
              newFileList.splice(index, 1);
              return {
                fileList: newFileList,
              };
            });
          },
          beforeUpload: (file) => {
            this.setState(({ fileList }) => ({
              fileList: [...fileList, file],
            }));
            return false;
          },
          fileList: this.state.fileList,
          multiple:true
        };
        return (
          <Modal
                title="导入题目"
                visible={this.state.modalShow}
                onCancel= {this.handleReset}
                okText="确认"
                cancelText="取消"
                footer={null}
                maskClosable={false}
            >
            <FormItem
              {...formItemLayout}
              label="选择教材">
              <SelectBook selectVule={this.selectBookVule}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择导入文件">
              <Upload {...props}>
                  <Button>
                      <Icon type="upload"/>
                      {
                         uploadTxt === 0 ? null : uploadTxt ? uploadTxt : '上传文件'
                      }
                  </Button>
              </Upload>
            </FormItem>
            <FormItem>
              {this.state.p}
            </FormItem>
              <FormItem>
                  <Button type="primary" onClick={this.handleUpload} style={{ marginLeft: 75 }}>导入</Button>
                  <Button onClick={this.handleReset} style={{ marginLeft: 15 }}>取消</Button>
              </FormItem>
          </Modal>
        );
    }
}

ImportUpload.propTypes = {
    uploadSuccess: PropTypes.func, // 上传成功回调
    uploadTxt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ])
};
export default ImportUpload;
