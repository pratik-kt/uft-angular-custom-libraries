import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import moment from 'moment';
import { CONSTANTS } from './constant';

@Component({
  selector: 'uft-date-range-picker',
  templateUrl: './date-range-picker.component.html'
})
export class DateRangePickerComponent implements OnInit {
  public inputStartDate: Date;
  public inputEndDate: Date;
  public saveButtonName: string;
  private allowDays: number;
  private allowMinMaxValidation = false;
  private defaultAllowDays = CONSTANTS.ONE_EIGHTY;
  @Input()
  set setDefaultAllowDays(days) {
    this.defaultAllowDays = days;
  }
  @Input()
  set presetStartDate(startDate) {
    this.inputStartDate = startDate || null;
  }

  @Input()
  set setSaveButtonName(name) {
    this.saveButtonName = name;
  }

  get getSaveButtonName(): string {
    return this.saveButtonName || CONSTANTS.SAVE;
  }

  @Input()
  set setAllowDays(days) {
    this.allowDays = days;
  }

  @Input()
  set allowMinMaxValidationOnSelect(status) {
    this.allowMinMaxValidation = status;
  }

  @Input()
  set presetEndDdate(endDate) {
    this.inputEndDate = endDate || null;
  }

  @Output() applyDateEmit = new EventEmitter();
  today: Date;
  currentMonth;
  currentYear;
  month = [];
  setMonth = CONSTANTS.ZERO;
  firstClk: boolean;
  falseClaim: boolean;
  startDate: Date;
  endDate: Date;
  minDate: Date;
  maxDate: Date;
  isMinMax: boolean;
  isNextButton: boolean;
  isPrevButton: boolean;
  isSet = true;
  monthFull = CONSTANTS.FULL_MONTH;
  constructor() { }

  ngOnInit(): void {
    this.initDatepicker();
  }

  setMinMax(): void {
    const today = new Date();
    const pastDays = new Date(today.setDate(today.getDate() - this.defaultAllowDays));
    this.minDate = new Date(`${pastDays.getMonth() + 1}/${pastDays.getDate()}/${pastDays.getFullYear()}`);
    this.maxDate = new Date();
  }

  differenceBetweenTwoDates(d1, d2): number {
    const a = moment(d1, 'M/D/YYYY');
    const b = moment(d2, 'M/D/YYYY');
    return b.diff(a, 'days');
  }

  setMinMaxOnSelection(): void {
    if (this.allowMinMaxValidation) {
      const today = new Date();
      const tempMinDate = new Date(this.startDate);
      const tempMaxDate = new Date(tempMinDate.setDate(tempMinDate.getDate() + this.allowDays));
      const diff = this.differenceBetweenTwoDates(today, tempMaxDate);
      if (diff > CONSTANTS.ZERO) {
        this.maxDate = today;
      } else {
        this.maxDate = tempMaxDate;
      }
      this.minDate = new Date(this.startDate);
      this.showCalendar(this.minDate.getMonth(), this.minDate.getFullYear(), CONSTANTS.ONE);
      this.isOnlyStartDate();
      this.showCalendar((this.minDate.getMonth() + CONSTANTS.ONE), this.minDate.getFullYear(), CONSTANTS.TWO);
    }
  }

  initDatepicker(month = null, year = null): void {
    this.isNextButton = true;
    this.isPrevButton = true;
    this.isMinMax = true;
    if (this.isMinMax) {
      this.setMinMax();
    }
    this.firstClk = false;
    this.falseClaim = false;
    this.startDate = (this.startDate) ? this.startDate : null;
    this.endDate = (this.endDate) ? this.endDate : null;
    this.month = CONSTANTS.SHORT_MONTH;
    this.today = new Date();
    this.currentMonth = (month) ? month : this.today.getMonth();
    this.currentYear = (year) ? year : this.today.getFullYear();
    this.showCalendar(this.currentMonth, this.currentYear, CONSTANTS.ONE);
    const currentMnth = (this.currentMonth === CONSTANTS.ELEVEN) ?
      CONSTANTS.ZERO :
      (Number(this.currentMonth) + CONSTANTS.ONE);
    let currentYrs = this.currentYear;
    currentYrs = (this.currentMonth === CONSTANTS.ELEVEN) ?
      (Number(currentYrs) + CONSTANTS.ONE) :
      currentYrs;
    this.showCalendar(currentMnth, currentYrs, CONSTANTS.TWO);
  }

