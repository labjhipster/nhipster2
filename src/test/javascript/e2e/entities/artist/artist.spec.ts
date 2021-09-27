import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ArtistComponentsPage, ArtistDeleteDialog, ArtistUpdatePage } from './artist.page-object';

const expect = chai.expect;

describe('Artist e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let artistComponentsPage: ArtistComponentsPage;
  let artistUpdatePage: ArtistUpdatePage;
  let artistDeleteDialog: ArtistDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Artists', async () => {
    await navBarPage.goToEntity('artist');
    artistComponentsPage = new ArtistComponentsPage();
    await browser.wait(ec.visibilityOf(artistComponentsPage.title), 5000);
    expect(await artistComponentsPage.getTitle()).to.eq('bootifulmusicApp.artist.home.title');
    await browser.wait(ec.or(ec.visibilityOf(artistComponentsPage.entities), ec.visibilityOf(artistComponentsPage.noResult)), 1000);
  });

  it('should load create Artist page', async () => {
    await artistComponentsPage.clickOnCreateButton();
    artistUpdatePage = new ArtistUpdatePage();
    expect(await artistUpdatePage.getPageTitle()).to.eq('bootifulmusicApp.artist.home.createOrEditLabel');
    await artistUpdatePage.cancel();
  });

  it('should create and save Artists', async () => {
    const nbButtonsBeforeCreate = await artistComponentsPage.countDeleteButtons();

    await artistComponentsPage.clickOnCreateButton();

    await promise.all([artistUpdatePage.setNameInput('name')]);

    expect(await artistUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');

    await artistUpdatePage.save();
    expect(await artistUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await artistComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Artist', async () => {
    const nbButtonsBeforeDelete = await artistComponentsPage.countDeleteButtons();
    await artistComponentsPage.clickOnLastDeleteButton();

    artistDeleteDialog = new ArtistDeleteDialog();
    expect(await artistDeleteDialog.getDialogTitle()).to.eq('bootifulmusicApp.artist.delete.question');
    await artistDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(artistComponentsPage.title), 5000);

    expect(await artistComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
