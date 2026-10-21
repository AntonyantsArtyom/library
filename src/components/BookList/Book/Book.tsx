import { Button, Card, message } from "antd";

interface BookProps {
  id: number;
  title: string;
  author: string;
  cover: string;
  file: string;
}

export const Book = ({ id, title, author, cover, file }: BookProps) => {
  const handleDownload = async () => {
    try {
      await fetch(`http://129.101.112.151:3000/api/books/${id}/download`, {
        method: "POST",
      });

      const link = document.createElement("a");
      link.href = file;
      link.download = file.split("/").pop() || "book.epub";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success("Загрузка началась");
    } catch (error) {
      console.error("Error tracking download:", error);
      const link = document.createElement("a");
      link.href = file;
      link.download = file.split("/").pop() || "book.epub";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card
      hoverable
      style={{ width: "100%" }}
      cover={
        <img
          draggable={false}
          src={cover}
          alt={title}
          style={{
            height: 320,
            objectFit: "cover",
          }}
        />
      }
    >
      <Card.Meta title={title} description={author} />

      <Button
        type="primary"
        onClick={handleDownload}
        style={{
          width: "100%",
          marginTop: "var(--ant-margin-xs)",
        }}
      >
        Скачать
      </Button>
    </Card>
  );
};
