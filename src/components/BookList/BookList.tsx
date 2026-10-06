import { Col, Pagination, Row, theme } from "antd";
import { Book } from "./Book/Book";

export const BookList = () => {
  const { token } = theme.useToken();

  return (
    <>
      <Row style={{ width: token.screenMD, margin: "auto" }} gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Book />
          <Book />
          <Book />
        </Col>
        <Col xs={24} sm={8}>
          <Book />
          <Book />
          <Book />
        </Col>
        <Col xs={24} sm={8}>
          <Book />
          <Book />
          <Book />
        </Col>
      </Row>
      <Row
        style={{
          width: token.screenMD,
          margin: "0 auto",
          padding: "var(--ant-padding-md) 0",
          position: "sticky",
          bottom: 0,
          zIndex: 2,
          backgroundColor: token.colorBgContainer,
        }}
      >
        <Pagination
          style={{
            margin: "0 auto",
          }}
          defaultCurrent={1}
          total={50}
        />
      </Row>
    </>
  );
};
