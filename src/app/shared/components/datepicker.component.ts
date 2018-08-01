import { Component, Injectable, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

import * as moment from 'moment';


export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}


@Injectable()
export class MyFormatter extends NgbDateParserFormatter {

  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return { year: toInteger(dateParts[0]), month: null, day: null };
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return { day: toInteger(dateParts[2]), month: toInteger(dateParts[1]), year: toInteger(dateParts[0]) };
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ?
      `${isNumber(date.month) ? padNumber(date.month) : ''}/${isNumber(date.day) ? padNumber(date.day) : ''}/${date.year}` : '';
  }
}


@Component({
  selector: 'datepicker-component',
  templateUrl: './datepicker.component.html',
  styleUrls: ['datapicker.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: MyFormatter }]
})
export class NgbdDatepickerPopup implements OnInit {

  @Input() publishedDate;
  @Output('dateUpdated') dateEmiter = new EventEmitter();
  @Output('dateError') dateErrorEmiter = new EventEmitter();
  @Output('dateRequiredError') dateRequiredError = new EventEmitter();
  dateForm: FormGroup;
  dateString: string;

  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) { }

  ngOnInit() {
    this.dateForm = new FormGroup({
      newDate: new FormControl("", [this.chackDate.bind(this)])
    });
  }

  private chackDate(control: FormControl) {
    if (control.value) {
      let _dayToday = moment().format('DD');
      let _monthToday = moment().format('MM');
      let _yearToday = moment().format('YYYY');
      if (
        (control.value.year > _yearToday) ||
        (control.value.year == _yearToday && control.value.month > _monthToday) ||
        ((control.value.year == _yearToday && control.value.month == _monthToday) && control.value.day > _dayToday)) {
        this.dateErrorEmiter.emit(true);
        control.invalid;
        return { "afterToday": true };
      } else if (isNaN(control.value.year) || isNaN(control.value.day) || isNaN(control.value.month)) {
        this.dateErrorEmiter.emit(true);
        control.invalid;
        return { 'incorrectDateFormat': true };
      } else {
        control.valid;
        this.onSelectDate(control.value);
        this.dateErrorEmiter.emit(false);
      }
    }
  }


  onSelectDate(date: NgbDateStruct) {
    if (date != null) {
      this.dateString = this.ngbDateParserFormatter.format(date);
      this.dateEmiter.emit(this.dateString);
    } else {
      this.dateRequiredError.emit(true);
    }
  }
}

