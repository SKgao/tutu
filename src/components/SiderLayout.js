import { Layout, Dropdown, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const { Sider } = Layout;

const SiderLayout = ({
	collapsed,
	firPath,
	secPath,
	sideMenus,
	handleSiderMenu,
	menuSelect,
	firstMenuText
}) => {

	const renderMenu = (item, showIcon) => {
		if(item.children && item.children.length) {
			let ico = (item.icon && item.icon !== 'tongji') ? item.icon: 'bars'
			let arr = item.children.map(e => e.level)
			let path = (item.modelpage) ? item.modelpage : item.path
			return ((arr && arr[0] < 2) || !arr[0])
				? (
					<SubMenu 
						key={item.id}
						title={
							<span>
								<Icon type={ico} />
								<span>{item.name}</span>
							</span>
						}>
						{
							item.children.map(sub => renderMenu(sub, false))
						}
					</SubMenu>
				)
				: (
				    <Menu.Item key={path} title={item.name}>
						{ico && <Icon type={ico} />}
						<span>{item.name}</span>
					</Menu.Item>
				)
		} else {
			let _ico = (item.icon && item.icon !== 'tongji') ? item.icon : ''
			let _path = item.path
			return (item.level && item.level == 2) ? null : (
				   <Menu.Item key={_path} title={item.name}>
						{_ico && <Icon type={_ico} />}
						<span>{item.name}</span>
					</Menu.Item>
			)
		}
	}

	return (
		<Sider 
			className={"main-sider"}
			trigger={null}
			width={240}
			collapsible
			collapsed={collapsed}>
			<div className="sider-top">
				<div className="header-logo">
					<span>图图英语</span>
				</div>
			</div>
			<div className="sider-scroller scrollbar">
				<Menu
					mode="inline"
					theme="dark"
					defaultOpenKeys={firPath}
					defaultSelectedKeys={secPath}
					onClick={handleSiderMenu}>
					{
						sideMenus.map(item => renderMenu(item, true))
					}
				</Menu>
			</div>
		</Sider>
	);
};


export default SiderLayout;