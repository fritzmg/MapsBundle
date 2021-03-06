// "namespace"
this.c4g = this.c4g || {};
this.c4g.maps = this.c4g.maps || {};
this.c4g.maps.misc = this.c4g.maps.misc || {};

(function ($, c4g) {
  'use strict';

  /**
   * @TODO
   * [TooltipPopUp description]
   *
   * @constructor
   *
   * @param {Object=} opt_options Control options.
   */
  c4g.maps.misc.TooltipPopUp = function (opt_options) {

    var self,
        addClassName,
        closeButton;

    self = this;
    this.options = opt_options || {};

    // default options
    this.options = $.extend({
      // className: ''
      // closeFunction: null
      // map: null
      horizontal: false,
      closeable: false,
      offset: [1, -1],
      position: [0, 0]
    }, this.options);

    // prepare additional classes
    addClassName = '';
    if (this.options.className) {
      addClassName = ' ' + this.options.className;
    }
    if (this.options.horizontal) {
      addClassName += ' ' + c4g.maps.constant.css.HORIZONTAL;
    }
    if (this.options.closeable) {
      addClassName += ' ' + c4g.maps.constant.css.CLOSEABLE;
    }

    this.element = document.createElement('div');
    this.element.className = c4g.maps.constant.css.TOOLTIP_POPUP + addClassName;

    if (this.options.closeable) {
      closeButton = document.createElement('button');
      closeButton.className = c4g.maps.constant.css.ICON + ' ' + c4g.maps.constant.css.POPUP_CLOSE;
      this.element.appendChild(closeButton);

      $(closeButton).click(function () {
        self.close();
      });
    }

    this.contentContainer = document.createElement('div');
    this.element.appendChild(this.contentContainer);

    this.overlay = new ol.Overlay({
      element: this.element,
      insertFirst: false,
      offset: this.options.offset,
      positioning: 'bottom-left'
    });

    if (this.options.map) {
      this.options.map.addOverlay(this.overlay);
    }

    if (this.options.position) {
      this.overlay.setPosition(this.options.position);
    }
  };

  // Add methods to TooltipPopUp
  c4g.maps.misc.TooltipPopUp.prototype = $.extend(c4g.maps.misc.TooltipPopUp.prototype, {

    close: function () {
      if (typeof this.options.closeFunction === 'function') {
        this.options.closeFunction();
      }

      if (this.options.map) {
        this.options.map.removeOverlay(this.overlay);
      }
    },

    /**
     * @TODO
     * [show description]
     *
     * @return  {[type]}  [description]
     */
    show: function () {
      if ($(this.element).hasClass(c4g.maps.constant.css.HIDE)) {
        $(this.element).removeClass(c4g.maps.constant.css.HIDE);
      }
    },

    /**
     * @TODO
     * [hide description]
     *
     * @return  {[type]}  [description]
     */
    hide: function () {
      if (!$(this.element).hasClass(c4g.maps.constant.css.HIDE)) {
        $(this.element).addClass(c4g.maps.constant.css.HIDE);
      }
    },

    /**
     * @TODO
     * [getContent description]
     *
     */
    getContent: function () {
      return this.contentContainer.innerHTML;
    },

    /**
     * @TODO
     * [getPosition description]
     *
     */
    getPosition: function () {
      return this.overlay.getPosition();
    },

    /**
     * @TODO
     * [setContent description]
     *
     * @param  {[type]}  content  [description]
     */
    setContent: function (content) {
      this.contentContainer.innerHTML = content;
    },

    /**
     * @TODO
     * [setPosition description]
     *
     * @param  {[type]}  coordinates  [description]
     */
    setPosition: function (coordinates) {
      this.overlay.setPosition(coordinates);
    }

  }); // End of "add methods to TooltipPopUp"

}(jQuery, this.c4g));