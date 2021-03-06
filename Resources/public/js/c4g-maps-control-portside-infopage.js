// "namespace"
this.c4g = this.c4g || {};
this.c4g.maps = this.c4g.maps || {};
this.c4g.maps.control = this.c4g.maps.control || {};

(function ($, c4g) {
  'use strict';

  /**
   * Constructor
   *
   * @extends {c4g.maps.control.Sideboard}
   *
   * @param  {[type]}  mapController  [description]
   * @param  {[type]}  config         [description]
   */
  c4g.maps.control.Infopage = function (opt_options) {

    // extend options
    this.options = $.extend({
      className: c4g.maps.constant.css.INFOPAGE,
      name: 'infopage',
      headline: c4g.maps.constant.i18n.INFOPAGE,
      create: true,
      mapController: undefined,
      direction: 'left'
    }, opt_options);

    if (!this.options.mapController) {
      return false;
    }

    this.mainSection = document.createElement('div');

    // call parent constructor
    c4g.maps.control.Sideboard.call(this, this.options);
  };
  ol.inherits(c4g.maps.control.Infopage, c4g.maps.control.Sideboard);

  /**
   * Methods
   */
  c4g.maps.control.Infopage.prototype = $.extend(c4g.maps.control.Infopage.prototype, {

    /**
     * Executed when the panel will be opened for the first time.
     * [init description]
     *
     * @return  {boolean}  Returns |true| on success
     */
    init: function () {
      //var infoButton;
      var self = this;

      this.spinner.show();

      this.viewInfopage = this.addInfoView();
      this.viewInfopage.activate();

      var proxy = self.options.mapController.proxy;
      var map = self.options.mapController.map;

      this.mainSectionInfo = document.createElement('p');
      this.mainSectionInfo.innerHTML = self.options.mapController.data.infopage;
      this.mainSection.appendChild(this.mainSectionInfo);
      this.contentContainer.setElement(this.mainSection);

      this.spinner.hide();
      return true;
    }, // end of "init()"


    addInfoView: function () {
      var infoView;

        infoView = this.addView({
        name: 'info',
        triggerConfig: {
          tipLabel: c4g.maps.constant.i18n.INFOPAGE_VIEW_TRIGGER,
          className: c4g.maps.constant.css.INFOPAGE_VIEW_TRIGGER
        },
        sectionElements: [
          {section: this.contentContainer, element: this.mainSection},
          {section: this.bottomToolbar, element: this.viewTriggerBar}
        ]
      });

      return infoView;
    }, // end of "addInfoView()"

    addInfopage: function (options) {
      var self,
          TRIGGER_INFOPAGE,
          viewInfopage,
          source,
          interaction,
          features;

      self = this;

      //TRIGGER_INFOPAGE = 'INFOPAGE_VIEW_TRIGGER_' + options.type.toUpperCase();

      viewInfopage = self.addInfopage({
        name: 'Infopage',
        triggerConfig: {
          tipLabel: 'Infopage',//c4g.maps.constant.i18n[TRIGGER_DRAW],
          className: 'c4g_infopage_trigger',//c4g.maps.constant.css[TRIGGER_DRAW]
        },
        sectionElements: [
          {section: self.bottomToolbar, element: self.viewTriggerBar}
        ],
        initFunction: function () {

          // Show loading animation
          self.spinner.show();

          // printFunction = function (event) {
          //   var infoButton,
          //       featureGeometry,
          //       translateInteraction,
          //       modifyInteraction,
          //       modifyButton,
          //       applyButton;
          //
          //
          //     infoButton = event.target;
          //
          //   // add apply button
          //   applyButton = document.createElement('button');
          //   applyButton.className = c4g.maps.constant.css.ICON + ' ' + c4g.maps.constant.css.EDITOR_FEATURE_APPLY;
          //   applyButton.title = c4g.maps.constant.i18n.EDITOR_FEATURE_APPLY;
          //   applyButton.setAttribute('feat_id', i);
          //
          // }; // end of "modifyFeatureFunction()"

          features = new ol.Collection();

          self.spinner.hide();
          return true;
        },
        activateFunction: function () {
        },
        deactivateFunction: function () {
        }
      });

      return viewInfopage;
    } // end of "addInfopage()"

  });

}(jQuery, this.c4g));