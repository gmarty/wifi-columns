import { Model } from 'components/fxos-mvc/dist/mvc';

export default
class Settings extends Model {
  constructor() {
    var properties = {
      deviceName: '',
      peers: []
    };
    super(properties);

    this.deviceName = localStorage.getItem('deviceName');
    if (!this.deviceName) {
      this.setDeviceName(this.getRandomName());
    }
  }

  setDeviceName(deviceName) {
    this.deviceName = deviceName;
    localStorage.setItem('deviceName', deviceName);
  }

  getRandomName() {
    var length = 2;
    var base = 36;
    return 'Peer ' + Math.round((Math.random() * Math.pow(base, length)))
        .toString(base)
        .toUpperCase();
  }
}
