import { ipcRenderer } from 'electron';
import Page from '~page/index';

const root = document.getElementById('#root');

const initPage = () => {
  const BannerHtmlEle = Page.Banner.el;
  root?.appendChild(BannerHtmlEle);
};
initPage();

ipcRenderer.on('toRenderer', (event, args) => {
  console.log(args);
});
ipcRenderer.send('toMain', 'ping');
