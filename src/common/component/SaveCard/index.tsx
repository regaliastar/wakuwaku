import React, { FC } from 'react';
import { Card } from 'antd';
import { bgDir } from '~store/global';

const { Meta } = Card;

interface CardProps {
  id?: string;
  img?: string;
  date?: string;
  onClick?: (e: string) => void;
}

const SaveCard: FC<CardProps> = (props: CardProps) => {
  return (
    <Card
      id={props.id}
      onClick={e => props.onClick?.(e.currentTarget.id)}
      hoverable
      style={{ width: 240, margin: 20 }}
      cover={
        <img
          style={{ width: '100%', height: 200 }}
          src={props.img ? `../../${bgDir}/${props.img}` : `../../statics/img/saveNoData.svg`}
        />
      }
    >
      <Meta style={{ height: 20 }} description={props.date || '新建'} />
    </Card>
  );
};

export default SaveCard;
