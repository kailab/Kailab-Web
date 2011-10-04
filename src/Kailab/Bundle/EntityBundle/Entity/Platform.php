<?php

namespace Kailab\Bundle\EntityBundle\Entity;

use Kailab\Bundle\SharedBundle\Entity\TranslatedEntity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Kailab\Bundle\SharedBundle\Asset\EntityAsset;
use Kailab\Bundle\SharedBundle\Asset\ParameterAsset;
use Kailab\Bundle\SharedBundle\Asset\AssetInterface;

use Kailab\Bundle\SharedBundle\Imagine\Filter\Paste;

use Imagine\ImageInterface;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;
use Imagine\Image\Point;
use Imagine\Image\Color;

/**
 * @ORM\Entity(repositoryClass="Kailab\Bundle\EntityBundle\Repository\PlatformRepository")
 * @ORM\Table(name="platforms")
 */
class Platform extends TranslatedEntity 
{
    const EXCERPT_SEPARATOR = '<!-- more -->';

    protected $icon;
    protected $backgrounds = array();

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
    	parent::__construct();
        $this->loadAssets();
        $this->active = true;
    }

    protected function loadAssets()
    {
        if(!$this->icon instanceof AssetInterface){
            $this->icon = new EntityAsset($this, 'icon');
        }
        $types = array('','blue');
        foreach($types as $type){
            if(!isset($this->backgrounds[$type])){
                $name = $type ? 'background_'.$type : 'background';
                $this->backgrounds[$type] = new EntityAsset($this, $name);
            }
        }
    }

    public function getAssets()
    {
        $this->loadAssets();

        return array_merge(array($this->icon),$this->backgrounds);
    }
    
    public function updateAssets()
    {
    	// update background with blue foreground
    	$this->updateBackground();
    	 
    	// resize icon
    	$this->updateIcon();
    }
    
    public function updateIcon()
    {
    	$asset = $this->getIcon();
    	if($asset == null){
    		return false;
    	}
    	$content = $asset->getContent();
    	if(!$content){
    		return false;
    	}
    	$imagine = new Imagine();
    	$image = $imagine->load($content);
    	$image = $image->resize(new Box(30,30), ImageInterface::THUMBNAIL_OUTBOUND);
    
    	$this->setIcon(new ParameterAsset(array(
        	    'content'       => $image->get('png'),
        		'content_type'  => 'image/png'
    	)));
    }
    
    /**
     * @return Box
     */
    public function getScreenSize()
    {
    	return new Box($this->getScreenW() , $this->getScreenH());
    }
    
    /**
     * @return Point
     */
    public function getScreenPosition()
    {
    	return new Point($this->getScreenX() , $this->getScreenY());
    }
    
    public function updateBackground()
    {
    	$asset = $this->getBackground();
    	if($asset == null){
    		return false;
    	}
    	$content = $asset->getContent();
    	if(!$content){
    		return false;
    	}
    	$imagine = new Imagine();
    	$bg = $imagine->load($content);
    	 
    	$image = $imagine->create(
    	$this->getScreenSize(),
    	new Color('0000ff'));
    	$paste = new Paste($bg, $this->getScreenPosition());
    	$image = $paste->apply($image);
    	$this->setBackground(new ParameterAsset(array(
        		'content'       => $image->get('png'),
                'content_type'  => 'image/png'
    	)), 'blue');
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

    public function getBackground($name='')
    {
        $this->loadAssets();
        if(isset($this->backgrounds[$name])){
            return $this->backgrounds[$name];
        }
    }

    public function setBackground($path, $name='')
    {
        $this->loadAssets();
        $bg = $this->getBackground($name);
        if($bg instanceof AssetInterface){
            $bg->setAsset($path);
            $this->updated = new \DateTime('now');
        }
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

    public function getSlug()
    {
        return $this->slug;
    }

    public function setSlug($slug)
    {
        $this->slug = $slug;
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

    public function getApps()
    {
        return $this->apps;
    }

    public function setApps($apps)
    {
        $this->apps = $apps;
    }

}

