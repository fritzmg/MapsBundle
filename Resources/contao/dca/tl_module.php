<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

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

/***
 * Palettes
 */
$GLOBALS['TL_DCA']['tl_module']['palettes']['c4g_maps']         =   '{title_legend},name,headline,type;'.
                                                                    '{c4g_map_legend},c4g_map_id,c4g_map_default_mapservice,c4g_map_width,c4g_map_height,c4g_map_zoom;'.
                                                                    '{protected_legend:hide},protected;'.
                                                                    '{expert_legend:hide},guests,cssID,space';
if ($GLOBALS['con4gis']['forum']['installed'])
{
    $insert = '{c4g_forum_maps_legend},c4g_forum_enable_maps;{expert_legend:hide}';
    //insert c4g-maps support when forum is installed
    $GLOBALS['TL_DCA']['tl_module']['palettes']['c4g_forum'] = str_replace('{expert_legend:hide}', $insert, $GLOBALS['TL_DCA']['tl_module']['palettes']['c4g_forum']);
    $GLOBALS['TL_DCA']['tl_module']['fields']['c4g_forum_enable_maps'] = array
    (
        'label' => &$GLOBALS['TL_LANG']['tl_module']['c4g_forum_enable_maps'],
        'exclude' => true,
        'default' => '',
        'inputType' => 'checkbox',
        'sql' => "char(1) NOT NULL default ''"
    );
}
/***
 * Fields
 */
$GLOBALS['TL_DCA']['tl_module']['fields']['c4g_map_id'] = array
(
    'label'                   => &$GLOBALS['TL_LANG']['tl_module']['c4g_map_id'],
    'exclude'                 => true,
    'inputType'               => 'select',
    'options_callback'        => array('tl_module_c4g_maps', 'get_maps'),
    'eval'                    => array('submitOnChange'=>true),
    'sql'                     => "int(10) unsigned NOT NULL default '0'"
);
$GLOBALS['TL_DCA']['tl_module']['fields']['c4g_map_width'] = array
(
    'label'                   => &$GLOBALS['TL_LANG']['tl_module']['c4g_map_width'],
    'exclude'                 => true,
    'inputType'               => 'inputUnit',
    'options'                 => array('px', '%', 'em', 'vh', 'vw', 'vmin', 'vmax', 'pt', 'pc', 'in', 'cm', 'mm'),
    'eval'                    => array(
                                    'rgxp'=>'digit_auto_inherit',
                                    'tl_class'=>'w50',
                                    'includeBlankOption'=>true
                                ),
    'sql'                     => "varchar(64) NOT NULL default ''"
);
$GLOBALS['TL_DCA']['tl_module']['fields']['c4g_map_height'] = array
(
    'label'                   => &$GLOBALS['TL_LANG']['tl_module']['c4g_map_height'],
    'exclude'                 => true,
    'inputType'               => 'inputUnit',
    'options'                 => array('px', '%', 'em', 'vh', 'vw', 'vmin', 'vmax', 'pt', 'pc', 'in', 'cm', 'mm'),
    'eval'                    => array(
                                    'rgxp'=>'digit_auto_inherit',
                                    'tl_class'=>'w50',
                                    'includeBlankOption'=>true
                                ),
    'sql'                     => "varchar(64) NOT NULL default ''"
);
$GLOBALS['TL_DCA']['tl_module']['fields']['c4g_map_zoom'] = array
(
    'label'                   => &$GLOBALS['TL_LANG']['tl_module']['c4g_map_zoom'],
    'exclude'                 => true,
    'inputType'               => 'text',
    'eval'                    => array('mandatory'=>false, 'rgxp'=>'digit'),
    'sql'                     => "int(10) unsigned NOT NULL default '0'"
);
$GLOBALS['TL_DCA']['tl_module']['fields']['c4g_map_default_mapservice'] = array
(
    'label'                   => &$GLOBALS['TL_LANG']['tl_module']['c4g_map_default_mapservice'],
    'exclude'                 => true,
    'inputType'               => 'select',
    'options_callback'        => array('tl_module_c4g_maps', 'get_baselayers'),
    'sql'                     => "int(10) unsigned NOT NULL default '0'"

);

/**
 * Class tl_module_c4g_maps
 */
class tl_module_c4g_maps extends Backend
{
    protected $firstMapId = null;

    /**
     * Return all base layers for current Map Profile as array
     * @param object
     * @return array
     */
    public function get_baselayers(DataContainer $dc)
    {
        $id = 0;
        if ($dc->activeRecord->c4g_map_id != 0) {
            $id = $dc->activeRecord->c4g_map_id;
        } else {
            // take firstMapId, because it will be chosen as DEFAULT value for c4g_map_id
            $id = $this->firstMapId;
        }

        $profile = $this->Database->prepare(
                "SELECT b.baselayers ".
                "FROM tl_c4g_maps a, tl_c4g_map_profiles b ".
                "WHERE a.id = ? and a.profile = b.id")
                ->execute($id);

        $ids = deserialize($profile->baselayers,true);
        if (count($ids)>0) {
            $baseLayers = $this->Database->prepare("SELECT id,name FROM tl_c4g_map_baselayers WHERE id IN (".implode(',',$ids).") ORDER BY name")->execute();
        } else {
            $baseLayers = $this->Database->prepare("SELECT id,name FROM tl_c4g_map_baselayers ORDER BY name")->execute();
        }


        if ($baseLayers->numRows > 0) {
            while ( $baseLayers->next () ) {
                $return [$baseLayers->id] = $baseLayers->name;
            }
        }
        return $return;
    }

    /**
     * Return all defined maps
     * @param object
     * @return array
     */
    public function get_maps(DataContainer $dc)
    {

        $maps = $this->Database->prepare ( "SELECT * FROM tl_c4g_maps WHERE is_map=1 AND published=1" )->execute ();
        if ($maps->numRows > 0) {
            while ( $maps->next () ) {
                if (!isset($this->firstMapId)) {
                    // save first map id
                    $this->firstMapId = $maps->id;
                }
                $return [$maps->id] = $maps->name;
            }
        }
        return $return;
    }
}
