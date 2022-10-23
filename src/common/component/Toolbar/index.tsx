import React, { FC } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import style from './index.module.less';

const Toolbar: FC = () => {
  const confirmExit = () => {
    Modal.confirm({
      title: '退出',
      content: '确认要返回主菜单吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        location.href = '';
      },
    });
  };
  return (
    <div className={style.toolbar}>
      <div className={style.right}>
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
  );
};

export default Toolbar;
