<?php

namespace Kailab\FrontendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Imagine\Gd\Imagine;
use Doctrine\Common\Collections\ArrayCollection;
use Kailab\FrontendBundle\Asset\EntityAsset;
use Kailab\FrontendBundle\Asset\AssetInterface;

/**
 * @ORM\Entity(repositoryClass="Kailab\FrontendBundle\Repository\SlideRepository")
 * @ORM\Table(name="slides")
 */
class Slide
{
    protected $locale;
    protected $images = array();

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
     * @ORM\Column(type="string", length="255", nullable=true)
     */
    protected $url;

    /**
     * @ORM\OneToMany(targetEntity="SlideTranslation", mappedBy="slide", cascade={"persist", "remove"})
     */
    protected $translations;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $updated;

    /**
     * @ORM\Column(type="boolean")

     */
    protected $active;

    function __construct()
    {
        $this->loadAssets();
        $this->translations = new ArrayCollection();
        $this->active = true;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getActive()
    {
        return $this->active;
    }

    public function setActive($active)
    {
        $this->active = $active;
    }

    public function setCurrentLocale($locale)
    {
        $this->locale = $locale;
    }

    public function getCurrentLocale()
    {
        return $this->locale;
    }

    public function getTranslation()
    {
        $locale = $this->getCurrentLocale();
        $trans = $this->getTranslations();
        foreach($trans as $t){
            if($t->getLocale() == $locale){
                return $t;
            }
        }
    }

    public function getName()
    {
        $trans = $this->getTranslation();
        if($trans){
            return $trans->getName();
        }
    }

    public function getDescription()
    {
        $trans = $this->getTranslation();
        if($trans){
            return $trans->getDescription();
        }
    }

    protected function loadAssets()
    {
        $types = array('', 'big');
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
        }else{
            return null;
        }
    }

    public function setImage($path, $name='')
    {
        $this->loadAssets();
        $img = $this->getImage($name);
        if($img == null){
            return;
        }
        if($path instanceof AssetInterface){
            $img->setAsset($path);
        }else if(is_string($path)){
            $img->loadPath($path);
        }
        $this->updated = new \DateTime('now');
    }

    public function getUrl()
    {
        return $this->url;
    }

    public function setUrl($url)
    {
        $this->url = $url;
    }

    public function getTranslations()
    {
        return $this->translations;
    }

    public function setTranslations($trans)
    {
        $this->translations = $trans;
    }

    public function getPosition()
    {
        return $this->position;
    }

    public function setPosition($pos)
    {
        $this->position = $pos;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function setCreated($time)
    {
        $this->created = $time;
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


