import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InformationService } from '../../shared/services/information.service';
import { FormControl, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { mapChildrenIntoArray } from '../../../../node_modules/@angular/router/src/url_tree';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})

export class AddBookComponent implements OnInit {
  title: string;
  authorName: string;
  publishedDate: string;
  closeResult: string;
  newBookForm: FormGroup;
  dateError: boolean = false;
  notDateError: boolean = true;
  sub: Subscription;
  listBooks: any;

  @ViewChild('addModal') addModal;

  constructor(private modalService: NgbModal,
    private router: Router,
    private dataService: DataService,
    private infoService: InformationService,
  ) { }


  ngOnInit() {
    this.newBookForm = new FormGroup({
      title: new FormControl('', [Validators.required, this.forbiddenTitles.bind(this), this.stringNotEmpty.bind(this, ['title'])]),
      authorName: new FormControl('', [Validators.required, this.stringNotEmpty.bind(this, ['authorName'])])
    })
    this.notDateError = true;
  }

  private forbiddenTitles(control: FormControl): void {
    this.dataService.getAllBooks().subscribe(res => {
      this.listBooks = res;
      for (let i = 0; i < this.listBooks.length; i++) {
        if (this.listBooks[i].title == control.value) {
          control.setErrors({ "titleAlreadyExist": true });
        } else {
          this.title = control.value;
        }
      }
    })
  };

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

  addBook() {
    const newBook = {
      title: this.title,
      authorName: this.authorName,
      publishedDate: this.publishedDate,
      id : this.generateId()
    }
    this.listBooks.push(newBook);
    this.dataService.storeBooks(this.listBooks)
    .subscribe((res) => {
      this.infoService.setData('book was added');
      this.newBookForm.reset();
      this.router.navigate(['/book-list']);
    },
    (error) => console.log(error))
  }

  private generateId(){
    return Math.round(Math.random() * 10000);
  }
  
  onDateChanged(date: string) {
    this.publishedDate = date;
    if (this.publishedDate) {
      this.notDateError = false;
    }
  }
  onDateRequiredError(errorMessage: boolean){
    this.dateError = errorMessage;
  }
  onDateError(errorMessage: boolean) {
    this.dateError = errorMessage;
  }

  open() {
    this.modalService.open(this.addModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'add click') {
        this.addBook();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.BACKDROP_CLICK || reason === 'cancel click' || reason === ModalDismissReasons.ESC) {
      this.newBookForm.reset();
      this.router.navigate(['/book-list']);
      return "bu clicking on cancel";
    } else {
      this.newBookForm.reset();
      return `with: ${reason}`;
    }
  }

}
