import BreadcrumbLayout from './BreadcrumbLayout';


import { Layout, Menu, Icon, Tooltip, Avatar } from 'antd';
const { SubMenu } = Menu;
const { Header } = Layout;

const HeaderLayout = ({
	collapsed,
	handleToggle,
	handleCollapse,
	handleUser,
	breadCrumd,
	pathname
}) => {
	
	return (
		<Header className="header">
			<div className="header-left">

				<div className="header-icon header-toggle" onClick={handleToggle}>
					<Icon type="bars" />
				</div>

				<Tooltip placement="right" title={collapsed ?  '展开导航' : '收起导航'}>
					<div className="header-icon header-collapse" onClick={handleCollapse}>
						<Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
					</div>
				</Tooltip>

				<BreadcrumbLayout data={breadCrumd} path={pathname} />
			</div>


			<div className="header-right">
				
				{/* <div className="header-icon header-search">
					<Icon type={"search"} />
				</div> */}

				<div className="header-icon header-msg">
					<Icon type={"bell"} />
				</div>

				<div className="header-icon header-msg">
					<Avatar 
					    icon="user"
					    style={{ backgroundColor: '#ffbf00', verticalAlign: 'middle' }} 
					    src={ localStorage.getItem('avatar') || '//web.chengxuyuantoutiao.com/static/tutu_logo.png' }>
					</Avatar>
				</div>

				<Menu 
					mode="horizontal"
					className="header-menu header-btns"
					onSelect={handleUser}>
					<SubMenu title={<span><em>{ localStorage.getItem('account') || 'admin' }</em></span>}>
						<Menu.Item key="setting">修改配置</Menu.Item>
						<Menu.Item key="logout">退出</Menu.Item>
					</SubMenu>
				</Menu>
			</div>

		</Header>
	);
};

export default HeaderLayout;