import {Channel} from './channel';

export class Pilot {

  nickname: string;

  availableChannels: Array<Channel>;

  recommendedChannel: Channel;

  preferMaximumSeparationFromOthers: boolean;

  minimumSeparationFromOthers: number;
}
