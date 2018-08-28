import { Component } from 'react';
import { Upload, Icon, message, Button,Select } from 'antd';
import PropTypes from 'prop-types';
import { axios } from '@/configs/request';

const Option = Select.Option;
/**
 * 上传文件组件
 */
class SelectBook extends Component {
    constructor(props) {
        super(props);
        this.state={
          p:''
        }
    }
    componentWillMount(){
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
                  modalShow:false
                })
              }
            }
          })
        },2000)
    }
    render() {

        return (
          <div  dangerouslySetInnerHTML={{__html: this.state.p}}>
          </div>
        );
    }
}

SelectBook.propTypes = {
    selectVule: PropTypes.func
};
export default SelectBook;
