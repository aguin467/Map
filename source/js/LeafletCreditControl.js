import L from 'leaflet';

/* eslint-disable no-underscore-dangle */
L.controlCredits = (options) => new L.CreditsControl(options);

L.CreditsControl = L.Control.extend({
  options: {
    position: 'bottomright',
  },
  initialize(options) {
    if (!options.text) throw new Error('L.CreditsControl missing required option: text');
    if (!options.image) throw new Error('L.CreditsControl missing required option: image');
    if (!options.link) throw new Error('L.CreditsControl missing required option: link');

    L.setOptions(this, options);
  },
  onAdd(map) {
    this._map = map;

    /* eslint-disable */
    // create our container, and set the background image
    let containerDom = L.DomUtil.create('div', 'leaflet-credits-control');
    /* eslint-enable */
    containerDom.style.backgroundImage = `url(${this.options.image})`;
    if (this.options.width) containerDom.style.paddingRight = `${this.options.width}px`;
    if (this.options.height) containerDom.style.height = `${this.options.height}px`;

    // generate the hyperlink to the left-hand side
    const link = L.DomUtil.create('a', '', containerDom);
    link.target = '_blank';
    link.href = this.options.link;
    link.innerHTML = this.options.text;

    // create a linkage between this control and the hyperlink bit,
    // since we will be toggling CSS for that hyperlink section
    containerDom.link = link;

    // clicking the control (the image bit) expands the left-hand hyperlink/text bit
    L.DomEvent
      .addListener(containerDom, 'mousedown', L.DomEvent.stopPropagation)
      .addListener(containerDom, 'click', L.DomEvent.stopPropagation)
      .addListener(containerDom, 'dblclick', L.DomEvent.stopPropagation)
      .addListener(containerDom, 'click', () => {
        /* eslint-disable */
        const { link } = this;
        /* eslint-enable */
        if (L.DomUtil.hasClass(link, 'leaflet-credits-showlink')) {
          L.DomUtil.removeClass(link, 'leaflet-credits-showlink');
        } else {
          L.DomUtil.addClass(link, 'leaflet-credits-showlink');
        }
      });

    // afterthought keep a reference to our container and to the link,
    // in case we need to change their content later via setText() et al
    /* eslint-disable no-underscore-dangle */
    this._container = containerDom;
    this._link = link;

    // all done
    return containerDom;
  },
  setText(html) {
    this._link.innerHTML = html;
  },
});
