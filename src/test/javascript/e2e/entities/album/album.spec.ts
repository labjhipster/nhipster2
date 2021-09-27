import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AlbumComponentsPage, AlbumDeleteDialog, AlbumUpdatePage } from './album.page-object';

const expect = chai.expect;

describe('Album e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let albumComponentsPage: AlbumComponentsPage;
  let albumUpdatePage: AlbumUpdatePage;
  let albumDeleteDialog: AlbumDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Albums', async () => {
    await navBarPage.goToEntity('album');
    albumComponentsPage = new AlbumComponentsPage();
    await browser.wait(ec.visibilityOf(albumComponentsPage.title), 5000);
    expect(await albumComponentsPage.getTitle()).to.eq('bootifulmusicApp.album.home.title');
    await browser.wait(ec.or(ec.visibilityOf(albumComponentsPage.entities), ec.visibilityOf(albumComponentsPage.noResult)), 1000);
  });

  it('should load create Album page', async () => {
    await albumComponentsPage.clickOnCreateButton();
    albumUpdatePage = new AlbumUpdatePage();
    expect(await albumUpdatePage.getPageTitle()).to.eq('bootifulmusicApp.album.home.createOrEditLabel');
    await albumUpdatePage.cancel();
  });

  it('should create and save Albums', async () => {
    const nbButtonsBeforeCreate = await albumComponentsPage.countDeleteButtons();

    await albumComponentsPage.clickOnCreateButton();

    await promise.all([
      albumUpdatePage.setNameInput('name'),
      albumUpdatePage.artistSelectLastOption(),
      albumUpdatePage.genreSelectLastOption(),
    ]);

    expect(await albumUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');

    await albumUpdatePage.save();
    expect(await albumUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await albumComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Album', async () => {
    const nbButtonsBeforeDelete = await albumComponentsPage.countDeleteButtons();
    await albumComponentsPage.clickOnLastDeleteButton();

    albumDeleteDialog = new AlbumDeleteDialog();
    expect(await albumDeleteDialog.getDialogTitle()).to.eq('bootifulmusicApp.album.delete.question');
    await albumDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(albumComponentsPage.title), 5000);

    expect(await albumComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
