import React, { FC } from 'react';
import { Card } from 'antd';

const { Meta } = Card;

interface CardProps {
  img?: string;
  date?: string;
}

const SaveCard: FC<CardProps> = (props: CardProps) => {
  return (
    <Card
      hoverable
      style={{ width: 240, margin: 20 }}
      cover={
        <img
          style={{ width: '100%', height: 200 }}
          src={props.img ? `../../drama/bg/${props.img}` : `../../statics/img/saveNoData.svg`}
        />
      }
    >
      <Meta style={{ height: 20 }} description={props.date || '新建'} />
    </Card>
  );
};

export default SaveCard;
