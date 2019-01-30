export class Alert {

  text: string;

  type: string;

  constructor(text: string, type: string = 'warning') {
    this.text = text;
    this.type = type;
  }
}
