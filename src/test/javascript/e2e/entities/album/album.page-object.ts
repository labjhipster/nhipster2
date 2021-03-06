import { element, by, ElementFinder } from 'protractor';

export class AlbumComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-album div table .btn-danger'));
  title = element.all(by.css('jhi-album div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class AlbumUpdatePage {
  pageTitle = element(by.id('jhi-album-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));

  artistSelect = element(by.id('field_artist'));
  genreSelect = element(by.id('field_genre'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async artistSelectLastOption(): Promise<void> {
    await this.artistSelect.all(by.tagName('option')).last().click();
  }

  async artistSelectOption(option: string): Promise<void> {
    await this.artistSelect.sendKeys(option);
  }

  getArtistSelect(): ElementFinder {
    return this.artistSelect;
  }

  async getArtistSelectedOption(): Promise<string> {
    return await this.artistSelect.element(by.css('option:checked')).getText();
  }

  async genreSelectLastOption(): Promise<void> {
    await this.genreSelect.all(by.tagName('option')).last().click();
  }

  async genreSelectOption(option: string): Promise<void> {
    await this.genreSelect.sendKeys(option);
  }

  getGenreSelect(): ElementFinder {
    return this.genreSelect;
  }

  async getGenreSelectedOption(): Promise<string> {
    return await this.genreSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class AlbumDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-album-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-album'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
