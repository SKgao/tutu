import { Component } from 'react';
import { Card, Icon } from 'antd';

/**
 * 异常页面
 */
class ErrorPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Card title="404 Not Found...">
                    <Icon type="frown-o"/>   页面找不到了~ 
                </Card>
            </div>
        );
    }
}

export default ErrorPage;