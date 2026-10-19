import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { Layout, Menu, Typography } from "antd";
import { BookOutlined, AppstoreOutlined, SettingOutlined, TrophyOutlined } from "@ant-design/icons";

import { BookList } from "./components/BookList/BookList";
import { Filter } from "./components/Filter/Filter";
import { AdminCatalog } from "./components/Admin/AdminCatalog";
import { AdminManage } from "./components/Admin/AdminManage";
import { AdminRatings } from "./components/Admin/AdminRatings";

import "./index.css";

const { Header, Content } = Layout;

function MainApp() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genres, setGenres] = useState<string[]>([]);

  return (
    <>
      <Filter title={title} author={author} genres={genres} onTitleChange={setTitle} onAuthorChange={setAuthor} onGenresChange={setGenres} />

      <BookList title={title} author={author} genres={genres} />
    </>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      icon: <BookOutlined />,
      label: "Библиотека",
    },
    {
      key: "/admin/catalog",
      icon: <AppstoreOutlined />,
      label: "Каталог",
    },
    {
      key: "/admin/manage",
      icon: <SettingOutlined />,
      label: "Управление",
    },
    {
      key: "/admin/ratings",
      icon: <TrophyOutlined />,
      label: "Рейтинг",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
        }}
      >
        <Typography.Title
          level={4}
          style={{
            color: "white",
            margin: 0,
            marginRight: 40,
            whiteSpace: "nowrap",
          }}
        >
          EPUB Library
        </Typography.Title>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>

      <Content
        style={{
          padding: "24px",
        }}
      >
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/admin/catalog" element={<AdminCatalog />} />
          <Route path="/admin/manage" element={<AdminManage />} />
          <Route path="/admin/ratings" element={<AdminRatings />} />
        </Routes>
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
