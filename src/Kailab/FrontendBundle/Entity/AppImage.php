<?php

namespace Kailab\FrontendBundle\Entity;

use Kailab\FrontendBundle\Asset\EntityAsset;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="app_images")
 */
class AppImage
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="integer")
     */
    protected $position;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $active;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $updated;

    /**
     * @ORM\ManyToOne(targetEntity="App", inversedBy="images")
     * @ORM\JoinColumn(name="app_id", referencedColumnName="id")
     */
    protected $app;

    protected $image_big;
    protected $image_small;

    public function __construct()
    {
        $this->loadAssets();
        $this->updated = new \DateTime('now');
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
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
        if(!$this->image_big instanceof EntityAsset){
            $this->image_big = new EntityAsset($this, 'image_big');
        }
        if(!$this->image_small instanceof EntityAsset){
            $this->image_small = new EntityAsset($this, 'image_small');
        }
    }

    public function getAssets()
    {
        $this->loadAssets();
        return array($this->image_big,$this->image_small);
    }

    public function getBigImage()
    {
        $this->loadAssets();
        return $this->image_big;
    }

    public function getSmallImage()
    {
        $this->loadAssets();
        return $this->image_small;
    }

    public function getFile()
    {
        $this->loadAssets();
        return $this->image_big;
    }

    public function setFile($path)
    {
        $this->loadAssets();

        $imagine = new \Imagine\Gd\Imagine();
        $image = $imagine->open($path);

        // resize big image
        $box = new \Imagine\Image\Box(200, 300);
        $big = $image->thumbnail($box,\Imagine\ImageInterface::THUMBNAIL_OUTBOUND);
        $big_path = $path.'_big.png';
        $big->save($big_path);
        $this->image_big->loadPath($big_path);

        // resize small image
        $box = new \Imagine\Image\Box(67, 100);
        $small = $image->thumbnail($box,\Imagine\ImageInterface::THUMBNAIL_OUTBOUND);
        $small_path = $path.'_small.png';
        $big->save($small_path);
        $this->image_small->loadPath($small_path);

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

}
