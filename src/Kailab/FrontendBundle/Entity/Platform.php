<?php

namespace Kailab\FrontendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Kailab\FrontendBundle\Asset\EntityAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\FrontendBundle\Repository\PlatformRepository")
 * @ORM\Table(name="platforms")
 */
class Platform 
{
    const EXCERPT_SEPARATOR = '<!-- more -->';

    protected $locale;
    protected $icon;
    protected $background;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="integer")
     */
    protected $screen_x;

    /**
     * @ORM\Column(type="integer")
     */
    protected $screen_y;

    /**
     * @ORM\Column(type="integer")
     */
    protected $screen_w;

    /**
     * @ORM\Column(type="integer")
     */
    protected $screen_h;

    /**
     * @ORM\Column(type="string", length="255", nullable=true)
     */
    protected $url;

    /**
     * @ORM\Column(type="string", length="255", unique=true)
     */
    protected $slug;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $active;

    /**
     * @ORM\OneToMany(targetEntity="PlatformTranslation", mappedBy="platform", cascade={"persist", "remove"})
     */
    protected $translations;

    /**
     * @ORM\ManyToMany(targetEntity="Tech", mappedBy="platforms")
     */
    protected $technologies;

     /**
     * @ORM\ManyToMany(targetEntity="App", mappedBy="platforms")
     */
    protected $apps;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $updated;

    function __construct()
    {
        $this->loadAssets();
        $this->translations = new ArrayCollection();
        $this->active = true;
    }

    protected function loadAssets()
    {
        if(!$this->icon instanceof EntityAsset){
            $this->icon = new EntityAsset($this, 'icon');
        }
        if(!$this->background instanceof EntityAsset){
            $this->background = new EntityAsset($this, 'background');
        }
    }

    public function getAssets()
    {
        $this->loadAssets();
        return array($this->icon,$this->background);
    }

    public function getIcon()
    {
        $this->loadAssets();
        return $this->icon;
    }

    public function setIcon($path)
    {
        $this->loadAssets();
        $this->icon->loadPath($path);
        $this->updated = new \DateTime('now');
    }

    public function getBackground()
    {
        $this->loadAssets();
        return $this->background;
    }

    public function setBackground($path)
    {
        $this->loadAssets();
        $this->background->loadPath($path);
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

    public function getScreenX()
    {
        return $this->screen_x;
    }

    public function setScreenX($x)
    {
        $this->screen_x = $x;
    }

    public function getScreenY()
    {
        return $this->screen_y;
    }

    public function setScreenY($y)
    {
        $this->screen_y = $y;
    }

    public function getScreenW()
    {
        return $this->screen_w;
    }

    public function setScreenW($w)
    {
        $this->screen_w = $w;
    }

    public function getScreenH()
    {
        return $this->screen_h;
    }

    public function setScreenH($h)
    {
        $this->screen_h = $h;
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

    public function getUrl()
    {
        return $this->url;
    }

    public function setUrl($url)
    {
        $this->url = $url;
    }

    public function getSlug()
    {
        return $this->slug;
    }

    public function setSlug($slug)
    {
        $this->slug = $slug;
    }

    public function getTranslations()
    {
        return $this->translations;
    }

    public function setTranslations($trans)
    {
        $this->translations = $trans;
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

    public function getExcerpt()
    {
        $trans = $this->getTranslation();
        if($trans){
            return $trans->getExcerpt();
        }
    }

    public function getTechnologies()
    {
        return $this->technologies;
    }

    public function setTechnologies($techs)
    {
        $this->technologies = $techs;
    }

    public function getApps()
    {
        return $this->apps;
    }

    public function setApps($apps)
    {
        $this->apps = $apps;
    }

}

