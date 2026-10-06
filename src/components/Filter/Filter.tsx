import { Col, Input, Row, Select, theme } from "antd";

interface FilterProps {
  title: string;
  author: string;
  genres: string[];

  onTitleChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onGenresChange: (value: string[]) => void;
}

export const Filter = ({ title, author, genres, onTitleChange, onAuthorChange, onGenresChange }: FilterProps) => {
  const { token } = theme.useToken();

  return (
    <Row
      style={{
        width: "100%",
        maxWidth: token.screenMD,
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
        <Input placeholder="Название" value={title} onChange={(event) => onTitleChange(event.target.value)} allowClear />
      </Col>

      <Col xs={24} sm={8}>
        <Input placeholder="Автор" value={author} onChange={(event) => onAuthorChange(event.target.value)} allowClear />
      </Col>

      <Col xs={24} sm={8}>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Жанр"
          value={genres}
          onChange={onGenresChange}
          allowClear
          options={[
            { value: "ужасы", label: "Ужасы" },
            { value: "романтика", label: "Романтика" },
            { value: "приключение", label: "Приключение" },
          ]}
        />
      </Col>
    </Row>
  );
};
