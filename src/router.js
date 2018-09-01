import PropTypes from 'prop-types'
import { Route, Switch, Redirect, routerRedux } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import App from './App';
import ErrorPage from '@/components/ErrorPage';

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
			path: '/teachingManage/book',
			component: () => import(/* webpackChunkName: "teachingManage/book" */ './pages/teachingManage/book/index'),
			models: () => [import(/* webpackChunkName: "teachingManage/book" */ './pages/teachingManage/book/model')]
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
			path: '/teachingManage/pass',
			component: () => import(/* webpackChunkName: "teachingManage/pass" */ './pages/teachingManage/pass/index'),
			models: () => [import(/* webpackChunkName: "teachingManage/pass" */ './pages/teachingManage/pass/model')]
		},
		{
			path: '/appverUpdate',
			component: () => import(/* webpackChunkName: "appverUpdate" */ './pages/appUpdate/index'),
			models: () => [import(/* webpackChunkName: "appverUpdate" */ './pages/appUpdate/model')]
		},
		{
			path: '/sourceMaterial',
			component: () => import(/* webpackChunkName: "sourceMaterial" */ './pages/sourceMaterial/index'),
			models: () => [import(/* webpackChunkName: "sourceMaterial" */ './pages/sourceMaterial/model')]
		},
		{
			path: '/units/part',
			component: () => import(/* webpackChunkName: "/units/part" */ './pages/part/index'),
			models: () => [import(/* webpackChunkName: "/units/part" */ './pages/part/model')]
		},
		{
			path: '/subject',
			component: () => import(/* webpackChunkName: "subject" */ './pages/subject/index'),
			models: () => [import(/* webpackChunkName: "subject" */ './pages/subject/model')]
		},
		{
			path: '/subjects',
			component: () => import(/* webpackChunkName: "subjects" */ './pages/subjects/index'),
			models: () => [import(/* webpackChunkName: "subjects" */ './pages/subjects/model')]
		},
		{
			path: '/member',
			component: () => import(/* webpackChunkName: "member" */ './pages/member/index'),
			models: () => [import(/* webpackChunkName: "member" */ './pages/member/model')]
		},
		{
			path: '/memberLevel',
			component: () => import(/* webpackChunkName: "memberLevel" */ './pages/memberLevel/index'),
			models: () => [import(/* webpackChunkName: "memberLevel" */ './pages/memberLevel/model')]
		},
		{
			path: '/order',
			component: () => import(/* webpackChunkName: "order" */ './pages/order/index'),
			models: () => [import(/* webpackChunkName: "order" */ './pages/order/model')]
		},
		{
			path: '/activity',
			component: () => import(/* webpackChunkName: "activity" */ './pages/activity/index'),
			models: () => [import(/* webpackChunkName: "activity" */ './pages/activity/model')]
		},
		{
			path: '/progress',
			component: () => import(/* webpackChunkName: "sourceMaterial" */ './pages/subject/progress')
		},
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
                        <Route exact path='*' component={ErrorPage} />
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
