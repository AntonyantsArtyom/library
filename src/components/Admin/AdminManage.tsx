import { useEffect, useState } from "react";
import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Table, theme, Upload } from "antd";
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { UploadFile } from "antd";

interface BookType {
  id: number;
  title: string;
  author: string;
  genres: string[];
  cover: string;
  file: string;
  downloadCount: number;
}

export const AdminManage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);

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

  const handleAdd = async (values: any) => {
    if (!coverFile || !bookFile) {
      message.error("Пожалуйста, загрузите обложку и файл книги");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("author", values.author);
    formData.append("genres", JSON.stringify(values.genres));
    formData.append("cover", coverFile);
    formData.append("file", bookFile);

    try {
      const response = await fetch("http://localhost:3000/api/books", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      const newBook = await response.json();
      setBooks([...books, { ...newBook, downloadCount: 0 }]);
      setIsModalOpen(false);
      form.resetFields();
      setCoverFile(null);
      setBookFile(null);
      message.success("Книга успешно добавлена");
    } catch (error) {
      console.error("Error adding book:", error);
      message.error("Ошибка при добавлении книги");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      setBooks(books.filter((book) => book.id !== id));
      message.success("Книга успешно удалена");
    } catch (error) {
      console.error("Error deleting book:", error);
      message.error("Ошибка при удалении книги");
    }
  };

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
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/50x75";
          }}
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
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (_: any, record: BookType) => (
        <Popconfirm
          title="Удалить книгу?"
          description="Вы уверены, что хотите удалить эту книгу?"
          onConfirm={() => handleDelete(record.id)}
          okText="Да"
          cancelText="Нет"
        >
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
            Удалить
          </Button>
        </Popconfirm>
      ),
    },
  ];

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
            <h1 style={{ margin: 0 }}>Управление файлами</h1>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Добавить книгу
          </Button>
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
        <div style={{ textAlign: "center", padding: "var(--ant-padding-xl)" }}>
          <p>Файлы не найдены</p>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Добавить первую книгу
          </Button>
        </div>
      )}

      <Modal
        title="Добавить книгу"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setCoverFile(null);
          setBookFile(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            label="Название"
            name="title"
            rules={[{ required: true, message: "Пожалуйста, введите название книги" }]}
          >
            <Input placeholder="Название книги" />
          </Form.Item>

          <Form.Item
            label="Автор"
            name="author"
            rules={[{ required: true, message: "Пожалуйста, введите автора" }]}
          >
            <Input placeholder="Автор" />
          </Form.Item>

          <Form.Item
            label="Жанры"
            name="genres"
            rules={[{ required: true, message: "Пожалуйста, выберите жанры" }]}
          >
            <Select
              mode="multiple"
              placeholder="Выберите жанры"
              options={[
                { value: "ужасы", label: "Ужасы" },
                { value: "романтика", label: "Романтика" },
                { value: "приключение", label: "Приключение" },
                { value: "фантастика", label: "Фантастика" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Обложка" required>
            <Upload
              beforeUpload={(file) => {
                setCoverFile(file);
                return false;
              }}
              onRemove={() => setCoverFile(null)}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Выбрать обложку</Button>
            </Upload>
            {coverFile && <p style={{ marginTop: 8 }}>{coverFile.name}</p>}
          </Form.Item>

          <Form.Item label="Файл книги" required>
            <Upload
              beforeUpload={(file) => {
                setBookFile(file);
                return false;
              }}
              onRemove={() => setBookFile(null)}
              maxCount={1}
              accept=".epub,.pdf,.txt"
            >
              <Button icon={<UploadOutlined />}>Выбрать файл</Button>
            </Upload>
            {bookFile && <p style={{ marginTop: 8 }}>{bookFile.name}</p>}
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={uploading}>
                Добавить
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Отмена</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
