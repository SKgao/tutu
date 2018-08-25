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
    }

    handleUpload = (file) => {
        let formData = new FormData();
        let { uploadSuccess } = this.props
        if (file.event && file.event.type === 'progress') {
            formData.append('file', file.fileList[0].originFileObj)
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
        }
    }

    render() {
        const { uploadTxt } = this.props;
        return (
            <Upload onChange={this.handleUpload}>
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
    uploadSuccess: PropTypes.func, // 上传成功回调
    uploadTxt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ])
};

MyUpload.defaultProps = {
    uploadTxt: '上传文件'
};

export default MyUpload;
