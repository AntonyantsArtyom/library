import { useEffect, useMemo, useState } from "react";
import { Col, Empty, Pagination, Row, Spin, theme } from "antd";

import { Book } from "./Book/Book";

interface BookType {
  id: number;
  title: string;
  author: string;
  genres: string[];
  cover: string;
  file: string;
}

interface BookListProps {
  title: string;
  author: string;
  genres: string[];
}

const PAGE_SIZE = 9;

export const BookList = ({ title, author, genres }: BookListProps) => {
  const { token } = theme.useToken();

  const [books, setBooks] = useState<BookType[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/books.json`)
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

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const titleMatch = book.title.toLowerCase().includes(title.toLowerCase());

      const authorMatch = book.author.toLowerCase().includes(author.toLowerCase());

      const genresMatch = genres.length === 0 || genres.some((genre) => book.genres.includes(genre));

      return titleMatch && authorMatch && genresMatch;
    });
  }, [books, title, author, genres]);

  useEffect(() => {
    setPage(1);
  }, [title, author, genres]);

  const start = (page - 1) * PAGE_SIZE;

  const visibleBooks = filteredBooks.slice(start, start + PAGE_SIZE);

  if (loading) {
    return (
      <Row justify="center">
        <Spin />
      </Row>
    );
  }

  return (
    <>
      <Row
        style={{
          width: "100%",
          maxWidth: token.screenMD,
          margin: "0 auto",
        }}
        gutter={[16, 16]}
      >
        {visibleBooks.length > 0 ? (
          visibleBooks.map((book) => (
            <Col key={book.id} xs={24} sm={12} md={8}>
              <Book
                title={book.title}
                author={book.author}
                cover={`${import.meta.env.BASE_URL}${book.cover}`}
                file={`${import.meta.env.BASE_URL}${book.file}`}
              />
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty description="Книги не найдены" />
          </Col>
        )}
      </Row>

      {filteredBooks.length > PAGE_SIZE && (
        <Row
          style={{
            width: "100%",
            maxWidth: token.screenMD,
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
            current={page}
            pageSize={PAGE_SIZE}
            total={filteredBooks.length}
            onChange={setPage}
            showSizeChanger={false}
          />
        </Row>
      )}
    </>
  );
};
