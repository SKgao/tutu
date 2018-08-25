import { Component } from 'react';
import { Upload, Icon, message, Button,Select } from 'antd';
import PropTypes from 'prop-types';
import { axios } from '@/configs/request';

const Option = Select.Option;
let children=[];
/**
 * 上传文件组件
 */
class SelectBook extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount(){
      axios.get('/book/version/list', null)
          .then((res) => {
              if (res.data.code === 0) {
                let data=res.data.data
                  for(let i=0;i<data.length;i++){
                    children.push(<Option key={data[i].id} value={data[i].id}>{data[i].name}</Option>);
                  }
              } else {
                  message.error(res.data.message)
              }
          })
          .catch((err) => {

          });
    }

    handleChange = (value) => {
       let { selectVule } = this.props;
       selectVule && selectVule(value)
    }
    render() {

        return (
          <Select style={{ width: 120 }} onChange={this.handleChange} placeholder="请选择教材">
             {children}
           </Select>
        );
    }
}

SelectBook.propTypes = {
    selectVule: PropTypes.func
};
export default SelectBook;
