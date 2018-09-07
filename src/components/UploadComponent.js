import { Component } from 'react';
import { Upload, Icon, message, Button } from 'antd';
import PropTypes from 'prop-types';
import { axios } from '@/configs/request';

/**
 * 上传文件组件
 * @param 传入回调接收返回url
 */
class MyUpload extends Component {
    constructor(props) {
        super(props);    
    }

    // handleUpload = (file) => {
    //     let formData = new FormData();
    //     let { uploadSuccess } = this.props
    //     if (file.event && file.event.type === 'progress') {
    //         formData.append('file', file.fileList[0].originFileObj)
    //         axios.post('file/upload', formData)
    //             .then((res) => {
    //                 if (res.data.code === 0) {
    //                     message.success('上传成功！')
    //                     uploadSuccess && uploadSuccess(res.data.data)
    //                 } else {
    //                     message.error(res.data.message)
    //                 }
    //             })
    //             .catch((err) => {

    //             });
    //     }
    // }

    beforeUpload = (file, fileList) => {
        return new Promise((resolve, reject) => {
            this.customRequest(file)
        })
    }

    customRequest = (file) => {
        if (file) {
            let uploadSuccess = this.props.uploadSuccess
            let formData = new FormData()
            formData.append('file', file)
            message.loading('文件上传中...', 0)
            axios.post('file/upload', formData)
                .then((res) => {
                    message.destroy()
                    if (res.data.code === 0) {
                        message.success('上传成功！')
                        uploadSuccess && uploadSuccess(res.data.data)
                    } else {
                        message.error(res.data.message)
                    }
                })
                .catch((err) => {
                    message.destroy()
                });
        } else {
            message.error('请选择文件')
        }
    }

    render() {
        const { uploadTxt, directory } = this.props;
        return (
            <Upload 
                beforeUpload={this.beforeUpload}  
                //onChange={this.handleUpload}
                //customRequest={this.customRequest}
                directory={directory}>
                <Button>
                    <Icon type="upload"/>
                    {
                       uploadTxt === 0 ? null : uploadTxt ? uploadTxt : '上传文件'
                    }
                </Button>
            </Upload> 
        );
    }
}

MyUpload.propTypes = {
    directory: PropTypes.bool,     // 支持上传文件夹
    uploadSuccess: PropTypes.func, // 上传成功回调
    uploadTxt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ])
};

MyUpload.defaultProps = {
    uploadTxt: '上传文件',
    directory: false
};

export default MyUpload;
