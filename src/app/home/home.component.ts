import {AfterViewInit, Component} from '@angular/core';
import axios from "axios";
import {Event} from "../models/event"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  public events: Event[] = [];
  ngAfterViewInit() {

    axios.get("https://streaming.uaibits.com.br:3500/programacao")
      .then((response) => {
        this.events = response.data.data;
      });
  }


}
