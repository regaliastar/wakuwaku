import React, { FC } from 'react';
import {
  EyeOutlined,
  CommentOutlined,
  LoadingOutlined,
  Loading3QuartersOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useRecoilState } from 'recoil';
import style from './index.module.less';
import { toolbarVisiable, auto } from '~store/content';

const Toolbar: FC = () => {
  const [_toolbarVisiable, setToolbarVisiable] = useRecoilState(toolbarVisiable);
  const [_auto, setAuto] = useRecoilState(auto);

  return _toolbarVisiable ? (
    <div className={style.toolbar}>
      <div
        onClick={e => {
          e.stopPropagation();
          setToolbarVisiable(false);
        }}
      >
        <span>隐藏</span>
        <EyeOutlined />
      </div>
      <div>
        <span>历史</span>
        <CommentOutlined />
      </div>
      <div
        onClick={e => {
          e.stopPropagation();
          setAuto(!_auto);
        }}
      >
        <span>自动</span>
        {_auto ? <LoadingOutlined /> : <Loading3QuartersOutlined />}
      </div>
      <div>
        <span>退出</span>
        <ExportOutlined />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Toolbar;
