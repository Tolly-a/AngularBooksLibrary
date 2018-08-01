import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../shared/services/data.service';
import { InformationService } from '../../shared/services/information.service';
import { Book } from '../../shared/models/book';


@Component({
  selector: 'app-delete-book',
  templateUrl: './delete-book.component.html',
  styleUrls: ['./delete-book.component.css']
})
export class DeleteBookComponent implements OnInit {

  closeResult: string;
  selectedBookId: string;
  bookList: Book[];
  selectedBook: any;
  @ViewChild('deleteModal') deleteModal;

  constructor(private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private infoService: InformationService) { }

  ngOnInit() {
    setTimeout(() => {
        this.open();
    })
   this.activeRoute.params.subscribe(routeParams => {
      this.selectedBookId = routeParams.id;
    })
  }


  private deleteBookById(): void {
    this.dataService.getAllBooks()
      .subscribe((books: Array<Book>) => {
      this.bookList = books;
      let indexToRemove;

      for (let i = 0; i < this.bookList.length; i++) {
        if (this.bookList[i].id.toString() === this.selectedBookId) {
          indexToRemove = i;
          this.bookList.splice(indexToRemove, 1);
          this.dataService.storeBooks(this.bookList)
            .subscribe(() => {
              this.infoService.setData('book was deleted');
              this.router.navigate(['/book-list']);
            },
              (error) => console.log(error))
        }
      }
    });
  };



  open() {
    this.modalService.open(this.deleteModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.deleteBookById()
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.BACKDROP_CLICK || reason === 'cancel click' || reason === ModalDismissReasons.ESC) {
      this.router.navigate(['/book-list']);
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
