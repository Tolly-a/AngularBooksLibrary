import { Component, OnInit, Input } from '@angular/core';
import { Book } from '../../shared/models/book';
import { Router } from '@angular/router';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
 
  @Input() book: Book;
  closeResult: string;

  constructor(private router: Router) { }

  openEditBook(book: Book, modalName: string):void {
    if (modalName === 'editModal')
      this.router.navigate(['/book-list/edit-book', book.id])
  }

  openDeleteModal(book: Book, modalName: string):void{
    if(modalName === 'deleteBook'){
      this.router.navigate(['/book-list/delete-book', book.id]);
    }
  }


}
