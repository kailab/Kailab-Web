<?php

namespace Kailab\FrontendBundle\Entity;

use Kailab\FrontendBundle\Asset\EntityAsset;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="screenshots")
 */
class Screenshot
{
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
     * @ORM\Column(type="datetime")
     */
    protected $updated;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @ORM\Column(type="string", length="20", nullable=true)
     */
    protected $type;

    /**
     * @ORM\OneToMany(targetEntity="AppScreenshot", mappedBy="app", cascade={"persist", "remove"})
     */
    protected $app_screenshots;

    protected $image;

    public function __construct()
    {
        $this->loadAssets();
        $this->active = true;
        $this->updated = new \DateTime('now');
        $this->created = new \DateTime('now');
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getPosition()
    {
        return $this->position;
    }

    public function setPosition($pos)
    {
        $this->position = $pos;
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
        if(!$this->image instanceof EntityAsset){
            $this->image = new EntityAsset($this, 'image');
        }
    }

    public function getAssets()
    {
        $this->loadAssets();
        return array($this->image);
    }

    public function getImage()
    {
        $this->loadAssets();
        return $this->image;
    }

    public function setImage($path)
    {
        $this->loadAssets();
        $this->image->loadPath($path);
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
