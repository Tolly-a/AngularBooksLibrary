import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { Router } from '@angular/router';
import { InformationService } from './../shared/services/information.service';
import { Book } from '../shared/models/book';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  animations: [
    trigger('listStagger', [
      transition('* <=> *', [
        query(':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger('40ms',
              animate('350ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })))
          ], { optional: true }),
        query(':leave', animate('40ms', style({ opacity: 0 })), { optional: true })
      ])
    ])
  ]
})
export class BookListComponent implements OnInit {

  books: Book[];

  constructor(private dataService: DataService,
    private router: Router,
    private infoService: InformationService) { }

  ngOnInit() {

    this.updateBookList();

    this.infoService.getData().subscribe((data) => {
      if ((data == 'book was deleted') || (data == 'book was edited') || (data == 'book was added'))
        this.updateBookList();
    });
  }

  private updateBookList() {
    this.dataService.getAllBooks()
      .subscribe((books: Array<Book>) => {
        this.books = books
      }, err => {
        console.log(err);
      });
  }

  openAddModal(modalName: string): void {
    if (modalName == 'addModal')
      this.router.navigate(['book-list/add-book']);
  }


}
