import { Component } from 'react';
import { Upload, Icon, message, Button } from 'antd';
import PropTypes from 'prop-types';
// import  BASIC_URL  from '@/configs/request';

class UploadApk extends Component{
	constructor(props) {
        super(props);
        this.state={
        	fileList:this.props.value instanceof Array ? this.props.value : [],
        	length: this.props.length,
        	previewVisible:false
        }
    }
    handleChange = (info) => {
		let fileList = info.fileList
		let uploadSuc=info.fileList
		fileList = fileList.map(file => {
            if (file.response) {
                //这个地方是上传结束之后会调用的方法，这边是判断success!!!
                if (file.response.success) {
                	uploadSuc && uploadSuc(file)
                    return this.filter(file);
                }
            }
            return file;
        });
        this.setState({fileList: fileList});
        return fileList;
	}
	/**
     * 上传之前的验证
     */
    beforeUpload = (file) => {
        // const maxFileSize = this.state.maxFileSize;
        // if (maxFileSize) {
        //     const isLtMax = file.size / 1024 / 1024 < maxFileSize;
        //     if (!isLtMax) {
        //         message.error(`文件大小超过${maxFileSize}M限制`);
        //     }
        //     return isLtMax;
        // }
    };
    /**
     * 关闭预览
     */
    handleCancel = () => {
        this.setState({previewVisible: false});
    };

	render() {
		console.log(this.state.fileList)
		let fileList = this.state.fileList;
  //       if (fileList.length > 0) {
  //           fileList.map((file, i) => {
  //               if (!common.startsWith(file.url, 'http://')) {
  //                   file.url = `${this.state.imageHead}${file.url}`;
  //               }
  //           });
  //       }
		//共上传的文件
		const uploadButton = fileList.length >= this.props.length ? null : (
		    <Button>
               <Icon type="upload"/> 上传文件
            </Button>
		);

		const props = {
			action: '//api.admin.chengxuyuantoutiao.com/file/upload',
			onChange: this.handleChange,
			multiple: false,
			beforeUpload: this.beforeUpload,
		};
		return (
			<Upload {...props}>
                    {fileList.length >= this.state.length ? null : uploadButton}
            </Upload>
		);
	}
}

UploadApk.propTypes = {
  uploadSuc:PropTypes.func
}
export default UploadApk