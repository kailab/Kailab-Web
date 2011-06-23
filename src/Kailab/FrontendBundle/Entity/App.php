<?php

namespace Kailab\FrontendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Kailab\FrontendBundle\Asset\EntityAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\FrontendBundle\Repository\AppRepository")
 * @ORM\Table(name="apps")
 */
class App
{
    protected $locale;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length="255", nullable=true)
     */
    protected $slug;

    /**
     * @ORM\Column(type="integer")
     */
    protected $position;

    /**
     * @ORM\Column(type="string", length="50")
     */
    protected $type;

    /**
     * @ORM\Column(type="string", length="255", nullable=true)
     */
    protected $url;

    /**
     * @ORM\OneToMany(targetEntity="AppScreenshot", mappedBy="app", cascade={"persist", "remove"})
     */
    protected $app_screenshots;

    /**
     * @ORM\OneToMany(targetEntity="AppTranslation", mappedBy="app", cascade={"persist", "remove"})
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
     * @ORM\ManyToMany(targetEntity="Platform")
     * @ORM\JoinTable(name="app_platforms",
     *      joinColumns={@ORM\JoinColumn(name="app_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="platform_id", referencedColumnName="id")}
     *      )
     */
    protected $platforms;

    /**
     * @ORM\ManyToMany(targetEntity="Tech")
     * @ORM\JoinTable(name="app_techs",
     *      joinColumns={@ORM\JoinColumn(name="app_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="tech_id", referencedColumnName="id")}
     *      )
     */
    protected $technologies;

    /**
     * @ORM\ManyToMany(targetEntity="App")
     * @ORM\JoinTable(name="app_relations",
     *      joinColumns={@ORM\JoinColumn(name="app_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="related_id", referencedColumnName="id")}
     *      )
     */
    protected $related;

    function __construct()
    {
        $this->translations = new ArrayCollection();
        $this->app_screenshots = new ArrayCollection();
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

    public function getOrientation()
    {
        $shot = $this->getScreenshot();
        if($shot){
            return $shot->getOrientation();
        }
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

    public function getAppScreenshots()
    {
        return $this->app_screenshots;
    }

    public function setAppScreenshots($screens)
    {
        $this->app_screenshots = $screens;
    }

    public function getScreenshot()
    {
        $screens = $this->getScreenshots();
        return $screens->first();
    }

    public function getScreenshots()
    {
        $screens = new ArrayCollection();
        foreach($this->app_screenshots as $app_screen){
            if($app_screen instanceof AppScreenshot){
                $screens[] = $app_screen->getScreenshot();
            }
        }
        return $screens;
    }

    public function setScreenshots(Collection $screens)
    {
        $this->app_screenshots->clear();
        $k = 0;
        foreach($screens as $screen){
            $app_screen = new AppScreenshot();
            $app_screen->setScreenshot($screen);
            $app_screen->setApp($this);
            $app_screen->setPosition($k++);
            $this->app_screenshots[] = $app_screen;
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
        $trans = $this->getTranslation();
        if($trans){
            return $trans->getDescription();
        }
    }

    public function hasExcerpt()
    {
        $content = $this->getDescription();
        $content = explode(self::EXCERPT_SEPARATOR,$content);
        return count($content) > 0;
    }

    public function getTechnologies()
    {
        return $this->technologies;
    }

    public function setTechnologies($techs)
    {
        $this->technologies = $techs;
    }

    public function getRelated()
    {
        return $this->related;
    }

    public function setRelated($apps)
    {
        $this->related = $apps;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getPlatforms()
    {
        return $this->platforms;
    }

    public function setPlatforms($platforms)
    {
        $this->platforms = $platforms;
    }

    public function getSlug()
    {
        return $this->slug;
    }

    public function setSlug($slug)
    {
        $this->slug = $slug;
    }

}

