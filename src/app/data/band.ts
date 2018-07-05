import {Channel} from './channel';

export class Band {

  id: number;

  version: number;

  name: string;

  description: string;

  preselected: boolean;

  channels: Array<Channel>;

}
