import { ipcRenderer } from 'electron';
import routes from './entry/routes';
import main from './entry/main';
import Page from '~page/index';

main();
const root = document.getElementById('#root');
routes.registerRoot(root);
routes.registerPage('/', 'Banner');

const initPage = () => {
  const BannerHtmlEle = Page.Banner._el;
  // 只能传入 HTMLDivElement
  root?.appendChild(BannerHtmlEle);
};
initPage();

ipcRenderer.on('toRenderer', (event, args) => {
  console.log(args);
});
ipcRenderer.send('toMain', 'ping');
