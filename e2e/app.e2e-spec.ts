import { TestisonePage } from './app.po';

describe('testisone App', () => {
  let page: TestisonePage;

  beforeEach(() => {
    page = new TestisonePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
