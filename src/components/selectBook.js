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
          children:[]
        }
    }
    componentWillMount(){
      axios.get('book/version/list', null)
          .then((res) => {
              if (res.data.code === 0) {
                let data=res.data.data
<<<<<<< HEAD
                let childrenData=[];
                console.log(data);
=======
>>>>>>> a16239b73b6d98ee862ff5b330ea2db6efd060f8
                  for(let i=0;i<data.length;i++){
                    childrenData.push(<Option key={data[i].id} value={data[i].id}>{data[i].name}</Option>);
                  }
                  this.setState({
                     children:childrenData
                  })
              } else {
                  message.error(res.data.message)
              }
          })
          .catch((err) => {

          });
    }

    handleChange = (value) => {
<<<<<<< HEAD
       let {selectVule} = this.props;
       selectVule&&selectVule(value)
=======
       let { selectVule } = this.props;
       selectVule && selectVule(value)
>>>>>>> a16239b73b6d98ee862ff5b330ea2db6efd060f8
    }
    render() {

        return (
          <Select style={{ width: 120 }} onChange={this.handleChange} placeholder="请选择教材">
             {this.state.children}
           </Select>
        );
    }
}

SelectBook.propTypes = {
    selectVule: PropTypes.func
};
export default SelectBook;
