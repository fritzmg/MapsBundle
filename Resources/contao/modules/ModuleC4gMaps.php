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

namespace con4gis\MapsBundle\Resources\contao\modules;

use con4gis\MapsBundle\Resources\contao\classes\MapDataConfigurator;

/**
 * Class ModuleC4gMaps
 * @package \con4gis\MapsBundle\Resources\contao\modules
 */
class ModuleC4gMaps extends \Module
{
    /**
     * Template
     * @var string
     */
    protected $strTemplate = 'c4g_maps';

    /**
     * Display a wildcard in the back end
     * @return string
     */
    public function generate()
    {
        if (TL_MODE == 'BE') {
            $objTemplate = new \BackendTemplate('be_wildcard');

            $objTemplate->wildcard = '### ' . $GLOBALS['TL_LANG']['FMD']['c4g_maps'][0] . ' ###<img src="bundles/con4gismaps/images/logo_con4gis-maps.png" style="float:right">';
            $objTemplate->title = $this->headline;
            $objTemplate->id = $this->id;
            $objTemplate->link = $this->title;
            $objTemplate->href = 'contao/main.php?do=themes&amp;table=tl_module&amp;act=edit&amp;id=' . $this->id;

            return $objTemplate->parse();
        }

        return parent::generate();
    }

    /**
     * Generate module
     */
    protected function compile()
    {
        $this->Template->mapData = MapDataConfigurator::prepareMapData($this, $this->Database);
    }

    public function repInsertTags($str)
    {
        return parent::replaceInsertTags($str);
    }

    public function import($strClass, $strKey = false, $blnForce = false)
    {
        parent::import($strClass, $strKey, $blnForce);
    }

    public function getInput()
    {
        return $this->Input;
    }

    public function getFrontendUrl($arrRow)
    {
        return parent::generateFrontendUrl($arrRow);
    }

}
