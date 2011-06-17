<?php

namespace Kailab\FrontendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Kailab\FrontendBundle\Asset\EntityAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\FrontendBundle\Repository\TechRepository")
 * @ORM\Table(name="techs")
 */
class Tech
{
    const EXCERPT_SEPARATOR = '<!-- more -->';

    protected $locale;
    protected $image;

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
     * @ORM\Column(type="string", length="255")
     */
    protected $url;

    /**
     * @ORM\OneToMany(targetEntity="TechScreenshot", mappedBy="tech", cascade={"persist", "remove"})
     */
    protected $tech_screenshots;

    /**
     * @ORM\OneToMany(targetEntity="TechTranslation", mappedBy="tech", cascade={"persist", "remove"})
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

    /**
     * @ORM\ManyToMany(targetEntity="App")
     */
    protected $apps;

    function __construct()
    {
        $this->loadAssets();
        $this->translations = new ArrayCollection();
        $this->tech_screenshots = new ArrayCollection();
        $this->active = true;
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

    public function getUrl()
    {
        return $this->url;
    }

    public function setUrl($url)
    {
        $this->url = $url;
    }

    public function getTechScreenshots()
    {
        return $this->tech_screenshots;
    }

    public function setTechScreenshots($screens)
    {
        $this->tech_screenshots = $screens;
    }

    public function getScreenshot()
    {
        $screens = $this->getScreenshots();
        return $screens->first();
    }

    public function getScreenshots()
    {
        $screens = new ArrayCollection();
        foreach($this->tech_screenshots as $tech_screen){
            if($tech_screen instanceof TechScreenshot){
                $screens[] = $tech_screen->getScreenshot();
            }
        }
        return $screens;
    }

    public function setScreenshots(Collection $screens)
    {
        $this->tech_screenshots->clear();
        $k = 0;
        foreach($screens as $screen){
            $tech_screen = new TechScreenshot();
            $tech_screen->setScreenshot($screen);
            $tech_screen->setTech($this);
            $tech_screen->setPosition($k++);
            $this->tech_screenshots[] = $tech_screen;
        }
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

    public function getExcerpt()
    {
        $content = $this->getDescription();
        $content = explode(self::EXCERPT_SEPARATOR,$content);
        return reset($content);
    }

    public function hasExcerpt()
    {
        $content = $this->getDescription();
        $content = explode(self::EXCERPT_SEPARATOR,$content);
        return count($content) > 0;
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

