import { useEffect, useState } from "react";
import { Button, Col, Empty, Row, Space, Spin, Table, Tag, theme, message } from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { API_BASE, adminHeaders } from "../../api";

interface LogEntry {
  date: string;
  time: string;
  action: string;
  details: string;
}

export const AdminLogs = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    fetch(`${API_BASE}/api/logs`, { headers: adminHeaders() })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((data) => setLogs(data))
      .catch((error) => {
        console.error("Ошибка загрузки журнала:", error);
        message.error("Ошибка загрузки журнала действий");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const refreshLogs = () => {
    setLoading(true);
    fetchLogs();
  };

  const columns = [
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      width: 130,
    },
    {
      title: "Время",
      dataIndex: "time",
      key: "time",
      width: 110,
    },
    {
      title: "Действие",
      dataIndex: "action",
      key: "action",
      render: (action: string) => <Tag color="blue">{action}</Tag>,
    },
    {
      title: "Детали",
      dataIndex: "details",
      key: "details",
      render: (details: string) => details || "—",
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
            <h1 style={{ margin: 0 }}>Журнал действий</h1>
          </Space>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={refreshLogs}>
            Обновить
          </Button>
        </Col>
      </Row>

      {logs.length > 0 ? (
        <Table
          dataSource={logs}
          columns={columns}
          rowKey={(record) => `${record.date}-${record.time}-${record.action}`}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
      ) : (
        <Empty description="Записей в журнале нет" />
      )}
    </div>
  );
};