  showCalendar(month, year, type, prev = false): void {
    const firstDay = (new Date(year, month)).getDay();
    const tbl = document.getElementById('calendar-body'); // body of the calendar
    const tbl2 = document.getElementById('calendar-body2'); // body of the calendar
    if (type === CONSTANTS.ONE) {
      tbl.innerHTML = '';
      const firstMonth = document.getElementById('cma-monthName1');
      firstMonth.innerHTML = `${this.month[month]} ${year}`;
    } else if (type === CONSTANTS.TWO) {
      tbl2.innerHTML = '';
      const secondMonth = document.getElementById('cma-monthName2');
      secondMonth.innerHTML = `${this.month[month]} ${year}`;
    }
    this.createCell(tbl, tbl2, month, year, type, prev, firstDay);
    this.preSelectDate();
  }

  createCell(tbl, tbl2, month, year, type, prev, firstDay): void {
    let date = CONSTANTS.ONE;
    for (let i = CONSTANTS.ZERO; i < CONSTANTS.SIX; i++) {
      const row = document.createElement('tr');
      date = this.cellCreation(i, date, row, month, year, type, prev, firstDay);
      if (type === CONSTANTS.ONE) {
        tbl.appendChild(row); // appending each row into calendar body.
      } else if (type === CONSTANTS.TWO) {
        tbl2.appendChild(row); // appending each row into calendar body.
      }
    }
  }

  cellCreation(i, date, row, month, year, type, prev, firstDay): number {
    for (let j = CONSTANTS.ZERO; j < CONSTANTS.SEVEN; j++) {
      if (i === CONSTANTS.ZERO && j < firstDay) {
        const td = document.createElement('td');
        const cell = document.createElement('span');
        const cellText = document.createTextNode('');
        cell.classList.add('cma-available');
        cell.classList.add('cma-blank');
        cell.appendChild(cellText);
        td.appendChild(cell);
        row.appendChild(td);
      } else if (date > this.daysInMonth(month, year)) {
        break;
      } else {
        this.minMaxRangeForCellCreation(row, date, month, year, type, prev);
        date++;
      }
    }
    return date;
  }

  minMaxRangeForCellCreation(row, date, month, year, type, prev): void {
    const td = document.createElement('td');
    const cell = document.createElement('span');
    const cellText = document.createTextNode(date.toString());
    const titleD = `${year}-${Number(month) + Number(CONSTANTS.ONE)}-${date}`;
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('title', titleD);
    cell.setAttribute('aria-label', `${date} ${this.monthFull[month]}`);
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-selected', 'false');
    cell.classList.add('cma-available');
    if (this.isMinMax) {
      this.isMinMaxRange(cell, titleD, prev, type);
    } else {
      cell.addEventListener('click', ($event) => {
        this.selectRange($event);
      });
    }
    const myD = new Date();
    if (date === myD.getDate() && year === myD.getFullYear() && month === myD.getMonth()) {
      cell.classList.add('cma-today');
    } // color today's date
    cell.appendChild(cellText);
    td.appendChild(cell);
    row.appendChild(td);
  }

  preSelectDate(): void {
    if (this.startDate && this.endDate) {
      this.isOnlyStartDate();
      this.isStartDateAndEndDate();
      if (this.startDate && this.endDate) {
        const end = moment(this.endDate);
        const endD = `[title="${end.format('YYYY-M-D')}"]`;
        if (document.querySelector(endD)) {
          document.querySelector(endD).classList.add('activeColor');
        }
        this.setRangeDate();
      }
    }
  }

