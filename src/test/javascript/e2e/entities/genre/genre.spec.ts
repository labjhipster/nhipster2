import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { GenreComponentsPage, GenreDeleteDialog, GenreUpdatePage } from './genre.page-object';

const expect = chai.expect;

describe('Genre e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let genreComponentsPage: GenreComponentsPage;
  let genreUpdatePage: GenreUpdatePage;
  let genreDeleteDialog: GenreDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Genres', async () => {
    await navBarPage.goToEntity('genre');
    genreComponentsPage = new GenreComponentsPage();
    await browser.wait(ec.visibilityOf(genreComponentsPage.title), 5000);
    expect(await genreComponentsPage.getTitle()).to.eq('bootifulmusicApp.genre.home.title');
    await browser.wait(ec.or(ec.visibilityOf(genreComponentsPage.entities), ec.visibilityOf(genreComponentsPage.noResult)), 1000);
  });

  it('should load create Genre page', async () => {
    await genreComponentsPage.clickOnCreateButton();
    genreUpdatePage = new GenreUpdatePage();
    expect(await genreUpdatePage.getPageTitle()).to.eq('bootifulmusicApp.genre.home.createOrEditLabel');
    await genreUpdatePage.cancel();
  });

  it('should create and save Genres', async () => {
    const nbButtonsBeforeCreate = await genreComponentsPage.countDeleteButtons();

    await genreComponentsPage.clickOnCreateButton();

    await promise.all([genreUpdatePage.setNameInput('name')]);

    expect(await genreUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');

    await genreUpdatePage.save();
    expect(await genreUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await genreComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Genre', async () => {
    const nbButtonsBeforeDelete = await genreComponentsPage.countDeleteButtons();
    await genreComponentsPage.clickOnLastDeleteButton();

    genreDeleteDialog = new GenreDeleteDialog();
    expect(await genreDeleteDialog.getDialogTitle()).to.eq('bootifulmusicApp.genre.delete.question');
    await genreDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(genreComponentsPage.title), 5000);

    expect(await genreComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
