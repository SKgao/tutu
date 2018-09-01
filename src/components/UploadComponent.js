import { Component } from 'react';
import { Upload, Icon, message, Button } from 'antd';
import PropTypes from 'prop-types';
import { axios } from '@/configs/request';

/**
 * 上传文件组件
 */
class MyUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
			file: ''
		}
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
        this.setState({ file })
    }

    customRequest = () => {
        let { file } = this.state
        if (file) {
            let uploadSuccess = this.props.uploadSuccess
            let formData = new FormData()
            formData.append('file', file)
            axios.post('file/upload', formData)
                .then((res) => {
                    if (res.data.code === 0) {
                        message.success('上传成功！')
                        uploadSuccess && uploadSuccess(res.data.data)
                    } else {
                        message.error(res.data.message)
                    }
                })
                .catch((err) => {

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
                customRequest={this.customRequest}
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
