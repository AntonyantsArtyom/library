import { useEffect, useState } from "react";
import { Button, Col, Empty, Row, Space, Spin, Table, theme } from "antd";
import { useNavigate } from "react-router-dom";

interface BookType {
  id: number;
  title: string;
  author: string;
  genres: string[];
  cover: string;
  file: string;
  downloadCount: number;
}

export const AdminCatalog = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/books")
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.error("Ошибка загрузки книг:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Название",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Автор",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Жанры",
      dataIndex: "genres",
      key: "genres",
      render: (genres: string[]) => genres.join(", "),
    },
    {
      title: "Обложка",
      dataIndex: "cover",
      key: "cover",
      render: (cover: string) => (
        <img
          src={`http://localhost:3000/${cover}`}
          alt="Обложка"
          style={{ width: 50, height: 75, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Файл",
      dataIndex: "file",
      key: "file",
    },
    {
      title: "Скачиваний",
      dataIndex: "downloadCount",
      key: "downloadCount",
      width: 120,
      render: (count: number) => count || 0,
    },
  ];

  if (loading) {
    return (
      <Row justify="center">
        <Spin />
      </Row>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: token.screenXL,
        margin: "0 auto",
        padding: "var(--ant-padding-lg)",
      }}
    >
      <Row
        style={{
          marginBottom: "var(--ant-padding-lg)",
        }}
        justify="space-between"
        align="middle"
      >
        <Col>
          <h1 style={{ margin: 0 }}>Каталог файлов</h1>
        </Col>
        <Col>
          <Space>
            <Button onClick={() => navigate("/admin/ratings")}>Рейтинг</Button>
            <Button type="primary" onClick={() => navigate("/admin/manage")}>
              Управление файлами
            </Button>
          </Space>
        </Col>
      </Row>

      {books.length > 0 ? (
        <Table
          dataSource={books}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      ) : (
        <Empty description="Файлы не найдены" />
      )}
    </div>
  );
};
