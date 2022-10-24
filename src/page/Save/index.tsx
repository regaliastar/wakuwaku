import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import style from './index.module.less';
import SaveCard from '~component/SaveCard';
import Toolbar from '~component/Toolbar';
import { SaveData } from '~interface/common';

const rowAmount = 3;
const columnAmount = 3;
moment.locale('zh-cn');
const data: SaveData[] = [
  {
    id: 0,
    img: '1.jpg',
    date: moment().format('llll'),
  },
  {
    id: 1,
    img: '2.jpg',
    date: moment().format('llll'),
  },
  {
    id: 5,
    img: '3.jpg',
    date: moment().format('LLLL'),
  },
];

const getPlaceFromId = (id: number) => {
  const row = Math.floor(id / columnAmount);
  const column = id - row * rowAmount;
  return [row, column];
};

const Save: FC = () => {
  const [dataContainer, setDataContainer] = useState<SaveData[][]>([]);
  useEffect(() => {
    const dc: SaveData[][] = new Array(rowAmount).fill(0).map(() => new Array(columnAmount).fill(null));
    data.forEach(d => {
      const [i, j] = getPlaceFromId(d.id);
      dc[i][j] = d;
    });
    setDataContainer(dc);
  }, [data]);
  return (
    <div>
      <Toolbar></Toolbar>
      <div className={style.saveSpace}>
        {dataContainer?.map((rowList, key) => {
          return (
            <div key={key} className={style.row}>
              {rowList.map((item, key) => {
                return (
                  <div key={key}>
                    <SaveCard img={item?.img} date={item?.date}></SaveCard>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Save;
