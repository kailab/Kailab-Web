<?php

namespace Kailab\Bundle\EntityBundle\Entity;

use Kailab\Bundle\SharedBundle\Asset\ParameterAsset;

use Imagine\ImageInterface;

use Imagine\Image\Box;

use Imagine\Gd\Imagine;

use Kailab\Bundle\SharedBundle\Entity\TranslatedEntity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Kailab\Bundle\SharedBundle\Asset\EntityAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\Bundle\EntityBundle\Repository\TechRepository")
 * @ORM\Table(name="techs")
 */
class Tech extends TranslatedEntity
{
    protected $icon;
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
     * @ORM\Column(type="string", length="255", unique=true)
     */
    protected $slug;

    /**
     * @ORM\Column(type="string", length="255", nullable=true)
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
     * @ORM\ManyToMany(targetEntity="App", mappedBy="technologies")
     */
    protected $apps;

    /**
     * @ORM\ManyToMany(targetEntity="Platform")
     * @ORM\JoinTable(name="tech_platforms",
     *      joinColumns={@ORM\JoinColumn(name="tech_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="platform_id", referencedColumnName="id")}
     *      )
     */
    protected $platforms;

    function __construct()
    {
    	parent::__construct();
        $this->loadAssets();
        $this->tech_screenshots = new ArrayCollection();
        $this->platforms = new ArrayCollection();
        $this->active = true;
    }

    protected function loadAssets()
    {
        if(!$this->icon instanceof EntityAsset){
            $this->icon = new EntityAsset($this, 'icon');
        }
        if(!$this->image instanceof EntityAsset){
            $this->image = new EntityAsset($this, 'image');
        }
    }

    public function getAssets()
    {
        $this->loadAssets();
        return array($this->icon, $this->image);
    }
    
    public function updateIcon()
    {
    	$asset = $this->getIcon();
    	
    	$imagine = new Imagine();
    	$image = $imagine->load($asset->getContent());
    	$image = $image->resize(new Box(30, 30), ImageInterface::THUMBNAIL_OUTBOUND);
    	
    	$asset->setAsset(new ParameterAsset(array(
    	            'content'       => $image->get('png'),
    	            'content_type'  => 'image/png'
    	)));
    }
    
    public function updateImage()
    {
    	$asset = $this->getImage();
    	 
    	$imagine = new Imagine();
    	$image = $imagine->load($asset->getContent());
    	$image = $image->resize(new Box(150, 150), ImageInterface::THUMBNAIL_OUTBOUND);
    	 
    	$asset->setAsset(new ParameterAsset(array(
        	            'content'       => $image->get('png'),
        	            'content_type'  => 'image/png'
    	)));
    }
    
    public function updateAssets()
    {
		$this->updateIcon();
		$this->updateImage();
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

    public function getIcon()
    {
        $this->loadAssets();
        return $this->icon;
    }

    public function setIcon($path)
    {
       $this->loadAssets();
       $this->icon->setAsset($path);
       $this->updated = new \DateTime('now');
    }

    public function getImage()
    {
        $this->loadAssets();
        return $this->image;
    }

    public function setImage($path)
    {
       $this->loadAssets();
       $this->image->setAsset($path);
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
            return $trans->getExcerpt();
        }
    }

    public function getPlatforms()
    {
        return $this->platforms;
    }

    public function setPlatforms($platforms)
    {
        $this->platforms = $platforms;
    }

    public function getApps($type=null)
    {
        if(!$type){
            return $this->apps;
        }else{
            $apps = new ArrayCollection();
            foreach($this->apps as $app){
                if($app->getType() == $type){
                    $apps[] = $app;
                }
            }
            return $apps;
        }
    }

    public function setApps($apps)
    {
        $this->apps = $apps;
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

