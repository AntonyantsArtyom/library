import { Col, Input, Row, Select, theme } from "antd";

export const Filter = () => {
  const { token } = theme.useToken();

  return (
    <Row
      style={{
        width: token.screenMD,
        margin: "0 auto",
        padding: "var(--ant-padding-md) 0",
        position: "sticky",
        top: 0,
        zIndex: 2,
        backgroundColor: token.colorBgContainer,
      }}
      gutter={[16, 16]}
    >
      <Col xs={24} sm={8}>
        <Input placeholder="Название" />
      </Col>
      <Col xs={24} sm={8}>
        <Input placeholder="Автор" />
      </Col>
      <Col xs={24} sm={8}>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Жанр"
          options={[
            { value: "ужасы", label: "ужасы" },
            { value: "романтика", label: "романтика" },
            { value: "приключение", label: "приключение" },
          ]}
        />
      </Col>
    </Row>
  );
};
