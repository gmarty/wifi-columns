import { View } from 'components/fxos-mvc/dist/mvc';

var template = `
  <input type="button" value="Search" id="get-peers">
  <div id="peers"></div>
  `;

var noPeersTemplate = `
  <input type="button" value="No peers around">
  `;

var peersTemplate = peer => `
  <input type="button" value="${peer.name}\n(${peer.connectionStatus})"
  data-name="${peer.name}"
  data-address="${peer.address}"
  data-connection-status="${peer.connectionStatus}">
  `;

export default
class HomeView extends View {
  constructor(options) {
    console.log('HomeView#constructor()');

    super(options);
  }

  init(controller) {
    console.log('HomeView#init()');

    super(controller);
    this.render();

    this.getPeersList = this.$('#get-peers');
    this.peersList = this.$('#peers');

    this.renderPeer();
  }

  render() {
    console.log('HomeView#render()');

    super();
  }

  template() {
    return template;
  }

  setActive(active) {
    this.el.classList.toggle('active', active);
  }

  // Called whenever settings.peers changes.
  renderPeer(peers = []) {
    console.log('HomeView#renderPeer()', peers);

    // Clear child elements.
    while (this.peersList.firstChild) {
      this.peersList.removeChild(this.peersList.firstChild);
    }

    var htmlContent = '';

    peers.forEach(peer => {
      htmlContent += peersTemplate(peer);
    });

    // None peers can be connected to.
    if (htmlContent === '') {
      htmlContent = noPeersTemplate;
    }

    this.peersList.innerHTML = htmlContent;
  }
}
