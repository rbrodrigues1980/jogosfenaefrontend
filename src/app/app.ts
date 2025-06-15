import { Component } from '@angular/core';
import { LoggingService } from './logging.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'jogosfenaefrontend';
  constructor(private logger: LoggingService) {
    this.logger.log('app init');
  }
}
