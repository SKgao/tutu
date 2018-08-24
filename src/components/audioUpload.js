import { Component } from 'react';
import { Upload, Icon, message, Button } from 'antd';
import PropTypes from 'prop-types';
import { axios } from '@/configs/request';

/**
 * 上传文件组件
 */
class AudioUpload extends Component {
    constructor(props) {
        super(props);
    }
    
    handleUpload = (file) => {
        let formData = new FormData();
        let { AudioUploadSuccess } = this.props
        formData.append('file', file.fileList[0].originFileObj)
        axios.post('file/upload', formData)
            .then(function (res) {
                if (res.data.code === 0) {
                    message.success('上传成功！')
                    AudioUploadSuccess && AudioUploadSuccess(res.data.data)
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(function (err) {
                console.log('上传失败！')
            });
    }

    render() {
        return (
            <Upload onChange={this.handleUpload}>
                <Button>
                   <Icon type="upload"/> 上传文件
                </Button>
            </Upload>
        );
    }
}

AudioUpload.propTypes = {
	AudioUploadSuccess: PropTypes.func // 过滤列回调
};


export default AudioUpload;