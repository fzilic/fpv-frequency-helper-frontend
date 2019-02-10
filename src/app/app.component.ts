import {Component, OnInit} from '@angular/core';
import {BandService} from './service/band.service';
import {Band} from './data/band';
import {Pilot} from './data/pilot';
import {isNullOrUndefined} from 'util';
import {ChannelSelection} from './data/channel-selection';
import {RecommendationServiceService} from './service/recommendation-service.service';
import {RecommendationResult} from './data/recommendation-result';
import {NgxSpinnerService} from 'ngx-spinner';
import {Alert} from './data/alert';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public mainAccordion = 'pilots';

  public subAccordion: string;

  public bands: Array<Band>;

  public pilots: Array<Pilot> = [];

  public pilotChannelSelection = new Map<Pilot, Array<ChannelSelection>>();

  public recommendations: Array<RecommendationResult>;

  public page = 0;

  public processing = false;

  public alerts: Array<Alert> = [];

  public showHelp = false;

  private pilotNumber = 1;


  constructor(private bandService: BandService,
              private recommendationService: RecommendationServiceService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.bandService.readAllBands().subscribe(response => {
      if (response.status === 0) {
        this.bands = response.data;
        this.bands.forEach(band => {
          band.channels.forEach(channel => {
            channel.band = band;
          });
        });
      } else {
        this.showAlert('No data received from server', 'warning', 2000);
      }
      this.spinner.hide();
    }, error => {
      this.showAlert('No data received from server', 'warning', 2000);
      this.spinner.hide();
    });
  }

  activeBands(): Array<Band> {
    return this.bands.filter(band => {
      return band.preselected;
    });
  }

  activeBandsString(): string {
    if (isNullOrUndefined(this.bands)) {
      return '';
    } else {
      return '(' + this.bands
        .filter(band => {
          return band.preselected;
        })
        .map(band => {
          return band.name;
        }).join(',') + ')';
    }
  }

  addPilot(): void {
    if (this.pilots.length < 6) {
      const pilot = new Pilot();
      pilot.nickname = 'Pilot ' + (this.pilotNumber++);

      this.pilotChannelSelection.set(pilot, []);

      this.bands.filter(band => {
        return band.preselected;
      }).forEach(band => {
        band.channels.forEach(channel => {
          this.pilotChannelSelection.get(pilot).push(new ChannelSelection(channel, band));
        });
      });

      this.pilots.push(pilot);
    }
  }

  removePilot(pilot: Pilot) {
    const index = this.pilots.indexOf(pilot);
    if (index > -1) {
      this.pilots.splice(index, 1);
    }
  }

  channelSelectionForBand(all: Array<ChannelSelection>, band: Band): Array<ChannelSelection> {
    return all.filter(value => value.band.id === band.id);
  }

  isAllChecked(pilot: Pilot, band: Band): boolean {
    return this.pilotChannelSelection.get(pilot).filter(value => value.band.id === band.id).every(value => value.selected);
  }

  checkAll(pilot: Pilot, band: Band) {
    const areChecked = this.isAllChecked(pilot, band);
    this.pilotChannelSelection.get(pilot).filter(value => value.band.id === band.id).forEach(value => {
      value.selected = !areChecked;
    });
  }

  execute() {
    this.processing = true;
    this.recommendations = null;
    this.page = 0;

    if (isNullOrUndefined(this.pilots) || this.pilots.length < 2) {
      this.showAlert('You need at least two pilots', 'danger');
    }

    this.pilots.forEach(pilot => {
      if (isNullOrUndefined(this.pilotChannelSelection.get(pilot))
        || this.pilotChannelSelection.get(pilot).filter(c => c.selected).length < 1) {
        this.showAlert(pilot.nickname + ' has to have at least one channel', 'danger');
      }
    });

    if (this.alerts.length > 0) {
      this.processing = false;
      return;
    }

    this.pilots.forEach(pilot => {
      pilot.availableChannels = this.pilotChannelSelection.get(pilot).filter(c => c.selected).map(c => c.channel);
    });

    this.spinner.show();
    this.recommendationService.getRecommendations(this.pilots).subscribe(value => {
      // this.spinner.hide();
      if (value.status === 0) {
        this.recommendations = value.data;
        this.page = 1;
        this.mainAccordion = 'results';
      } else {
        this.recommendations = [];
        this.page = 0;
        this.mainAccordion = 'pilots';
        this.showAlert('Could not find recommendation', 'info', 5000);
      }
      this.spinner.hide();
      this.processing = false;
    }, error => {
      this.processing = false;
      this.showAlert('No data received from server', 'warning', 2000);
      this.spinner.hide();
    });
  }

  close(alert: Alert) {
    const index = this.alerts.indexOf(alert);
    if (index > -1) {
      this.alerts.splice(index, 1);
    }
  }

  private showAlert(message: string, type: string = 'warning', timeout: number = 5000) {
    const e = new Alert(message, type);

    if (this.alerts.filter(a => a.text === message).length === 0) {
      this.alerts.push(e);
      setTimeout(() => {
        this.close(e);
      }, timeout);

    }
  }

  updatePilotMaximumSeparation(pilot: Pilot) {
    this.pilots.filter(p => p !== pilot).forEach(p => p.preferMaximumSeparationFromOthers = false);
    pilot.preferMaximumSeparationFromOthers = !pilot.preferMaximumSeparationFromOthers;
  }
}
