<?php

namespace Kailab\Bundle\EntityBundle\Entity;

use Kailab\Bundle\SharedBundle\Entity\TranslatedEntity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Kailab\Bundle\SharedBundle\Asset\EntityAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\Bundle\EntityBundle\Repository\AppRepository")
 * @ORM\Table(name="apps")
 */
class App extends TranslatedEntity
{

    const ORIENTATION_VERTICAL = 'vertical';
    const ORIENTATION_HORIZONTAL = 'horizontal';
    const ORIENTATION_BOTH = 'both';

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length="255", unique=true)
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
     * @ORM\ManyToMany(targetEntity="Platform", inversedBy="apps")
     * @ORM\JoinTable(name="app_platforms",
     *      joinColumns={@ORM\JoinColumn(name="app_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="platform_id", referencedColumnName="id")}
     *      )
     */
    protected $platforms;

    /**
     * @ORM\ManyToMany(targetEntity="Tech", inversedBy="apps")
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
    	parent::__construct();
        $this->app_screenshots = new ArrayCollection();
        $this->platforms = new ArrayCollection();
        $this->technologies = new ArrayCollection();
        $this->related = new ArrayCollection();
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
        $shots = $this->getScreenshots();

        $h = null;
        foreach($shots as $shot){
            if($shot->getOrientation() != $h && $h != null){
                return App::ORIENTATION_BOTH;
            }
            $h = $shot->getOrientation();
        }
        return $h;
    }

    public function getActive()
    {
        return $this->active;
    }

    public function setActive($active)
    {
        $this->active = $active;
    }

    public function getName()
    {
		return $this->getTranslated('name');
    }

    public function getDescription()
    {
    	return $this->getTranslated('description');
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
        // clear old screenshots
        foreach($this->app_screenshots as $v){
            $v->setApp(null);
        }
        $k = 0;
        foreach($screens as $screen){
            $app_screen = new AppScreenshot();
            $app_screen->setScreenshot($screen);
            $app_screen->setApp($this);
            $app_screen->setPosition($k++);
            $this->app_screenshots[] = $app_screen;
        }
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

    public function getLinks()
    {
        return $this->getTranslated('links');
    }

    public function getExcerpt()
    {
    	return $this->getTranslated('excerpt');
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
    
    public function fixLinks()
    {
    	foreach($this->getTranslations() as $trans){
    		$trans->fixLinks();
    	}
    }

}

