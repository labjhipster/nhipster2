import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TrackComponentsPage, TrackDeleteDialog, TrackUpdatePage } from './track.page-object';

const expect = chai.expect;

describe('Track e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let trackComponentsPage: TrackComponentsPage;
  let trackUpdatePage: TrackUpdatePage;
  let trackDeleteDialog: TrackDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Tracks', async () => {
    await navBarPage.goToEntity('track');
    trackComponentsPage = new TrackComponentsPage();
    await browser.wait(ec.visibilityOf(trackComponentsPage.title), 5000);
    expect(await trackComponentsPage.getTitle()).to.eq('bootifulmusicApp.track.home.title');
    await browser.wait(ec.or(ec.visibilityOf(trackComponentsPage.entities), ec.visibilityOf(trackComponentsPage.noResult)), 1000);
  });

  it('should load create Track page', async () => {
    await trackComponentsPage.clickOnCreateButton();
    trackUpdatePage = new TrackUpdatePage();
    expect(await trackUpdatePage.getPageTitle()).to.eq('bootifulmusicApp.track.home.createOrEditLabel');
    await trackUpdatePage.cancel();
  });

  it('should create and save Tracks', async () => {
    const nbButtonsBeforeCreate = await trackComponentsPage.countDeleteButtons();

    await trackComponentsPage.clickOnCreateButton();

    await promise.all([trackUpdatePage.setNameInput('name'), trackUpdatePage.albumSelectLastOption()]);

    expect(await trackUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');

    await trackUpdatePage.save();
    expect(await trackUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await trackComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Track', async () => {
    const nbButtonsBeforeDelete = await trackComponentsPage.countDeleteButtons();
    await trackComponentsPage.clickOnLastDeleteButton();

    trackDeleteDialog = new TrackDeleteDialog();
    expect(await trackDeleteDialog.getDialogTitle()).to.eq('bootifulmusicApp.track.delete.question');
    await trackDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(trackComponentsPage.title), 5000);

    expect(await trackComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
