import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { InformationService } from '../../shared/services/information.service';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Book } from '../../shared/models/book';
import { DataService } from '../../shared/services/data.service';


@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  book: Book;
  title: string;
  authorName: string;
  publishedDate: string;
  closeResult: string;
  bookList: Book[];
  dateError: boolean = false;
  selectedBookId: string;
  bookForm: FormGroup;

  @ViewChild('editModal') editModal;

  constructor(private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private infoService: InformationService,
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.selectedBookId = routeParams.id;
    })
    this.getSelectedBook();
    this.bookForm = new FormGroup({
      title: new FormControl('', [this.forbiddenTitles.bind(this), this.stringNotEmpty.bind(this, ['title'])]),
      authorName: new FormControl('', this.stringNotEmpty.bind(this, ['authorName']))
    });
  }


  private stringNotEmpty(name: string, control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value) {
      let str = control.value;
      if (str.length > 0 && !str.trim()) {
        return { 'emptyString': true };
      } else {
        if (name[0] == 'title')
          this.title = control.value;
        if (name[0] == 'authorName')
          this.authorName = control.value;
        return null
      }
    };
  }

  private forbiddenTitles(control: FormControl): void {
    this.dataService.getAllBooks()
      .subscribe((books: Array<Book>) => {
        this.bookList = books;
        for (let i = 0; i < this.bookList.length; i++) {
          if ((this.bookList[i].title == control.value) && (this.bookList[i].id !== this.book.id)) {
            control.setErrors({ "titleAlreadyExist": true });
          } else {
            this.title = control.value;
          }
        }
    })
  };

  private getSelectedBook(): void {
    this.dataService.getAllBooks()
      .subscribe((books: Array<Book>) => {
          this.bookList = books;
          for (let i = 0; i < this.bookList.length; i++) {
            if (this.bookList[i].id.toString() === this.selectedBookId) {
              this.book = this.bookList[i];
              this.openModal();
            }
          };
    })
  };

  onDateChanged(date: string) {
    this.publishedDate = date;
  }

  onDateError(errorMessage: boolean) {
    this.dateError = errorMessage;
  }

  private saveChanges() {
    if (this.title)
      this.book.title = this.title;
    if (this.authorName)
      this.book.authorName = this.authorName;
    if (this.publishedDate)
      this.book.publishedDate = this.publishedDate;

    for (let i = 0; i < this.bookList.length; i++) {
      if (this.bookList[i].id === this.book.id) {
        this.bookList[i] = this.book;
        this.dataService.storeBooks(this.bookList)
          .subscribe(() => {
            this.infoService.setData('book was edited');
            this.router.navigate(['/book-list']);
          },
            (error) => console.log(error));
      }
    }
  }

  private openModal() {
    this.modalService.open(this.editModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'save click') {
        this.saveChanges();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.BACKDROP_CLICK || reason === 'cancel click' || reason === ModalDismissReasons.ESC) {
      this.router.navigate(['/book-list']);
      return "bu clicking on cancel";
    } else {
      return `with: ${reason}`;
    }
  }
}
