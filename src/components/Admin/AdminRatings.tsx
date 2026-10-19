import { useEffect, useState } from "react";
import { Button, Col, Empty, Row, Space, Spin, Table, Tag, theme } from "antd";
import { TrophyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
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

export const AdminRatings = () => {
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
      title: "#",
      key: "rank",
      width: 60,
      render: (_: any, __: any, index: number) => {
        if (index === 0) {
          return <TrophyOutlined style={{ fontSize: 24, color: "#ffd700" }} />;
        }
        if (index === 1) {
          return <TrophyOutlined style={{ fontSize: 20, color: "#c0c0c0" }} />;
        }
        if (index === 2) {
          return <TrophyOutlined style={{ fontSize: 18, color: "#cd7f32" }} />;
        }
        return index + 1;
      },
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
      render: (genres: string[]) => (
        <>
          {genres.map((genre) => (
            <Tag key={genre} color="blue">
              {genre}
            </Tag>
          ))}
        </>
      ),
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
      title: "Скачиваний",
      dataIndex: "downloadCount",
      key: "downloadCount",
      sorter: (a: BookType, b: BookType) => (a.downloadCount || 0) - (b.downloadCount || 0),
      defaultSortOrder: "descend" as const,
      render: (count: number) => (
        <Tag color={count > 0 ? "green" : "default"} style={{ fontSize: 14, padding: "4px 12px" }}>
          {count || 0}
        </Tag>
      ),
    },
  ];

  const sortedBooks = [...books].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));

  if (loading) {
    return (
      <Row justify="center" style={{ padding: "var(--ant-padding-lg)" }}>
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
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/catalog")}>
              Назад
            </Button>
            <h1 style={{ margin: 0, display: "flex", alignItems: "center", gap: "var(--ant-padding-sm)" }}>
              <TrophyOutlined style={{ color: "#ffd700" }} />
              Рейтинг скачиваний
            </h1>
          </Space>
        </Col>
      </Row>

      <div
        style={{
          marginBottom: "var(--ant-padding-lg)",
          padding: "var(--ant-padding-md)",
          backgroundColor: token.colorInfoBg,
          border: `1px solid ${token.colorInfoBorder}`,
          borderRadius: token.borderRadius,
        }}
      >
        <p style={{ margin: 0, color: token.colorInfo }}>
          <strong>Информация:</strong> Рейтинг основан на количестве скачиваний каждой книги. Книги
          с наибольшим количеством скачиваний отображаются первыми.
        </p>
      </div>

      {sortedBooks.length > 0 ? (
        <Table
          dataSource={sortedBooks}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      ) : (
        <Empty description="Данные не найдены" />
      )}
    </div>
  );
};
