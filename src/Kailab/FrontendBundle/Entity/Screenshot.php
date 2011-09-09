<?php

namespace Kailab\FrontendBundle\Entity;

use Kailab\FrontendBundle\Asset\EntityAsset;
use Kailab\FrontendBundle\Asset\AssetInterface;
use Kailab\FrontendBundle\Asset\PublicAssetInterface;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="Kailab\FrontendBundle\Repository\ScreenshotRepository")
 * @ORM\Table(name="screenshots")
 */
class Screenshot
{
    const ORIENTATION_VERTICAL = 'vertical';
    const ORIENTATION_HORIZONTAL = 'horizontal';

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $active;

    /**
     * @ORM\Column(type="string", length=50)
     */
    protected $orientation;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $updated;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @ORM\ManyToOne(targetEntity="Platform", inversedBy="screenshots")
     * @ORM\JoinColumn(name="platform_id", referencedColumnName="id")
     */
    protected $platform;

    /**
     * @ORM\OneToMany(targetEntity="AppScreenshot", mappedBy="app", cascade={"persist", "remove"})
     */
    protected $app_screenshots;

    protected $images = array();

    public function __construct()
    {
        $this->loadAssets();
        $this->active = true;
        $this->updated = new \DateTime('now');
        $this->created = new \DateTime('now');
        $this->orientation = self::ORIENTATION_VERTICAL;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getSmallUri()
    {
        $asset = $this->getImage('small');
        if($asset instanceof PublicAssetInterface){
            return $asset->getUri();
        }
    }

    public function getOrientation()
    {
        return $this->orientation;
    }

    public function setOrientation($ori)
    {
        $this->orientation = $ori;
    }

    public function getPlatform()
    {
        return $this->platform;
    }

    public function setPlatform($platform)
    {
        $this->platform = $platform;
    }

    public function getActive()
    {
        return $this->active;
    }

    public function setActive($active)
    {
        $this->active = $active;
    }

    public function setApp($app)
    {
        $this->app = $app;
    }

    public function getApp()
    {
        return $this->app;
    }

    protected function loadAssets()
    {
        $types = array('','big','bigh','small','item');
        foreach($types as $type){
            if(!isset($this->images[$type])){
                $name = $type ? 'image_'.$type : 'image';
                $this->images[$type] = new EntityAsset($this, $name);
            }
        }
    }
    public function getAssets()
    {
        $this->loadAssets();
        return $this->images;
    }

    public function getImage($name='')
    {
        $this->loadAssets();
        if(isset($this->images[$name])){
            return $this->images[$name];
        }
    }

    public function setImage($path, $name='')
    {
        $this->loadAssets();
        $img = $this->getImage($name);
        if($img == null){
            return;
        }
        $img->setAsset($path);
        $this->updated = new \DateTime('now');
    }

    public function getUpdated()
    {
        return $this->updated;
    }

    public function setUpdated($time)
    {
        $this->updated = $time;
    }

    public function getAppScreenshots()
    {
        return $this->app_screenshots;
    }

    public function setAppScreenshots($screens)
    {
        $this->app_screenshots = $screens;
    }

}


