// "namespace"
this.c4g = this.c4g || {};
this.c4g.maps = this.c4g.maps || {};

(function ($, c4g) {
  'use strict';

  /**
   * c4g-Maps utility functions
   */
  c4g.maps.utils = $.extend(c4g.maps.utils, {
    /**
     *  Converts the first letter of a given string to uppercase, leaving the remaining string untouched.
     *
     *  @param    {string}    the string to capitalize
     *
     *  @return   {string}    the capitalized string
     */
    capitalizeFirstLetter: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },


    /**
     * Generate an unique id.
     *
     * The id is 9 characters long and prefixed with an underscore.
     *
     * @return  {string}  The generated id.
     */
    getUniqueId: function () {
      // Math.random should be unique because of its seeding algorithm.
      // Convert it to base 36 (numbers + letters), and grab the first 9 characters
      // after the decimal.
      return '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Encode input strings for GeoJSON-Objects properly,
     * so they will not break the Code.
     * Transforms:
     *   \ -> \\;
     *   " -> '';
     *   Ä -> &Auml;
     *   ä -> &auml;
     *   Ö -> &Ouml;
     *   ö -> &ouml;
     *   Ü -> &Uuml;
     *   ü -> &uuml;
     *
     * @param   {string}  input  [description]
     *
     * @return  {string}         [description]
     */
    encodeGeoJsonProperty: function (input) {
      var output;

      if (!input) {
        return '';
      }

      output = input.replace(
          /\\/g, '\\\\'
      ).replace(
          /\"/g, '\'\''
      ).replace(
          /Ä/g, '&Auml;'
      ).replace(
          /ä/g, '&auml;'
      ).replace(
          /Ö/g, '&Ouml;'
      ).replace(
          /ö/g, '&ouml;'
      ).replace(
          /Ü/g, '&Uuml;'
      ).replace(
          /ü/g, '&uuml;'
      );

      return output;
    }, // end of encodeGeoJsonProperty()

    /**
     * Decode input strings for GeoJSON-Objects properly,
     * so they will be displayed correctly.
     * Transforms:
     *   \\     -> \;
     *   ''     -> ";
     *   &Auml; -> Ä
     *   &auml; -> ä
     *   &Ouml; -> Ö
     *   &ouml; -> ö
     *   &Uuml; -> Ü
     *   &uuml; -> ü
     *
     * @param   {string}  input  [description]
     *
     * @return  {string}         [description]
     */
    decodeGeoJsonProperty: function (input) {
      var output;

      if (!input) {
        return '';
      }
      if (typeof input !== "string") {
        input = input + "";
      }

      output = input.replace(
          /\\\\/g, '\\'
      ).replace(
          /\'\'/g, '\"'
      ).replace(
          /&Auml;/g, 'Ä'
      ).replace(
          /&auml;/g, 'ä'
      ).replace(
          /&Ouml;/g, 'Ö'
      ).replace(
          /&ouml;/g, 'ö'
      ).replace(
          /&Uuml;/g, 'Ü;'
      ).replace(
          /&uuml;/g, 'ü'
      );

      return output;
    }, // end of decodeGeoJsonProperty()

    /**
     * Create or replace an URL-parameter.
     *
     * If `opt_getKey` is `false` or `undefined` the given parameter, `param`,
     * will be applied as "hash-parameter".
     * e.g.:
     *   https://myurl.de:port/path/to/maps#param
     * Note, that already existing "hash-parameters" will be overriden,
     * whereas existing "GET-parameters" stay untouched.
     *
     * If `opt_getKey` is set, it will be applied as "GET-parameter".
     * e.g.:
     *   https://myurl.de:port/path/to/maps?opt_getKey=param
     * If the key described by `opt_getKey` is already existing, its value will be overriden,
     * otherwise the key-value-pair will be appended appropriatly.
     * Already existing "hash-parameters" will stay untouched.
     *
     * If `opt_execute` is `false` or `undefined`, the function will return the new link as `string`,
     * otherwise the "href/location" will be changed directly in the browser, which can cause a pagereload.
     *
     * @param  {string}                    param        [description]
     * @param  {undefined|boolean|string}  opt_getKey   Default: `undefined`
     * @param  {undefined|boolean}         opt_execute  Default: `undefined`
     */
    setUrlParam: function (param, opt_getKey, opt_execute) {
      var link,
          searchParam,
          paramReplaced,
          i;

      if (typeof param === undefined) {
        return false;
      }

      link = location.origin + location.pathname;

      if (!opt_getKey) {
        // use hash-parameter
        if (opt_execute) {
          location.hash = param;
          return true;
        }
        link += location.search + '#' + param;
      } else {
        // use GET-parameter
        if (location.search) {
          // there are already search-parameters
          paramReplaced = false;
          opt_getKey = opt_getKey.toLowerCase();
          // replace parameter if already existent
          searchParam = location.search.replace(
              /([^=\?\&]+)=([^&]+)/gi,
              function (match, key, value, offset, originString) {
                if (key === opt_getKey) {
                  paramReplaced = true;
                  return key + '=' + param;
                }
                return match;
              }
          );
          // otherwise append as new parameter
          if (!paramReplaced) {
            searchParam += '&' + opt_getKey + '=' + param;
          }
        } else {
          // this will be the only search-parameter in the URL
          searchParam = '?' + opt_getKey + '=' + param;
        }
        if (opt_execute) {
          location.search = searchParam;
          return true;
        }
        link += searchParam + location.hash;
      }

      return link;
    }, // end of setUrlParam()

    /**
     * Get search or hash URL-parameter as string.
     *
     * If `opt_getKey` is `false` or `undefined`, the hash-parameter of the URL is returned,
     * otherwise it will search for a GET-parameter and return its value.
     *
     * If a parameter is not existent, or empty, an empty string will be returned.
     *
     * @param   {undefined|string}  opt_getKey  Default: `undefined`
     *
     * @return  {string}                        The found parameter.
     */
    getUrlParam: function (opt_getKey) {
      var param,
          regEx;

      if (!opt_getKey) {
        param = location.hash.substring(1);
      } else {
        if (!location.search) {
          param = '';
        } else {
          regEx = new RegExp('[\?\&]' + opt_getKey + '=([^&]+)', 'i');
          param = regEx.exec(location.search);
          param = param ? param[1] : '';
        }
      }

      return param;
    }, // end of getUrlParam()

    /**
     * Delta-encode an array of numbers.
     * Note that the array will be sorted (lowest to highest)
     * before encoding.
     *
     * So after the encoding the first value of the output contains
     * the smallest number of the set and each following number just
     * represents the offset to its previous neighbor.
     *
     * This is mostly efficient for high numbers, that are "close to each other".
     *
     * Example:
     *   [1337, 11, 101, 123, 96, 69, 42, 42]
     *   will be sorted
     *   [11, 42, 42, 69, 96, 101, 123, 1337]
     *   and encoded to
     *   [11, 31, 0, 27, 27, 5, 22, 1214]
     *
     * @param   {array<numbers>}  arrInput  [description]
     *
     * @return  {array<numbers>}            [description]
     */
    deltaEncode: function (arrInput) {
      var arrOutput,
          i;

      if (!arrInput) {
        return [];
      }
      if (arrInput.length === 1) {
        return arrInput;
      }

      arrInput.sort(function (a, b) {
        return a - b;
      });

      arrOutput = [];
      arrOutput[0] = arrInput[0];
      for (i = 1; i < arrInput.length; i += 1) {
        arrOutput[i] = arrInput[i] - arrInput[i - 1];
      }

      return arrOutput;

    }, // end of deltaEncode()

    /**
     * Decode a delta-encoded array.
     * See `deltaEncode` function for more detailed information.
     *
     * @param   {array<numbers>}  arrInput  [description]
     *
     * @return  {array<numbers>}            [description]
     */
    deltaDecode: function (arrInput) {
      var arrOutput,
          i;

      if (!arrInput) {
        return [];
      }

      arrOutput = [];
      arrOutput[0] = parseInt(arrInput[0], 10);
      if (isNaN(arrInput[0])) {
        return [];
      }
      for (i = 1; i < arrInput.length; i += 1) {
        arrOutput[i] = parseInt(arrInput[i], 10) + arrOutput[i - 1];
        if (isNaN(arrOutput[i])) {
          return [];
        }
      }

      return arrOutput;

    }, // end of deltaDecode()

    /**
     * Check and call functions in `arrHookFunctions` with given `parameters`.
     *
     * @param   {array<function>}   arrHookFunctions  [description]
     * @param   {mixed}             parameters        [description]
     */
    callHookFunctions: function (arrHookFunctions, parameters) {
      var j;

      if (arrHookFunctions && arrHookFunctions.length > 0) {
        for (j = 0; j < arrHookFunctions.length; j += 1) {
          if (typeof arrHookFunctions[j] === 'function') {
            arrHookFunctions[j](parameters);
          }
        }
      }
    }, // end of "callHookFunctions()"

    /**
     * Convert a hex-formated color value into rgba()-format.
     *
     * @param   {string|number}  hex          [description]
     * @param   {string|number}  opt_opacity  [description]
     *
     * @return  {string}                      [description]
     */
    getRgbaFromHexAndOpacity: function (hex, opt_opacity) {

      var bigint, r, g, b, a;

      bigint = parseInt(hex, 16);

      if (opt_opacity && typeof opt_opacity !== 'number') {
        if (typeof opt_opacity === 'object' && opt_opacity.value) {
          opt_opacity = opt_opacity.value;
        } else {
          opt_opacity = 100;
        }
      }

      r = (bigint >> 16) & 255;
      g = (bigint >> 8) & 255;
      b = bigint & 255;
      a = opt_opacity ? (opt_opacity / 100) : 1;

      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    },

    /**
     * Reduce a defined style, to a simpler version.
     *
     * The reduced style is the first style of the defined styleset,
     * with a 1px thick stroke and a circle with a 5px radius.
     *
     * This can be used to display additional geometries with a main-geometry,
     * without having to define a whole new style.
     *
     * @param   {number|string}           styleId  [description]
     *
     * @return  {array<ol.style.Style>}            [description]
     */
    reduceStyle: function (styleId) {
      var style,
          reducedStyle,
          fillStyle,
          strokeStyle;

      if (!c4g.maps.locationStyles[styleId] || !c4g.maps.locationStyles[styleId].style) {
        return [];
      }

      style = c4g.maps.locationStyles[styleId].style()[0];

      fillStyle = style.getFill();
      strokeStyle = style.getStroke();
      strokeStyle.setWidth(1);

      reducedStyle = new ol.style.Style({
        image: new ol.style.Circle({
          fill: fillStyle,
          stroke: strokeStyle,
          radius: 5
        }),
        // text: style.getText(),
        stroke: strokeStyle,
        fill: fillStyle
      });

      return [reducedStyle];
    }, // end of "reduceStyle"

    /**
     * Measure the dimensions of the given geometry.
     *
     * If the geometry is a `LineString` the function will measure its length,
     * is it a `Polygon` it will measure the acreage,
     * otherwise it will return `0`.
     *
     * If the optional `opt_forceLineMeasure` parameter is `true`
     * and the geometry is a `Polygon` it will measure its perimeter instead
     * of its acreage.
     *
     * @param   {ol.geom.LineString|ol.geom.Polygon}   geometry              [description]
     * @param   {undefined|boolean}                    opt_forceLineMeasure  [description]
     *
     * @return  {array<string>|number}                                       [description]
     */
    measureGeometry: function (geometry, opt_forceLineMeasure) {
      var value,
          sphere,
          coordinates,
          coord1,
          coord2,
          result,
          i;

      if (!geometry) {
        return false;
      }

      sphere = new ol.Sphere(6378137);
      result = {};

      if (geometry instanceof ol.geom.LineString || (geometry instanceof ol.geom.Polygon && opt_forceLineMeasure)) {

        coordinates = geometry.getCoordinates();
        if (geometry instanceof ol.geom.Polygon) {
          coordinates = coordinates[0];
        }
        value = 0;
        for (i = 0; i < coordinates.length - 1; i += 1) {
          coord1 = ol.proj.transform(coordinates[i], 'EPSG:3857', 'EPSG:4326');
          coord2 = ol.proj.transform(coordinates[i + 1], 'EPSG:3857', 'EPSG:4326');
          value += sphere.haversineDistance(coord1, coord2);
        }
        result.rawValue = (Math.round(value * 100) / 100).toFixed(2);
        if (value > 1000) {
          result.htmlValue = (Math.round(value / 1000 * 100) / 100).toFixed(2) +
              ' ' + 'km';
        } else {
          result.htmlValue = result.rawValue +
              ' ' + 'm';
        }

      } else if (geometry instanceof ol.geom.Polygon) {
        geometry = /** @type {ol.geom.Polygon} */(geometry.clone().transform('EPSG:3857', 'EPSG:4326'));
        coordinates = geometry.getLinearRing(0).getCoordinates();
        value = Math.abs(sphere.geodesicArea(coordinates));
        result.rawValue = (Math.round(value * 100) / 100).toFixed(2);
        if (value > 10000) {
          result.htmlValue = (Math.round(value / 1000000 * 100) / 100).toFixed(2) +
              ' ' + 'km<sup>2</sup>';
        } else {
          result.htmlValue = result.rawValue +
              ' ' + 'm<sup>2</sup>';
        }

      } else if (geometry instanceof ol.geom.Circle) {
          var center = geometry.getCenter();
          var radius = geometry.getRadius();
          var edgeCoordinate = [center[0] + radius, center[1]];
          var wgs84Sphere = new ol.Sphere(6378137);
          var value = wgs84Sphere.haversineDistance(
              ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326'),
              ol.proj.transform(edgeCoordinate, 'EPSG:3857', 'EPSG:4326')
          );

          result.rawValue = (Math.round(value * 100) / 100).toFixed(2);
          if (result.rawValue > 10000) {
              result.htmlValue = (Math.round((value * 100) / 100) / 1000).toFixed(2) +
                  ' ' + 'km';
          } else {
              result.htmlValue = result.rawValue +
                  ' ' + 'm';
          }
      } else {
        result = 0;
      }

      return result;
    },

    /**
     * Calculate extent for an array of geometries.
     *
     * @param   {Array.<ol.geom.simpleGeometry>}  arrGeometries  [description]
     *
     * @return  {ol.Extent}                                      [description]
     */
    getExtentForGeometries: function (arrGeometries) {
      var extentSource;

      if (!arrGeometries) {
        console.warn('Geometries missing for extent calculation');
        return false;
      }

      extentSource = new ol.source.Vector();
      extentSource.addFeatures(arrGeometries);

      return extentSource.getExtent() || ol.Extent([0, 0, 0, 0]);
    }, // end of getExtentForGeometries()

    /**
     * Fit view of `map` to a given array of `extents`.
     * Animated if `opt_animationDuration` is an integer > 0.
     *
     * @param   {object}     extents                 [description]
     * @param   {ol.Map}     map                    [description]
     * @param   {integer}    opt_animationDuration  [description]
     *
     * @return  {boolean}                           [description]
     */
    fitToExtents: function (extents, map, opt_padding, opt_animationDuration) {
      var view,
          padding,
          extent,
          key;

      if (!extents || !map) {
        console.warn('Missing extent or map for fitExtent');
        return false;
      }
      //extent = ol.extent.createEmpty();

      for (key in extents) {
        if (extents.hasOwnProperty(key)) {
          if (typeof extent === "undefined") {
            extent = extents[key];
          } else {
            ol.extent.extend(extent, extents[key])
          }
        }
      }

      this.fitToExtent(extent, map, opt_padding, 5, 0, 0, 2);


    }, // end of fitToExtents

    /**
     * Fit view of `map` to a given `extent`.
     * Animated if `opt_animationDuration` is an integer > 0.
     *
     * @param   {ol.Extent}  extent                 [description]
     * @param   {ol.Map}     map                    [description]
     * @param   {array}      opt_padding            [description]
     * @param   {integer}    opt_animationDuration  [description]
     * @param   {integer}    opt_minZoom            [description]
     * @param   {integer}    opt_maxZoom            [description]
     * @param   {integer}    opt_minResolution      [description]
     *
     * @return  {boolean}                           [description]
     */
    fitToExtent: function (extent, map, opt_padding, opt_animationDuration, opt_minZoom, opt_maxZoom, opt_minResolution) {
      var view,
          padding,
          fitOptions;

      if (!extent || !map) {
        console.warn('Missing extent or map for fitExtent');
        return false;
      }

      view = map.getView();

      fitOptions = {
        'padding': opt_padding || [25, 25, 25, 25]
      };

      if (opt_minResolution && opt_minResolution > 0) {
        fitOptions.minResolution = opt_minResolution;
      }

      if (opt_minZoom && opt_minZoom >= 0) {
        fitOptions.minZoom = opt_minZoom;
      }

      if (opt_maxZoom && opt_maxZoom >= 0) {
        fitOptions.maxZoom = opt_maxZoom;
      }

      // animate the "fitting" when a duration is given and its greater than 0
      if (opt_animationDuration && opt_animationDuration > 0) {
        view.animate({
          start: +new Date(),
          duration: opt_animationDuration,
          resolution: view.getResolution(),
          center: [0, 0]
          //rotation: Math.PI
        });
        // map.beforeRender(
        //     ol.animation.pan({
        //       start: +new Date(),
        //       duration: opt_animationDuration,
        //       source: view.getCenter()
        //     }),
        //     ol.animation.zoom({
        //       start: +new Date(),
        //       duration: opt_animationDuration,
        //       resolution: view.getResolution()
        //     })
        // );
      }

      try {
        view.fit(extent, map.getSize(), {padding: [25, 25, 25, 25]});
        //view.fit(extent, map.getSize());
        //view.setZoom(view.getZoom()-1);
        return true;
      } catch (e) {
        return false;
      }
    }, // end of fitToExtent()

    /**
     * Convenience function to run all placeholder functions at once.
     *
     * @param   {string}                      strInput   [description]
     * @param   {ol.Feature}                  feature    [description]
     * @param   {ol.layer.Layer | undefined}  opt_layer  [description]
     *
     * @return  {string}                                 [description]
     */
    replaceAllPlaceholders: function (strInput, feature, opt_layer) {
      var strOutput;

      // only check the first two parameters as they will be used by all placeholder-functions
      // -> for performance
      if (!strInput || !feature) {
        return strInput;
      }

      strOutput = this.replaceFunctionPlaceholders(strInput, feature, opt_layer);
      strOutput = this.replaceEditorVarsPlaceholders(strOutput, feature);
      strOutput = this.replaceAttributePlaceholders(strOutput, feature);

      return strOutput;
    }, // end of replaceAllPlaceholders()

    /**
     * Replace every occurance of `${FNfunctionName}`, in `strInput`,
     * with the result of `window.functionName(feature, style)`, if it exist.
     * Otherwise the placeholder will be simply removed (/replaced with '').
     * Style will be taken either from the feature, or the layer.
     *
     * @param   {string}          strInput  [description]
     * @param   {ol.Feature}      feature   [description]
     * @param   {ol.layer.Layer}  layer     [description]
     *
     * @return  {string}                    [description]
     */
    replaceFunctionPlaceholders: function (strInput, feature, layer) {
      var strOutput;

      if (!strInput || !feature || !layer) {
        return strInput;
      }

      strOutput = strInput.replace(
          /\$\{FN([^\}]*)\}/g,
          function (match, functionName, offset, originString) {
            var style;

            // check if function exists
            if (typeof window[functionName] === 'function') {
              // search style
              if (typeof feature.getStyle === 'function' && feature.getStyle() && typeof feature.getStyle() === 'function') {
                style = feature.getStyle();
              } else if (typeof layer.getStyle === 'function' && layer.getStyle()) {
                style = layer.getStyle();
              } else {
                return '';
              }
              return window[functionName](feature, style);
            }
            return '';
          }
      ); // end of replace()

      return strOutput;
    }, // end of replaceFunctionPlaceholders()

    /**
     * Replace placeholders, in `strInput`, for variables set by the geoEditor.
     * Valid placeholders are: ([key] represents the stringname of the variables key)
     *   `${EL[key]}`   =>  Label for the variable
     *   `${EVL[key]}`  =>  Label for the variable, if a value is set too
     *   `${EV[key]}`   =>  Value of the variable
     *   `${EVV[key]}`  =>  Same as `${EV[key]}`
     *
     * If no appropriate value can be found for a placeholder
     * it will simply be removed (/replaced with '').
     *
     * @param   {string}      strInput  [description]
     * @param   {ol.Feature}  feature   [description]
     *
     * @return  {string}                [description]
     */
    replaceEditorVarsPlaceholders: function (strInput, feature) {
      var strOutput;

      if (!strInput || !feature || typeof feature.get !== 'function') {
        return strInput;
      }

      strOutput = strInput.replace(
          /\$\{(EV?[LV])([^\}]*)\}/g,
          function (match, type, evKey, offset, originString) {
            var editorVars,
                i;

            // check if feature has editorVars
            if (feature.get('editorVars')) {
              editorVars = feature.get('editorVars');
              // search for editorVar with key == evKey
              for (i = 0; i < editorVars.length; i += 1) {
                if (editorVars[i].key === evKey) {
                  // if type is 'EVL' display label only if a value is set too
                  if (type === 'EL' || (type === 'EVL' && editorVars[i].value)) {
                    return editorVars[i].label;
                  } else {
                    return editorVars[i].value;
                  }
                }
              }
            }
            return '';
          }
      ); // end of replace()

      return strOutput;
    }, // end of replaceEditorVarsPlaceholders()

    /**
     * Replace every occurance of `${attr}`, in `strInput`,
     * with the result of `feature.get(attr)`, if it exist.
     * Otherwise the placeholder will be simply removed (/replaced with '').
     *
     * @param   {string}      strInput  [description]
     * @param   {ol.Feature}  feature   [description]
     *
     * @return  {string}                [description]
     */
    replaceAttributePlaceholders: function (strInput, feature) {
      var strOutput;

      if (!strInput || !feature || typeof feature.get !== 'function') {
        return strInput;
      }

      strOutput = strInput.replace(
          /\$\{([^\}]*)\}/g,
          function (match, attr, offset, originString) {
            return feature.get(attr) || '';
          }
      ); // end of replace()

      return strOutput;
    }, // end of replaceAttributePlaceholders()

    objectToArray: function (object) {
      if (object && typeof object === 'object') {
        object = Object.keys(object).map(function (key) {
          return object[key];
        });
      }
      return object;
    }, // end of objectToArray()

    redrawMapView: function (mapController) {
      var mapData = mapController.data;
      var controlContainerTopLeft = document.createElement('div');
      controlContainerTopLeft.className = c4g.maps.constant.css.CONTROL_CONTAINER_TL + ' ' + c4g.maps.constant.css.OL_UNSELECTABLE;
      mapController.$overlaycontainer_stopevent.prepend(controlContainerTopLeft);

      var controlContainerBottomLeft = document.createElement('div');
      controlContainerBottomLeft.className = c4g.maps.constant.css.CONTROL_CONTAINER_BL + ' ' + c4g.maps.constant.css.OL_UNSELECTABLE;
      $(controlContainerTopLeft).after(controlContainerBottomLeft);
      mapController.leftSlideElements.push(controlContainerBottomLeft);

      var controlContainerBottomLeftSub = document.createElement('div');
      controlContainerBottomLeftSub.className = c4g.maps.constant.css.CONTROL_CONTAINER_BL_SUB + ' ' + c4g.maps.constant.css.OL_UNSELECTABLE;

      if (mapData.scaleline) {
        mapController.map.removeControl(mapController.controls.scaleline);
        mapController.controls.scaleline = new ol.control.ScaleLine({
          mapView: mapController.map.getView(),
          target: controlContainerBottomLeft,
          undefinedHTML: 'N/A'
        });
        mapController.map.addControl(mapController.controls.scaleline);
      }

      $(controlContainerBottomLeft).append(controlContainerBottomLeftSub);

      if (mapData.zoomlevel) {
        mapController.map.removeControl(mapController.controls.zoomlevel);
        mapController.controls.zoomlevel = new c4g.maps.control.Zoomlevel({
          mapView: mapController.map.getView(),
          target: controlContainerBottomLeftSub,
          undefinedHTML: 'N/A'
        });
        mapController.map.addControl(mapController.controls.zoomlevel);
      }

      if (mapData.mouseposition) {
        mapController.map.removeControl(mapController.controls.mouseposition);
        mapController.controls.mouseposition = new ol.control.MousePosition({
          projection: 'EPSG:4326',
          coordinateFormat: ol.coordinate.toStringHDMS,
          target: controlContainerBottomLeftSub,
          undefinedHTML: 'N/A'
        });
        mapController.map.addControl(mapController.controls.mouseposition);
      }
    }


  });

}(jQuery, this.c4g));