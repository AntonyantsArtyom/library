import { useState } from "react";
import { Button, Card, Form, Input, message, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { API_BASE, setAdminSession } from "../../api";

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin = ({ onSuccess }: AdminLoginProps) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { password: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password }),
      });

      if (!response.ok) {
        throw new Error("Неверный пароль");
      }

      setAdminSession(values.password);
      message.success("Вход выполнен");
      onSuccess();
    } catch (error) {
      console.error("Login error:", error);
      message.error("Неверный пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Card style={{ width: 360 }}>
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          <LockOutlined /> Вход для администратора
        </Typography.Title>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
