import React from 'react'
import PropTypes from 'prop-types'
import {
  Layout,
  Menu,
  Icon,
  Avatar,
  Dropdown,
  Tag,
  message,
  Spin,
  Breadcrumb,
  AutoComplete,
  Input,Button
} from 'antd'
import DocumentTitle from 'react-document-title'
import { connect } from 'dva'
import { Link, Route, Redirect, Switch } from 'dva/router'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import { ContainerQuery } from 'react-container-query'
import classNames from 'classnames'
import styles from './Hospital.app.less'
import {sessionObject} from '../../utils/utils'

import HeaderSearch from '../../components/HeaderSearch';
import NoticeIcon from '../../components/NoticeIcon';
import GlobalFooter from '../../components/GlobalFooter';


import GlobalComponents from '../../custcomponents';

import PermissionSettingService from '../../permission/PermissionSetting.service'
import appLocaleName from '../../common/Locale.tool'

const  {  filterForMenuPermission } = PermissionSettingService

const isMenuItemForDisplay = (item, targetObject, targetComponent) => {
  return true
}

const filteredMenuItems = (targetObject, targetComponent) => {
    const menuData = sessionObject('menuData')
    const isMenuItemForDisplayFunc = targetComponent.props.isMenuItemForDisplayFunc||isMenuItemForDisplay
    return menuData.subItems.filter(item=>filterForMenuPermission(item,targetObject,targetComponent)).filter(item=>isMenuItemForDisplayFunc(item,targetObject,targetComponent))
}



const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
}




