import { Model } from 'components/fxos-mvc/dist/mvc.js';

export default
class Settings extends Model {
  constructor() {
    var properties = {
      peerName: '',
      peers: []
    };
    super(properties);

    this.peerName = localStorage.getItem('peerName');
    if (!this.peerName) {
      this.setPeerName(this.getRandomPeerName());
    }
  }

  setPeerName(peerName) {
    this.peerName = peerName;
    localStorage.setItem('peerName', peerName);
  }

  getRandomPeerName() {
    var length = 2;
    var base = 36;
    return 'Peer ' + Math.round((Math.random() * Math.pow(base, length)))
        .toString(base)
        .toUpperCase();
  }
}
