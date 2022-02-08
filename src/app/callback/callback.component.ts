import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { OKTA_CONFIG, OktaConfig, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

// This is copied pretty much exactly from @okta/okta-angular source

@Component({
  selector: 'app-callback',
  template: `<div>{{error}}</div>`,
})
export class CallbackComponent implements OnInit {

  public error: string|undefined;

  constructor(
    @Inject(OKTA_CONFIG) private config: OktaConfig,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    @Optional() private injector?: Injector
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      // Parse code or tokens from the URL, store tokens in the TokenManager, and redirect back to the originalUri
      await this.oktaAuth.handleLoginRedirect();
    } catch (e) {
      // Callback from social IDP. Show custom login page to continue.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Supports auth-js v5 & v6
      const isInteractionRequiredError = this.oktaAuth.isInteractionRequiredError || this.oktaAuth.idx.isInteractionRequiredError;
      if (isInteractionRequiredError(e) && this.injector) {
        const { onAuthResume, onAuthRequired } = this.config;
        const callbackFn = onAuthResume || onAuthRequired;
        if (callbackFn) {
          callbackFn(this.oktaAuth, this.injector);
          return;
        }
      }
      this.error = (e as {}).toString();
    }
  }

}
