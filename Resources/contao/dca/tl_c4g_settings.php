<?php

/**
 * con4gis - the gis-kit
 *
 * @version   php 7
 * @package   con4gis
 * @author    con4gis contributors (see "authors.txt")
 * @license   GNU/LGPL http://opensource.org/licenses/lgpl-3.0.html
 * @copyright Küstenschmiede GmbH Software & Design 2011 - 2018
 * @link      https://www.kuestenschmiede.de
 */

$GLOBALS['TL_DCA']['tl_c4g_settings']['palettes']['default'] .= '{c4g_maps_legend},disabledC4gMapObjects,caching;';

/**
 * Add fields
 */
$GLOBALS['TL_DCA']['tl_c4g_settings']['fields']['disabledC4gMapObjects'] = array
(
    'label'                   => &$GLOBALS['TL_LANG']['tl_c4g_settings']['disabledC4gMapObjects'],
    'inputType'               => 'checkbox',
    'options_callback'        => array('tl_settings_c4g_maps', 'getMapTables'),
    'eval'                    => array('multiple'=>true),
    'sql'                     => "blob NULL"
);
$GLOBALS['TL_DCA']['tl_c4g_settings']['fields']['caching'] = array
(
    'label'                   => &$GLOBALS['TL_LANG']['tl_c4g_settings']['caching'],
    'inputType'               => 'checkbox',
    'options'                 => array('baseLayerService','layerService','layerContentService','editorService','locationStyleService','infoWindowService','nominatimService','reverseNominatimService','routingService'),
    'reference'               => &$GLOBALS['TL_LANG']['tl_c4g_settings']['references'],
    'eval'                    => array('multiple'=>true),
    'sql'                     => "blob NULL"
);

/**
 * Class tl_settings_c4g_maps
 */
class tl_settings_c4g_maps extends tl_c4g_settings
{
    /**
     * Return available Map tables
     *
     * @return array Array of map tables
     */
    public function getMapTables()
    {
        $tables = array();

        if (is_array($GLOBALS['con4gis']['maps']['sourcetable']))
        {
            foreach ($GLOBALS['con4gis']['maps']['sourcetable'] as $key=>$sourcetable) {
                $tables[$key] = $GLOBALS['TL_LANG']['c4g_maps']['sourcetable'][$key]['name'];
            }
        }

        return $tables;
    }
}