  isMinMaxRange(cell, titleD, prev, type): void {
    const fallDate = new Date(titleD);
    const maxDate = this.maxDate;
    const minDate = this.minDate;
    if (maxDate && moment(fallDate).isAfter(maxDate, 'day')) {
      cell.classList.add(CONSTANTS.CMA_DISABLED);
      cell.classList.add(CONSTANTS.CMA_NEXT_DISABLED);
      cell.setAttribute('tabindex', '-1');
    }
    if (minDate && moment(fallDate).isBefore(minDate, 'day')) {
      cell.classList.add(CONSTANTS.CMA_DISABLED);
      cell.classList.add(CONSTANTS.CMA_PREV_DISABLED);
      cell.setAttribute('tabindex', '-1');
    }
    const isDiabledClass = cell.classList.contains(CONSTANTS.CMA_DISABLED);
    if (!isDiabledClass) {
      cell.onclick = ($event) => {
        this.selectRange($event);
      };
    }
    if (prev && type === CONSTANTS.ONE) {
      const fallDate2 = new Date(titleD);
      const minDate2 = this.minDate;
      if (minDate && moment(fallDate2).isBefore(minDate2, 'day')) {
        const nextDisable = cell.classList.contains(CONSTANTS.CMA_NEXT_DISABLED);
        const prevDisabled = cell.classList.contains(CONSTANTS.CMA_PREV_DISABLED);
        this.isNextButton = !nextDisable;
        this.isPrevButton = !prevDisabled;
      }
    } else {
      const nextDisable = cell.classList.contains(CONSTANTS.CMA_NEXT_DISABLED);
      const prevDisabled = cell.classList.contains(CONSTANTS.CMA_PREV_DISABLED);
      this.isNextButton = !nextDisable;
      this.isPrevButton = !prevDisabled;
    }
  }

  daysInMonth(iMonth, iYear): number {
    return (CONSTANTS.SPACE_CODE - new Date(iYear, iMonth, CONSTANTS.SPACE_CODE).getDate());
  }

  prevMonth(): void {
    if (this.isPrevButton) {
      this.showCalendar(
        this.currentMonth,
        this.currentYear,
        CONSTANTS.TWO,
        true
      );
      this.currentMonth = (this.currentMonth === CONSTANTS.ZERO) ?
        CONSTANTS.ELEVEN :
        this.currentMonth - CONSTANTS.ONE;
      this.today.setMonth(this.currentMonth);
      this.currentYear = (this.currentMonth === CONSTANTS.ELEVEN) ?
        (this.currentYear - CONSTANTS.ONE) : this.currentYear;
      this.today.setFullYear(this.currentYear);
      this.showCalendar(
        this.currentMonth,
        this.currentYear,
        CONSTANTS.ONE,
        true
      );
      if (this.startDate && !this.endDate) {
        this.isOnlyStartDate();
      } else if (this.startDate && this.endDate) {
        this.isStartDateAndEndDate();
      }
    }
  }

  nextMonth(): void {
    if (this.isNextButton) {
      if (this.inputStartDate) {
        this.today = this.inputStartDate;
      }
      if ((this.today.getMonth()) > CONSTANTS.TEN) {
        this.showCalendar(CONSTANTS.ZERO, (Number(this.currentYear) + Number(CONSTANTS.ONE)), CONSTANTS.ONE);
        this.currentMonth = this.setMonth;
        this.today.setMonth(this.currentMonth);
        this.today.setFullYear(Number(this.currentYear) + Number(CONSTANTS.ONE));
        this.currentYear = Number(this.currentYear) + Number(CONSTANTS.ONE);
        const seconVal = this.currentMonth;
        this.showCalendar((Number(seconVal) + Number(CONSTANTS.ONE)), this.currentYear, CONSTANTS.TWO);
      } else {
        this.today.setMonth(this.currentMonth);
        this.currentMonth = Number(this.currentMonth) + Number(CONSTANTS.ONE);
        this.showCalendar(this.currentMonth, this.currentYear, CONSTANTS.ONE);
        if (this.currentMonth === CONSTANTS.ELEVEN) {
          this.currentMonth = this.setMonth;
          this.today.setMonth(this.currentMonth);
          this.today.setFullYear(Number(this.currentYear) + Number(CONSTANTS.ONE));
          this.currentYear = Number(this.currentYear) + Number(CONSTANTS.ONE);
          this.showCalendar(this.currentMonth, this.currentYear, CONSTANTS.TWO);
        } else {
          this.showCalendar((Number(this.currentMonth) + Number(CONSTANTS.ONE)), this.currentYear, CONSTANTS.TWO);
        }
      }

      if (this.startDate && !this.endDate) {
        this.isOnlyStartDate();
      } else if (this.startDate && this.endDate) {
        this.isStartDateAndEndDate();
      }
    }
  }

  isOnlyStartDate(): void {
    const start = moment(this.startDate);
    const startD = `[title="${start.format('YYYY-M-D')}"]`;
    if (document.querySelector(startD)) {
      document.querySelector(startD).classList.add('activeColor');
    }
  }

