import {Component, OnInit} from '@angular/core';
import {BandService} from './service/band.service';
import {Band} from './data/band';
import {Pilot} from './data/pilot';
import {isNullOrUndefined} from 'util';
import {Channel} from './data/channel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private bands: Array<Band>;

  private pilots: Array<Pilot> = [];

  private pilotNumber: number = 1;

  public mainAccordion: string = 'pilots';

  public subAccordion: string;

  constructor(private bandService: BandService) {
  }

  ngOnInit(): void {
    this.bandService.readAllBands().subscribe(bandsResponse => {
      if (bandsResponse.status === 0) {
        this.bands = bandsResponse.data.map(band => {
          band.channels.forEach(channel => {
            channel.band = band;
          });
          return band;
        });
      } else {
        console.log('No bands ' + bandsResponse.message);
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
    }
    else {
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
    let pilot = new Pilot();
    pilot.nickname = 'Pilot ' + (this.pilotNumber++);
    this.pilots.push(pilot);
  }

  removePilot(pilot: Pilot) {
    let index = this.pilots.indexOf(pilot);
    if (index > -1) {
      this.pilots.splice(index, 1);
    }
  }

  onChannelSelectionChange(pilot: Pilot, channel: Channel, event) {
    if (isNullOrUndefined(pilot.availableChannels)){
      pilot.availableChannels = []
    }

    if (event.target.checked) {
      pilot.availableChannels.push(channel)
    }
    else {
      let index = pilot.availableChannels.indexOf(channel);
      if (index > -1) {
        pilot.availableChannels.splice(index, 1);
      }
    }
  }
}
