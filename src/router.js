import PropTypes from 'prop-types'
import { Route, Switch, Redirect, routerRedux } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import App from './App';

// 动态加载component和model
const { ConnectedRouter } = routerRedux;
const Routers = ({
	history,
	app
}) => {

	const routes = [
		{
			path: '/login',
			component: () => import(/* webpackChunkName: "login" */ './pages/others/login/index'),
			models: () => [import(/* webpackChunkName: "login" */ './pages/others/login/model')]
		},
		{
			path: '/userSetting',
			component: () => import(/* webpackChunkName: "userSetting" */ './pages/user/index'),
			models: () => [import(/* webpackChunkName: "userSetting" */ './pages/user/model')]
		},
		{
			path: '/roleSetting',
			component: () => import(/* webpackChunkName: "roleSetting" */ './pages/role/index'),
			models: () => [import(/* webpackChunkName: "roleSetting" */ './pages/role/model')]
		},
		{
			path: '/authMenu',
			component: () => import(/* webpackChunkName: "authMenu" */ './pages/authmenu/index'),
			models: () => [import(/* webpackChunkName: "authMenu" */ './pages/authmenu/model')]
		},
		{
			path: '/system/logs/deleteLogs',
			component: () => import(/* webpackChunkName: "deleteLogs" */ './pages/systemManage/logManage/deleteLog/index'),
			models: () => [import(/* webpackChunkName: "deleteLogs" */ './pages/systemManage/logManage/deleteLog/model')]
		},
		{
			path: '/teachingManage/book',
			component: () => import(/* webpackChunkName: "teachingManage/book" */ './pages/teachingManage/index'),
			models: () => [import(/* webpackChunkName: "teachingManage/book" */ './pages/teachingManage/model')]
		},
		{
			path: '/teachingManage/unit',
			component: () => import(/* webpackChunkName: "teachingManage/unit" */ './pages/teachingManage/unit/index'),
			models: () => [import(/* webpackChunkName: "teachingManage/unit" */ './pages/teachingManage/unit/model')]
		},
		{
			path: '/teachingManage/part',
			component: () => import(/* webpackChunkName: "teachingManage/part" */ './pages/teachingManage/part/index'),
			models: () => [import(/* webpackChunkName: "teachingManage/part" */ './pages/teachingManage/part/model')]
		},
		{
			path: '/appverUpdate',
			component: () => import(/* webpackChunkName: "appverUpdate" */ './pages/appUpdate/index'),
			models: () => [import(/* webpackChunkName: "appverUpdate" */ './pages/appUpdate/model')]
		},
		{
			path: '/sourceMaterial',
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> dev
			component: () => import(/* webpackChunkName: "appverUpdate" */ './pages/sourceMaterial/index'),
			models: () => [import(/* webpackChunkName: "appverUpdate" */ './pages/sourceMaterial/model')]
=======
			component: () => import(/* webpackChunkName: "sourceMaterial" */ './pages/sourceMaterial/index'), 
			models: () => [import(/* webpackChunkName: "sourceMaterial" */ './pages/sourceMaterial/model')]
>>>>>>> 759c83d66778bfc8d4196741174f161dd79208f8
		}
	]

	return (
		<ConnectedRouter history={history}>
			<LocaleProvider locale={zhCN}>
				<App>
					<Switch>
						{
							routes.map(({ path, ...dynamics}, key) => (
								<Route key={key}
									path={path}
									component={dynamic({ app, ...dynamics })}
								/>
							))
						}
						<Redirect exact from='/'  to='/userSetting'/>

					</Switch>
				</App>
			</LocaleProvider>
		</ConnectedRouter>
	);
};

Routers.propTypes = {
	history: PropTypes.object,
	app: PropTypes.object,
};

export default Routers;
