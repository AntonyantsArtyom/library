import { Button, Card } from "antd";

export const Book = () => {
  return (
    <Card
      hoverable
      style={{ width: '100%' }}
      cover={
        <img
          draggable={false}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPj1zpNsowg-AE0G7HObiR6o7W6jBBIJp_m6wz1K9VHHGqbl9iSBTn9KrPGEhCOo_34i60w32oLJsBtaOX_u-eYbnEybVLFriOmk--iL2h&s=10"
        />
      }
    >
      <Card.Meta title="Война и мир" description="Лев Толстой" />
      <Button style={{ width: "100%", marginTop: "var(--ant-margin-xs)" }}>Скачать</Button>
    </Card>
  );
};
