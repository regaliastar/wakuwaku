import { ipcRenderer } from 'electron';
import Page from '~page/index';

const root = document.getElementById('#root');

const initPage = () => {
  const BannerHtml = Page.Banner.getHtmlNode();
  root?.appendChild(BannerHtml);
};
initPage();

ipcRenderer.on('toRenderer', (event, args) => {
  console.log(args);
});
ipcRenderer.send('toMain', 'ping');
