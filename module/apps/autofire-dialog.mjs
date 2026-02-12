import { HandlebarsApplicationMixin } from "foundry.applications.api";

/**
 * Autofire dialog for selecting bullet count for auto weapons
 */
export class AutofireDialog extends HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  static DEFAULT_OPTIONS = {
    classes: ["how-to-be-a-hero", "autofire-dialog"],
    tag: "dialog",
    position: { width: 350, height: "auto" },
    window: {
      title: "HTBAH.AutofireDialog.Title",
      resizable: false,
      minimizable: false,
      controls: []
    },
    actions: {
      fire: AutofireDialog.prototype._onFire,
      cancel: AutofireDialog.prototype._onCancel
    }
  };

  static PARTS = {
    form: {
      template: "systems/how-to-be-a-hero/templates/dialogs/autofire-dialog.hbs"
    }
  };

  constructor(options = {}) {
    super(options);
    this.maxBullets = options.maxBullets || 10;
    this.bullets = 1;
    this.#resolve = null;
    this.#reject = null;
  }

  #resolve;
  #reject;

  get title() {
    return game.i18n.localize("HTBAH.AutofireDialog.Title");
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.maxBullets = this.maxBullets;
    context.bullets = this.bullets;
    return context;
  }

  async _onFire(event, target) {
    event.preventDefault();
    const input = this.element.querySelector('input[name="bullets"]');
    this.bullets = Math.max(1, Math.min(this.maxBullets, parseInt(input.value) || 1));
    if (this.#resolve) this.#resolve(this.bullets);
    this.close();
  }

  async _onCancel(event, target) {
    event.preventDefault();
    if (this.#resolve) this.#resolve(null);
    this.close();
  }

  static async show(options = {}) {
    return new Promise((resolve, reject) => {
      const dialog = new this(options);
      dialog.#resolve = resolve;
      dialog.#reject = reject;
      dialog.render(true);
    });
  }
}
