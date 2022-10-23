import React, { FC } from 'react';
import {
  EyeOutlined,
  CommentOutlined,
  LoadingOutlined,
  Loading3QuartersOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';
import style from './index.module.less';
import { toolbarVisiable, auto } from '~store/content';
import { history } from '~store/script';

const Toolbar: FC = () => {
  const [_toolbarVisiable, setToolbarVisiable] = useRecoilState(toolbarVisiable);
  const [_auto, setAuto] = useRecoilState(auto);
  const _history = useRecoilValue(history);

  const confirmExit = () => {
    Modal.confirm({
      title: '退出游戏',
      content: '确认要返回主菜单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        location.href = '';
      },
    });
  };

  const confirmHistory = () => {
    console.log('getHistory', _history);
    Modal.info({
      title: '历史记录',
      width: 1000,
      content: (
        <div className={style.history}>
          {_history.map(h => {
            return <p key={h?.text + Math.random().toString()}>{h?.name ? `${h?.name}: ${h?.text}` : `${h?.text}`}</p>;
          })}
        </div>
      ),
      okText: '关闭',
    });
  };

  return _toolbarVisiable ? (
    <div className={style.toolbar}>
      <div className={style.left}>
        <div
          className={style.item}
          onClick={e => {
            e.stopPropagation();
            setToolbarVisiable(false);
          }}
        >
          <span>隐藏</span>
          <EyeOutlined />
        </div>
        <div
          className={style.item}
          onClick={e => {
            e.stopPropagation();
            confirmHistory();
          }}
        >
          <span>历史</span>
          <CommentOutlined />
        </div>
      </div>
      <div className={style.right}>
        <div
          className={style.item}
          onClick={e => {
            e.stopPropagation();
            setAuto(!_auto);
          }}
        >
          <span>{_auto ? '自动中' : '自动'}</span>
          {_auto ? <LoadingOutlined /> : <Loading3QuartersOutlined />}
        </div>
        <div
          className={style.item}
          onClick={e => {
            e.stopPropagation();
            confirmExit();
          }}
        >
          <span>退出</span>
          <ExportOutlined />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Toolbar;
