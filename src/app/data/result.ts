import {Channel} from './channel';

export class Result {

  id: number;

  version: number;

  numberOfChannels: number;

  frequencies: string;

  minimumSeparationChannel: number;

  averageSeparationChannel: number;

  minimumSeparationImd: number;

  averageSeparationImd: number;

  channels: Array<Channel>;

}