  isStartDateAndEndDate(): void {
    const start = moment(this.startDate);
    const startD = `[title="${start.format('YYYY-M-D')}"]`;
    if (document.querySelector(startD)) {
      document.querySelector(startD).classList.add('activeColor');
    }

    const end = moment(this.endDate);
    const endD = `[title="${end.format('YYYY-M-D')}"]`;
    if (document.querySelector(endD)) {
      document.querySelector(endD).classList.add('activeColorend');
    }
    this.setRangeDate();
  }

  selectRange(evt): void {
    switch (this.firstClk) {
      case false:
        this.detachedPreviousDate(evt);
        evt.target.classList.add('activeColor');
        this.startDate = new Date(evt.target.title);
        this.firstClk = true;
        this.setMinMaxOnSelection();
        break;
      case true:
        if (this.falseClaim) {
          this.detachedPreviousDate(evt);
          this.setMinMaxOnSelection();
        } else {
          if (new Date(evt.target.title).getTime() > new Date(this.startDate).getTime()) {
            this.endDate = new Date(evt.target.title);
            this.endDate = new Date(evt.target.title);
            evt.target.classList.add('activeColorend'); // new class
            this.falseClaim = true;
            this.setRangeDate();
            this.setMinMaxOnSelection();
          } else {
            const start = moment(this.startDate);
            const startD = `[title="${start.format('YYYY-M-D')}"]`;
            if (document.querySelector(startD)) {
              document.querySelector(startD).classList.remove('activeColor');
            }
            this.startDate = null;
            this.endDate = null;
            this.firstClk = true;
            evt.target.classList.add('activeColor');
            this.startDate = new Date(evt.target.title);
            this.setMinMaxOnSelection();
          }
        }
        break;
    }
  }

  setRangeDate(): void {
    let start = moment(this.startDate);
    const end   = moment(this.endDate);
    this.endDate = end.toDate();
    start = start.add(CONSTANTS.ONE, 'days');
    while (start.format('M/D/YYYY') !== end.format('M/D/YYYY')) {
      const titleD = `[title="${start.format('YYYY-M-D')}"]`;
      if (document.querySelector(titleD)) {
        document.querySelector(titleD).classList.add('rangeColor');
      }
      start = start.add(CONSTANTS.ONE, 'days');
    }
  }

  detachedPreviousDate(evt): void {
    this.startDate = null;
    this.endDate = null;
    const removeVal =  document.querySelectorAll('.activeColorend');
    removeVal.forEach(element =>
      element.classList.remove('activeColorend')
    );

    const removeVal3 =  document.querySelectorAll('.activeColor');
    removeVal3.forEach(element =>
      element.classList.remove('activeColor')
    );

    const removeVal2 =  document.querySelectorAll('.rangeColor');
    removeVal2.forEach(element =>
      element.classList.remove('rangeColor')
    );
    evt.target.classList.add('activeColor');
    this.startDate = new Date(evt.target.title);
    this.falseClaim = false;
    this.firstClk = true;
  }

  clearDate(): void {
    this.startDate = null;
    this.endDate = null;
    this.inputStartDate = null;
    this.inputEndDate = null;
    this.initDatepicker();
  }

  applyDate(): void {
    this.applyDateEmit.emit({startDate: this.startDate, endDate: this.endDate});
  }

  getName(startDate, endDate): void {
    if (this.isSet && startDate && endDate) {
      setTimeout(() => {
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        this.initDatepicker(this.startDate.getMonth(), this.startDate.getFullYear());
      }, );
      this.isSet = false;
      setTimeout(() => {
        const isPreArroActive = document.querySelector(`[title="${this.startDate.getFullYear()}-${this.startDate.getMonth() + CONSTANTS.ONE}-1"]`);
        const isNextArroActive = document.querySelector(`[title="${this.startDate.getFullYear()}-${this.startDate.getMonth() + CONSTANTS.ONE}-${'30' || '31'}"]`);
        if (isPreArroActive && isPreArroActive.classList.contains(CONSTANTS.CMA_PREV_DISABLED)) {
          this.isPrevButton = false;
        }
        if (isNextArroActive && isNextArroActive.classList.contains(CONSTANTS.CMA_NEXT_DISABLED)) {
          this.isNextButton = false;
        }
      }, CONSTANTS.FIFTY);
    }
    return;
  }
}
