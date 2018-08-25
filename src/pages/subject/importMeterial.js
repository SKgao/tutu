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
class ImportMeterial extends Component {
    constructor(props) {
        super(props),
        this.state ={
          fileList: [],
          uploading: false,
          modal2Show:this.props.modal2Show,
          textbookId:'',
          p:[],
          audioArray:[],
          imageArray:[]
        }
    }
    componentWillReceiveProps(props){
      this.setState({modal2Show:this.props.modal2Show})
    }
    handleUpload = () => {
      let data={
        audioArray:this.state.audioArray,
        imageArray:this.state.imageArray
      }
        axios.post('/subject/source/import', data)
            .then((res) => {
                if (res.data.code === 0) {
                  let _this=this
                    let timer=setInterval(function(){
                      axios.get('/subject/subject/import/progress',null)
                      .then((reset)=>{
                        if (reset.data.code==0) {
                          _this.setState({
                            p:reset.data.data
                          })
                          console.log(_this.state.p)
                          if (_this.state.p.indexOf("结束")!=-1) {
                            clearInterval(timer)
                            _this.setState({
                              modal2Show:false
                            })
                          }
                        }
                      })
                    },2000)

                    // uploadSuccess && uploadSuccess(res.data.data)
                } else {
                    message.error(res.data.message)
                }
            })
            .catch((err) => {

            });
    }
    // 表单取消
    handleReset  = () => {
        // resetFields();
        this.setState({
          modal2Show:false
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
        // let {modal2Show}=this.props
        // this.setState({
        //   modal2Show:this.props
        // });
        let audioArray=[]
        let imageArray=[]
        const propsAudio = {
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
            audioArray.push(file.name)
            this.setState({
              fileName:audioArray
            })
            return false;
          },
          fileList: this.state.fileList,
          multiple:true
        };
        const propsImg = {
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
            imageArray.push(file.name)
            this.setState({
              fileName:imageArray
            })
            return false;
          },
          fileList: this.state.fileList,
          multiple:true
        };
        return (
          <Modal
                title="导入题目"
                visible={this.state.modal2Show}
                onCancel= {this.handleReset}
                okText="确认"
                cancelText="取消"
                footer={null}
                maskClosable={false}
            >
            <FormItem
              {...formItemLayout}
              label="选择音频素材">
              <Upload {...propsAudio}>
                  <Button>
                      <Icon type="upload"/>
                      {
                         uploadTxt === 0 ? null : uploadTxt ? uploadTxt : '上传音频'
                      }
                  </Button>
              </Upload>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择图片">
              <Upload {...propsImg}>
                  <Button>
                      <Icon type="upload"/>
                      {
                         uploadTxt === 0 ? null : uploadTxt ? uploadTxt : '上传图片'
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

ImportMeterial.propTypes = {
    uploadSuccess: PropTypes.func, // 上传成功回调
    uploadTxt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ])
};
export default ImportMeterial;
