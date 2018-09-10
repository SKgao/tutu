import { Component } from 'react';
import { Upload, Icon, message, Button, Modal, Progress, Spin } from 'antd';
import PropTypes from 'prop-types';
import { axios } from '@/configs/request';

/**
 * 批量上传文件组件
 * @param 传入回调接收返回url
 */
class MultipleUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            doneFiles: [], // 已上传文件
            fileList: []    // 上次文件列表
        } 
    }

    beforeUpload = (file, fileList) => {
        this.setState({ 
            modalShow: true,
            doneFiles: [],
            fileList
        }, () => {
            return new Promise((resolve, reject) => {
                this.customRequest(file, fileList)
            })
        })
    }

    customRequest = (file, fileList) => {
        const lastFile = fileList[fileList.length - 1].name
        this.setState({ doneFiles: [...this.state.doneFiles, file.name] })
        if (file) {      
            if (file.name === lastFile) {
                message.success('上传结束')
            }
            // let uploadSuccess = this.props.uploadSuccess
            // let formData = new FormData()
            // formData.append('file', file)
            // message.loading('文件上传中...', 0)
            // axios.post('file/upload', formData)
            //     .then((res) => {
            //         message.destroy()
            //         if (res.data.code === 0) {
            //             message.success('上传成功！')
            //             uploadSuccess && uploadSuccess(res.data.data)
            //         } else {
            //             message.error(res.data.message)
            //         }
            //     })
            //     .catch((err) => {
            //         message.destroy()
            //     });
        } else {
            message.error('请选择文件')
        }
    }

    shouldComponentUpdate(nextProps,nextState) {
        console.log(nextState)
        return true;
    }
    
    // 上传文件进度条
    changeModalState = (modal, show) => {
        this.setState({
            [modal]: show
        })
    }

    render() {
        const { uploadTxt } = this.props;
        const { doneFiles } = this.state;
        const antIcon = <Icon type="loading" style={{ fontSize: 18 }} spin />;
        return (
            <div>
                <Upload 
                    beforeUpload={this.beforeUpload}
                    multiple={true}
                    directory={true}>
                    <Button>
                        <Icon type="upload"/>
                        {
                        uploadTxt === 0 ? null : uploadTxt ? uploadTxt : '批量上传'
                        }
                    </Button>
                </Upload> 
               
                <Modal
                    title="文件上传进度"
                    visible={this.state.modalShow}
                    onOk={ () => this.changeModalState('modalShow', false) }
                    onCancel={ () => this.changeModalState('modalShow', false) }
                    footer={null}
                    >

                    {/* <Spin indicator={antIcon} style={{ marginRight: 5 }}/>文件上传中... */}

                    <p>{ doneFiles }</p>

                    { 
                        doneFiles.map(e => {
                            e && <p>{ e.name + '上传成功！' }</p>
                        })
                    }
                </Modal>
            </div>
        );
    }
}

MultipleUpload.propTypes = {
    uploadSuccess: PropTypes.func, // 上传成功回调
    uploadTxt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ])
};

MultipleUpload.defaultProps = {
    uploadTxt: '批量上传',
};

export default MultipleUpload;
