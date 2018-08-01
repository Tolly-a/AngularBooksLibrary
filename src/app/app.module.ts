import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

//components
import { AppComponent } from './app.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookComponent } from './book-list/book/book.component';
import { EditBookComponent } from './book-list/edit-book/edit-book.component';
import { DeleteBookComponent } from './book-list/delete-book/delete-book.component';
import { AddBookComponent } from './book-list/add-book/add-book.component';
import { NgbdDatepickerPopup } from './shared/components/datepicker.component';

//services 
import { DataService } from './shared/services/data.service';
import { InformationService } from './shared/services/information.service';
// pipes
import { MomentPipe } from './shared/pipes/moment.pipe';
import { CleanTextPipe } from './shared/pipes/clean-text.pipe';

const appRoutes: Routes = [
  { path: '', component:AppComponent},
  { path: 'book-list', component: BookListComponent, children:
    [
      { path: 'edit-book/:id', component: EditBookComponent },
      { path: 'delete-book/:id', component: DeleteBookComponent },
      { path: 'add-book', component: AddBookComponent }
    ]
  },
  { path: '**', redirectTo: '', component:AppComponent }
];
  

@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookComponent,
    EditBookComponent,
    DeleteBookComponent,
    AddBookComponent,
    NgbdDatepickerPopup,
    MomentPipe,
    CleanTextPipe
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    FormsModule,
    AngularFontAwesomeModule
  ],
  providers: [
    DataService, InformationService, 
   ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditBookComponent,
    DeleteBookComponent,
    AddBookComponent
  ]
})
export class AppModule { }
