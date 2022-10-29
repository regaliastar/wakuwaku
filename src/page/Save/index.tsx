import React, { FC, useEffect, useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Modal, Popconfirm } from 'antd';
import { useRecoilState } from 'recoil';
import style from './index.module.less';
import EventTree from '~util/EventTree';
import SaveCard from '~component/SaveCard';
import Toolbar from '~component/Toolbar';
import { SaveData } from '~interface/common';
import { saveHelper } from '~store/db/dbSchema';
import { currentCharactarSay, currentBg, currentChangeCharactors } from '~store/content';
import { step, hash } from '~store/script';

const rowAmount = 3;
const columnAmount = 3;
moment.locale('zh-cn');

const getPlaceFromId = (id: number) => {
  const row = Math.floor(id / columnAmount);
  const column = id - row * rowAmount;
  return [row, column];
};

const Save: FC = () => {
  const [dataContainer, setDataContainer] = useState<SaveData[][]>([]);
  const [curCharactorSay, setCurCharactorSay] = useRecoilState(currentCharactarSay);
  const [curBg, setCurBg] = useRecoilState(currentBg);
  const [curCharactors, setCurCharactor] = useRecoilState<string[]>(currentChangeCharactors);
  const [_step, setStep] = useRecoilState(step);
  const [_hash, setHash] = useRecoilState(hash);
  const navigate = useNavigate();
  const [ingore, forceUpdate] = useReducer(x => x + 1, 0);

  const cover = (id: string) => {
    Modal.confirm({
      title: '是否覆盖存档',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        saveHelper.put({
          id,
          hash: _hash,
          step: _step,
          date: moment().format('llll'),
          currentCharactarSay: curCharactorSay,
          currentBg: curBg,
          currentChangeCharactors: curCharactors,
        });
        forceUpdate();
      },
    });
  };
  const save = (id: string) => {
    Modal.confirm({
      title: '是否保存',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        saveHelper.add({
          id,
          hash: _hash,
          step: _step,
          date: moment().format('llll'),
          currentCharactarSay: curCharactorSay,
          currentBg: curBg,
          currentChangeCharactors: curCharactors,
        });
        forceUpdate();
      },
    });
  };
  const load = async (id: string) => {
    Modal.confirm({
      title: '是否加载存档',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await saveHelper.find(id);
        if (res === false) {
          return;
        }
        EventTree.gotoByHash(res.hash);
        setHash(res.hash);
        setStep(res.step);
        if (res.currentCharactarSay) setCurCharactorSay(res.currentCharactarSay);
        if (res.currentBg) setCurBg(res.currentBg);
        if (res.currentChangeCharactors) setCurCharactor(res.currentChangeCharactors);
        navigate('/content');
      },
    });
  };

  const getData = async () => {
    const data = await saveHelper.getAll();
    const dc: SaveData[][] = new Array(rowAmount).fill(0).map(() => new Array(columnAmount).fill(null));
    data.forEach(d => {
      const [i, j] = getPlaceFromId(d.id);
      dc[i][j] = d;
    });
    setDataContainer(dc);
  };
  useEffect(() => {
    getData();
  }, [ingore]);

  return (
    <div>
      <Toolbar></Toolbar>
      <div className={style.saveSpace}>
        {dataContainer?.map((rowList, keyRow) => {
          return (
            <div key={keyRow} className={style.row}>
              {rowList.map((item, keyCol) => {
                return (
                  <div key={keyCol}>
                    {item === null ? (
                      <SaveCard id={'' + (keyRow * 3 + keyCol)} onClick={id => save(id)}></SaveCard>
                    ) : (
                      <Popconfirm
                        title="是否加载存档"
                        onConfirm={() => cover(item?.id)}
                        onCancel={() => load(item?.id)}
                        okText="覆盖"
                        cancelText="加载"
                      >
                        <SaveCard id={item?.id} img={item?.currentBg} date={item?.date}></SaveCard>
                      </Popconfirm>
                    )}
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