class HospitalBizApp extends React.PureComponent {
  constructor(props) {
    super(props)
     this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    }
  }

  componentDidMount() {}
  componentWillUnmount() {
    clearTimeout(this.resizeTimeout)
  }
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    })
  }

  getDefaultCollapsedSubMenus = (props) => {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)]
    currentMenuSelectedKeys.splice(-1, 1)
    if (currentMenuSelectedKeys.length === 0) {
      return ['/hospital/']
    }
    return currentMenuSelectedKeys
  }
  getCurrentMenuSelectedKeys = (props) => {
    const { location: { pathname } } = props || this.props
    const keys = pathname.split('/').slice(1)
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key]
    }
    return keys
  }
  
  getNavMenuItems = (targetObject) => {
  

    const menuData = sessionObject('menuData')
    const targetApp = sessionObject('targetApp')
	const {objectId}=targetApp;
  	const userContext = null
    return (
      
		  <Menu
             theme="dark"
             mode="inline"
            
             
             onOpenChange={this.handleOpenChange}
            
             defaultOpenKeys={['firstOne']}
             style={{ margin: '16px 0', width: '100%' }}
           >
           

             <Menu.Item key="dashboard">
               <Link to={`/hospital/${this.props.hospital.id}/dashboard`}><Icon type="dashboard" /><span>{appLocaleName(userContext,"Dashboard")}</span></Link>
             </Menu.Item>
             
		 <Menu.Item key="homepage">
               <Link to={"/home"}><Icon type="home" /><span>{appLocaleName(userContext,"Home")}</span></Link>
             </Menu.Item>
             
             
         {filteredMenuItems(targetObject,this).map((item)=>(<Menu.Item key={item.name}>
          <Link to={`/${menuData.menuFor}/${objectId}/list/${item.name}/${item.displayName}${appLocaleName(userContext,"List")}`}>
          <Icon type="bars" /><span>{item.displayName}</span>
          </Link>
        </Menu.Item>))}
       
       <Menu.Item key="preference">
               <Link to={`/hospital/${this.props.hospital.id}/preference`}><Icon type="setting" /><span>{appLocaleName(userContext,"Preference")}</span></Link>
             </Menu.Item>
      
           </Menu>
    )
  }
  



  getExpenseTypeSearch = () => {
    const {ExpenseTypeSearch} = GlobalComponents;
    const userContext = null
    return connect(state => ({
      rule: state.rule,
      name: "费用类型",
      role: "expenseType",
      data: state._hospital.expenseTypeList,
      metaInfo: state._hospital.expenseTypeListMetaInfo,
      count: state._hospital.expenseTypeCount,
      currentPage: state._hospital.expenseTypeCurrentPageNumber,
      searchFormParameters: state._hospital.expenseTypeSearchFormParameters,
      searchParameters: {...state._hospital.searchParameters},
      expandForm: state._hospital.expandForm,
      loading: state._hospital.loading,
      partialList: state._hospital.partialList,
      owner: { type: '_hospital', id: state._hospital.id, 
      referenceName: 'hospital', 
      listName: 'expenseTypeList', ref:state._hospital, 
      listDisplayName: appLocaleName(userContext,"List") }, // this is for model namespace and
    }))(ExpenseTypeSearch)
  }
  getExpenseTypeCreateForm = () => {
   	const {ExpenseTypeCreateForm} = GlobalComponents;
   	const userContext = null
    return connect(state => ({
      rule: state.rule,
      role: "expenseType",
      data: state._hospital.expenseTypeList,
      metaInfo: state._hospital.expenseTypeListMetaInfo,
      count: state._hospital.expenseTypeCount,
      currentPage: state._hospital.expenseTypeCurrentPageNumber,
      searchFormParameters: state._hospital.expenseTypeSearchFormParameters,
      loading: state._hospital.loading,
      owner: { type: '_hospital', id: state._hospital.id, referenceName: 'hospital', listName: 'expenseTypeList', ref:state._hospital, listDisplayName: appLocaleName(userContext,"List")}, // this is for model namespace and
    }))(ExpenseTypeCreateForm)
  }
  
  getExpenseTypeUpdateForm = () => {
    const userContext = null
  	const {ExpenseTypeUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._hospital.selectedRows,
      role: "expenseType",
      currentUpdateIndex: state._hospital.currentUpdateIndex,
      owner: { type: '_hospital', id: state._hospital.id, listName: 'expenseTypeList', ref:state._hospital, listDisplayName: appLocaleName(userContext,"List") }, // this is for model namespace and
    }))(ExpenseTypeUpdateForm)
  }

  getExpenseItemSearch = () => {
    const {ExpenseItemSearch} = GlobalComponents;
    const userContext = null
    return connect(state => ({
      rule: state.rule,
      name: "费用项目",
      role: "expenseItem",
      data: state._hospital.expenseItemList,
      metaInfo: state._hospital.expenseItemListMetaInfo,
      count: state._hospital.expenseItemCount,
      currentPage: state._hospital.expenseItemCurrentPageNumber,
      searchFormParameters: state._hospital.expenseItemSearchFormParameters,
      searchParameters: {...state._hospital.searchParameters},
      expandForm: state._hospital.expandForm,
      loading: state._hospital.loading,
      partialList: state._hospital.partialList,
      owner: { type: '_hospital', id: state._hospital.id, 
      referenceName: 'hospital', 
      listName: 'expenseItemList', ref:state._hospital, 
      listDisplayName: appLocaleName(userContext,"List") }, // this is for model namespace and
    }))(ExpenseItemSearch)
  }
  getExpenseItemCreateForm = () => {
   	const {ExpenseItemCreateForm} = GlobalComponents;
   	const userContext = null
    return connect(state => ({
      rule: state.rule,
      role: "expenseItem",
      data: state._hospital.expenseItemList,
      metaInfo: state._hospital.expenseItemListMetaInfo,
      count: state._hospital.expenseItemCount,
      currentPage: state._hospital.expenseItemCurrentPageNumber,
      searchFormParameters: state._hospital.expenseItemSearchFormParameters,
      loading: state._hospital.loading,
      owner: { type: '_hospital', id: state._hospital.id, referenceName: 'hospital', listName: 'expenseItemList', ref:state._hospital, listDisplayName: appLocaleName(userContext,"List")}, // this is for model namespace and
    }))(ExpenseItemCreateForm)
  }
  
  getExpenseItemUpdateForm = () => {
    const userContext = null
  	const {ExpenseItemUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._hospital.selectedRows,
      role: "expenseItem",
      currentUpdateIndex: state._hospital.currentUpdateIndex,
      owner: { type: '_hospital', id: state._hospital.id, listName: 'expenseItemList', ref:state._hospital, listDisplayName: appLocaleName(userContext,"List") }, // this is for model namespace and
    }))(ExpenseItemUpdateForm)
  }

  getDoctorSearch = () => {
    const {DoctorSearch} = GlobalComponents;
    const userContext = null
    return connect(state => ({
      rule: state.rule,
      name: "医生",
      role: "doctor",
      data: state._hospital.doctorList,
      metaInfo: state._hospital.doctorListMetaInfo,
      count: state._hospital.doctorCount,
      currentPage: state._hospital.doctorCurrentPageNumber,
      searchFormParameters: state._hospital.doctorSearchFormParameters,
      searchParameters: {...state._hospital.searchParameters},
      expandForm: state._hospital.expandForm,
      loading: state._hospital.loading,
      partialList: state._hospital.partialList,
      owner: { type: '_hospital', id: state._hospital.id, 
      referenceName: 'hospital', 
      listName: 'doctorList', ref:state._hospital, 
      listDisplayName: appLocaleName(userContext,"List") }, // this is for model namespace and
    }))(DoctorSearch)
  }
  getDoctorCreateForm = () => {
   	const {DoctorCreateForm} = GlobalComponents;
   	const userContext = null
    return connect(state => ({
      rule: state.rule,
      role: "doctor",
      data: state._hospital.doctorList,
      metaInfo: state._hospital.doctorListMetaInfo,
      count: state._hospital.doctorCount,
      currentPage: state._hospital.doctorCurrentPageNumber,
      searchFormParameters: state._hospital.doctorSearchFormParameters,
      loading: state._hospital.loading,
      owner: { type: '_hospital', id: state._hospital.id, referenceName: 'hospital', listName: 'doctorList', ref:state._hospital, listDisplayName: appLocaleName(userContext,"List")}, // this is for model namespace and
    }))(DoctorCreateForm)
  }
  
  getDoctorUpdateForm = () => {
    const userContext = null
  	const {DoctorUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._hospital.selectedRows,
      role: "doctor",
      currentUpdateIndex: state._hospital.currentUpdateIndex,
      owner: { type: '_hospital', id: state._hospital.id, listName: 'doctorList', ref:state._hospital, listDisplayName: appLocaleName(userContext,"List") }, // this is for model namespace and
    }))(DoctorUpdateForm)
  }

  getDepartmentSearch = () => {
    const {DepartmentSearch} = GlobalComponents;
    const userContext = null
    return connect(state => ({
      rule: state.rule,
      name: "部门",
      role: "department",
      data: state._hospital.departmentList,
      metaInfo: state._hospital.departmentListMetaInfo,
      count: state._hospital.departmentCount,
      currentPage: state._hospital.departmentCurrentPageNumber,
      searchFormParameters: state._hospital.departmentSearchFormParameters,
      searchParameters: {...state._hospital.searchParameters},
      expandForm: state._hospital.expandForm,
      loading: state._hospital.loading,
      partialList: state._hospital.partialList,
      owner: { type: '_hospital', id: state._hospital.id, 
      referenceName: 'hospital', 
      listName: 'departmentList', ref:state._hospital, 
      listDisplayName: appLocaleName(userContext,"List") }, // this is for model namespace and
    }))(DepartmentSearch)
  }
  getDepartmentCreateForm = () => {
   	const {DepartmentCreateForm} = GlobalComponents;
   	const userContext = null
    return connect(state => ({
      rule: state.rule,
      role: "department",
      data: state._hospital.departmentList,
      metaInfo: state._hospital.departmentListMetaInfo,
      count: state._hospital.departmentCount,
      currentPage: state._hospital.departmentCurrentPageNumber,
      searchFormParameters: state._hospital.departmentSearchFormParameters,
      loading: state._hospital.loading,
      owner: { type: '_hospital', id: state._hospital.id, referenceName: 'hospital', listName: 'departmentList', ref:state._hospital, listDisplayName: appLocaleName(userContext,"List")}, // this is for model namespace and
    }))(DepartmentCreateForm)
  }
  
  getDepartmentUpdateForm = () => {
    const userContext = null
  	const {DepartmentUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._hospital.selectedRows,
      role: "department",
      currentUpdateIndex: state._hospital.currentUpdateIndex,
      owner: { type: '_hospital', id: state._hospital.id, listName: 'departmentList', ref:state._hospital, listDisplayName: appLocaleName(userContext,"List") }, // this is for model namespace and
    }))(DepartmentUpdateForm)
  }


  
  buildRouters = () =>{
  	const {HospitalDashboard} = GlobalComponents
  	const {HospitalPreference} = GlobalComponents
  	
  	
  	const routers=[
  	{path:"/hospital/:id/dashboard", component: HospitalDashboard},
  	{path:"/hospital/:id/preference", component: HospitalPreference},
  	
  	
  	
  	{path:"/hospital/:id/list/expenseTypeList", component: this.getExpenseTypeSearch()},
  	{path:"/hospital/:id/list/expenseTypeCreateForm", component: this.getExpenseTypeCreateForm()},
  	{path:"/hospital/:id/list/expenseTypeUpdateForm", component: this.getExpenseTypeUpdateForm()},
   	
  	{path:"/hospital/:id/list/expenseItemList", component: this.getExpenseItemSearch()},
  	{path:"/hospital/:id/list/expenseItemCreateForm", component: this.getExpenseItemCreateForm()},
  	{path:"/hospital/:id/list/expenseItemUpdateForm", component: this.getExpenseItemUpdateForm()},
   	
  	{path:"/hospital/:id/list/doctorList", component: this.getDoctorSearch()},
  	{path:"/hospital/:id/list/doctorCreateForm", component: this.getDoctorCreateForm()},
  	{path:"/hospital/:id/list/doctorUpdateForm", component: this.getDoctorUpdateForm()},
   	
  	{path:"/hospital/:id/list/departmentList", component: this.getDepartmentSearch()},
  	{path:"/hospital/:id/list/departmentCreateForm", component: this.getDepartmentCreateForm()},
  	{path:"/hospital/:id/list/departmentUpdateForm", component: this.getDepartmentUpdateForm()},
     	
  	
  	]
  	
  	const {extraRoutesFunc} = this.props;
	const extraRoutes = extraRoutesFunc?extraRoutesFunc():[]
    const finalRoutes = routers.concat(extraRoutes)
    
  	return (<Switch>
             {finalRoutes.map((item)=>(<Route key={item.path} path={item.path} component={item.component} />))}    
  	  	</Switch>)
  	
  
  }
 

  getPageTitle = () => {
    // const { location } = this.props
    // const { pathname } = location
    const title = '医生排班系统'
    return title
  }
 
  handleOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    this.setState({
      openKeys: latestOpenKey ? [latestOpenKey] : [],
    })
  }
   toggle = () => {
     const { collapsed } = this.props
     this.props.dispatch({
       type: 'global/changeLayoutCollapsed',
       payload: !collapsed,
     })
   }
    logout = () => {
   
    console.log("log out called")
    this.props.dispatch({ type: 'launcher/signOut' })
  }
   render() {
     // const { collapsed, fetchingNotices,loading } = this.props
     const { collapsed } = this.props
     const { breadcrumb }  = this.props
  
     const targetApp = sessionObject('targetApp')
     const currentBreadcrumb =sessionObject(targetApp.id)
     const userContext = null
     
     const menuProps = collapsed ? {} : {
       openKeys: this.state.openKeys,
     }
     const layout = (
     <Layout>
        <Header>
          
          <div className={styles.left}>
          <img
            src="./favicon.png"
            alt="logo"
            onClick={this.toggle}
            className={styles.logo}
          />
          {currentBreadcrumb.map((item)=>{
            return (<Link  key={item.link} to={`${item.link}`} className={styles.breadcrumbLink}> &gt;{item.name}</Link>)

          })}
         </div>
          <div className={styles.right}  >
          <Button type="primary"  icon="logout" onClick={()=>this.logout()}>
          {appLocaleName(userContext,"Exit")}</Button>
          </div>
          
        </Header>
       <Layout>
         <Sider
           trigger={null}
           collapsible
           collapsed={collapsed}
           breakpoint="md"
           onCollapse={()=>this.onCollapse(collapsed)}
           collapsedWidth={56}
           className={styles.sider}
         >

		 {this.getNavMenuItems(this.props.hospital)}
		 
         </Sider>
         <Layout>
           <Content style={{ margin: '24px 24px 0', height: '100%' }}>
           
           {this.buildRouters()}
 
             
             
           </Content>
          </Layout>
        </Layout>
      </Layout>
     )
     return (
       <DocumentTitle title={this.getPageTitle()}>
         <ContainerQuery query={query}>
           {params => <div className={classNames(params)}>{layout}</div>}
         </ContainerQuery>
       </DocumentTitle>
     )
   }
}

export default connect(state => ({
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  hospital: state._hospital,
  ...state,
}))(HospitalBizApp)



