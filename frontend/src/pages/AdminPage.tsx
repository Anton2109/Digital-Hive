import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { AppstoreOutlined, TagOutlined } from '@ant-design/icons';
import AdminGames from '@/components/admin/AdminGames';
import AdminDiscounts from '@/components/admin/AdminDiscounts';
import styles from './AdminPage.module.css';

const { Header, Content, Sider } = Layout;

const AdminPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('games');

  const renderContent = () => {
    switch (selectedKey) {
      case 'games':
        return <AdminGames />;
      case 'discounts':
        return <AdminDiscounts />;
      default:
        return <AdminGames />;
    }
  };

  return (
    <Layout className={styles.adminLayout}>
      <Header className={styles.header}>
        <div className={styles.headerTitle}>
          Админ-панель
        </div>
      </Header>
      <Layout>
        <Sider width={200} className={styles.sider}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            className={styles.menu}
            theme="dark"
            onSelect={({ key }) => setSelectedKey(key)}
          >
            <Menu.Item key="games" icon={<AppstoreOutlined />}>
              Игры
            </Menu.Item>
            {/* <Menu.Item key="discounts" icon={<TagOutlined />}>
              Скидки
            </Menu.Item> */}
          </Menu>
        </Sider>
        <Layout className={styles.contentLayout}>
          <Content className={styles.content}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPage; 