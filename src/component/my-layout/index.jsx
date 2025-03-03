import React  from 'react' ;
import './index.scss';
import { Layout, Menu } from 'antd';
import PropTypes from 'prop-types';
import MySider from '../my-sider';
import MyHeader from '../my-header';
import {getDirection, getRole } from '../service/direction-service';
// import { getLocalData } from '../service/axios-service';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class MyLayout extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element,
    ]),
  }
  
  constructor(props) {
    super(props);
    getDirection();
    getRole();
  }

 

  render() {
    return (
      <Layout className='layout'>
        <MySider/>
        <Layout className="site-layout" >
          <MyHeader/>
          <Content   className="content-contains" >
          {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>工程训练 @2021 21组</Footer>
        </Layout>
      </Layout>
    );
  }
 
}

export default MyLayout;
