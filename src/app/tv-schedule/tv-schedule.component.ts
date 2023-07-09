import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Event, Style} from "../models/event";
import {ColorService} from "../services/colors.service";

@Component({
  selector: 'app-tv-schedule',
  templateUrl: './tv-schedule.component.html',
  styleUrls: ['./tv-schedule.component.scss']
})

export class TvScheduleComponent implements OnChanges, AfterViewInit {

  @ViewChild("time_line_events") timeLineEvents: ElementRef | undefined;
  @ViewChild("schedule") scheduleElement: ElementRef | undefined;
  @ViewChild("hours_title") hoursElement: ElementRef | undefined;
  @ViewChild("date_bar") dateBarElement: ElementRef | undefined;
  @ViewChild("line") lineElement: ElementRef | undefined;
  @Input() public events: any[] = [];

  public scale: number = 0;
  public events_: Map<string, Event[]> = new Map();
  public hours: string[] = [];
  public dates: {
    date: string,
    day: string,
    year: string,
  }[] = [];

  constructor() {
    for (let i = 0; i < 24; i++) {
      this.hours.push(i + ":00");
    }

    var now = new Date();
    for (let i = 0; i < 31; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      this.dates.push({
        date: date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear(),
        day: date.getDate().toString(),
        year: date.getFullYear().toString(),
      });
    }
  }

  ngAfterViewInit() {
    let divWidth = this.timeLineEvents?.nativeElement.offsetWidth;
    this.scale = (60 * 60 * 24) / divWidth;
    let line = this.lineElement?.nativeElement;
    if (line != undefined) {
      let date = new Date();
      date.setHours(0, 0, 0, 0);

      setInterval(() => {
        let now = new Date();
        let diff = now.getTime() - date.getTime();

        line.style.left = (diff / 1000 / this.scale) + "px";
      }, 1000);
    }
    let schedule = this.scheduleElement?.nativeElement;
    let hours_title = this.hoursElement?.nativeElement;
    let date_bar = this.dateBarElement?.nativeElement;
    if (schedule != undefined) {
      schedule.addEventListener("scroll", (event: any) => {
        hours_title.scrollLeft = schedule.scrollLeft;
        date_bar.scrollTop = schedule.scrollTop;
        line.style.top = schedule.scrollTop + "px";
        console.log(line.style.top)
        console.log(schedule.offsetHeight)
      });
    }
  }


  ngOnChanges(changes: SimpleChanges): void {

    for (let event of this.events) {

      let date = new Date(event.startAt);
      date.setHours(0, 0, 0, 0);

      let startAt = new Date(event.startAt);
      let endAt = new Date(event.endAt);
      let duration = (endAt.getTime() - startAt.getTime()) / 1000;
      let width = duration / this.scale;
      let offsetDate = Math.abs((startAt.getTime() - date.getTime()) / 1000 / this.scale);


      let endHour = endAt.getHours().toString().padStart(2, '0');
      let endMinutes = endAt.getMinutes().toString().padStart(2, '0');
      let endSeconds = endAt.getSeconds().toString().padStart(2, '0');
      let endFormat = endHour + ":" + endMinutes + ":" + endSeconds;

      let startHour = startAt.getHours().toString().padStart(2, '0');
      let startMinutes = startAt.getMinutes().toString().padStart(2, '0');
      let startSeconds = startAt.getSeconds().toString().padStart(2, '0');
      let startFormat = startHour + ":" + startMinutes + ":" + startSeconds;
      let eventObj: Event = {
        channel: event.channel,
        name: event.name,
        startAt: startAt,
        endAt: endAt,
        startFormat: startFormat,
        endFormat: endFormat,
        duration: event.duration,
        style: {
          left: offsetDate + "px",
          width: width + "px",
          //gerar background listrado com cores aleatorias usando 45deg para gerar um background listrado
          background: undefined
        }
      };

      let key = startAt.getDate() + "/" + startAt.getMonth() + "/" + startAt.getFullYear();
      if (this.events_.has(key)) {
        this.events_.get(key)?.push(eventObj)
      } else {
        this.events_.set(key, [eventObj]);
      }
    }

    console.log(this.events_)
  }
}
