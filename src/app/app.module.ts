import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {BandService} from './service/band.service';
import {FormsModule} from '@angular/forms';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {RecommendationServiceService} from './service/recommendation-service.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import {HelpComponent} from './help/help.component';


@NgModule({
  declarations: [
    AppComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
    FormsModule,
    AngularFontAwesomeModule,
    NgxSpinnerModule
  ],
  providers: [BandService, RecommendationServiceService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
