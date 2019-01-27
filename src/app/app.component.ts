import {Component, OnInit} from '@angular/core';
import {BandService} from './service/band.service';
import {Band} from './data/band';
import {Pilot} from './data/pilot';
import {isNullOrUndefined} from 'util';
import {ChannelSelection} from './data/channel-selection';
import {RecommendationServiceService} from './service/recommendation-service.service';
import {RecommendationResult} from './data/recommendation-result';

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

  private pilotNumber = 1;


  constructor(private bandService: BandService,
              private recommendationService: RecommendationServiceService) {
  }

  ngOnInit(): void {
    this.bandService.readAllBands().subscribe(response => {
      if (response.status === 0) {
        this.bands = response.data;
        this.bands.forEach(band => {
          band.channels.forEach(channel => {
            channel.band = band;
          });
        });
      } else {
        console.log('No bands ' + response.message);
      }
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
    if (this.pilots.length <= 6) {
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
      this.pilots = this.pilots.splice(index, 1);
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
    this.recommendations = null;
    this.page = 0;

    this.pilots.forEach(pilot => {
      pilot.availableChannels = this.pilotChannelSelection.get(pilot).filter(c => c.selected).map(c => c.channel);
    });

    this.recommendationService.getRecommendations(this.pilots).subscribe(value => {
      console.log(value);
      if (value.status === 0) {
        this.recommendations = value.data;
        this.page = 1;
        this.mainAccordion = 'results';
      }
    });
  }
}
