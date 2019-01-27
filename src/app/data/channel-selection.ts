import {Channel} from './channel';
import {Band} from './band';

export class ChannelSelection {

  channel: Channel;

  band: Band;

  selected: boolean;

  constructor(channel?: Channel, band?: Band) {
    this.channel = channel;
    this.band = band;
  }
}
