import { Button, Card } from "antd";

interface BookProps {
  title: string;
  author: string;
  cover: string;
  file: string;
}

export const Book = ({ title, author, cover, file }: BookProps) => {
  return (
    <Card hoverable style={{ width: "100%" }} cover={<img draggable={false} src={cover} alt={title} />}>
      <Card.Meta title={title} description={author} />

      <a href={file} download>
        <Button
          type="primary"
          style={{
            width: "100%",
            marginTop: "var(--ant-margin-xs)",
          }}
        >
          Скачать
        </Button>
      </a>
    </Card>
  );
};
