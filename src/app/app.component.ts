import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './shared/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showBookList: boolean = false;
  
  constructor(private router: Router,
          private ds: DataService) {}
  
  onShowBooks(){
    if(!this.showBookList)
    {
      this.router.navigate(['/book-list']);
      this.showBookList = true;
    } 
    else {
      this.router.navigate(['/']);
      this.showBookList = false;
    }
  }
}
