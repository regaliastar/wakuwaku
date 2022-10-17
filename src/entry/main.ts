import routes from './routes';
import Container from '~util/Container';
import Page from '~page/index';

const main = () => {
  /** load Container */
  Container.loadDrama('drama/test.txt');

  /** load Page */
  location.hash = '';
  const root = document.getElementById('#root');
  routes.registerRoot(root);
  routes.registerPage('/', 'Banner');
  const BannerHtmlEle = Page.Banner._el;
  root?.appendChild(BannerHtmlEle);
};

main();
