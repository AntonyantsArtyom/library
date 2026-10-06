import { useEffect, useState } from "react";
import { Col, Empty, Pagination, Row, theme } from "antd";

import { Book } from "./Book/Book";

interface BookListProps {
  title: string;
  author: string;
  genres: string[];
}

const books = [
  {
    id: 1,
    title: "Война и мир",
    author: "Лев Толстой",
    genres: ["романтика"],
    cover: "/covers/war-and-peace.jpg",
    file: "/books/war-and-peace.epub",
  },
  {
    id: 2,
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    genres: ["приключение"],
    cover: "/covers/crime-and-punishment.jpg",
    file: "/books/crime-and-punishment.epub",
  },
  {
    id: 3,
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    genres: ["романтика", "приключение"],
    cover: "/covers/master-and-margarita.jpg",
    file: "/books/master-and-margarita.epub",
  },
  {
    id: 4,
    title: "Дракула",
    author: "Брэм Стокер",
    genres: ["ужасы"],
    cover: "/covers/dracula.jpg",
    file: "/books/dracula.epub",
  },
];

const PAGE_SIZE = 9;

export const BookList = ({ title, author, genres }: BookListProps) => {
  const { token } = theme.useToken();

  const [page, setPage] = useState(1);

  const filteredBooks = books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(title.toLowerCase());

    const authorMatch = book.author.toLowerCase().includes(author.toLowerCase());

    const genresMatch = genres.length === 0 || genres.some((genre) => book.genres.includes(genre));

    return titleMatch && authorMatch && genresMatch;
  });

  useEffect(() => {
    setPage(1);
  }, [title, author, genres]);

  const start = (page - 1) * PAGE_SIZE;

  const visibleBooks = filteredBooks.slice(start, start + PAGE_SIZE);

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
              <Book title={book.title} author={book.author} cover={book.cover} file={book.file} />
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
