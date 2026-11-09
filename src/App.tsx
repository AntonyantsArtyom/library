import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { Layout, Menu, Typography, Button } from "antd";
import { BookOutlined, AppstoreOutlined, SettingOutlined, TrophyOutlined, FileTextOutlined, LogoutOutlined } from "@ant-design/icons";

import { BookList } from "./components/BookList/BookList";
import { Filter } from "./components/Filter/Filter";
import { AdminCatalog, AdminManage, AdminRatings, AdminLogs, ProtectedRoute } from "./components/Admin";
import { AUTH_EVENT, getAdminPassword, setAdminSession } from "./api";

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
  const [isAdmin, setIsAdmin] = useState(() => Boolean(getAdminPassword()));

  useEffect(() => {
    const handleAuthChange = () => setIsAdmin(Boolean(getAdminPassword()));
    window.addEventListener(AUTH_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_EVENT, handleAuthChange);
  }, []);

  const handleLogout = () => {
    setAdminSession(null);
    navigate("/");
  };

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
    {
      key: "/admin/logs",
      icon: <FileTextOutlined />,
      label: "Журнал",
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

        {isAdmin && (
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: "white", marginLeft: 16 }}
          >
            Выйти
          </Button>
        )}
      </Header>

      <Content
        style={{
          padding: "24px",
        }}
      >
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/catalog" element={<AdminCatalog />} />
            <Route path="/admin/manage" element={<AdminManage />} />
            <Route path="/admin/ratings" element={<AdminRatings />} />
            <Route path="/admin/logs" element={<AdminLogs />} />
          </Route>
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
