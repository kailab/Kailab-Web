<?php

namespace Kailab\Bundle\EntityBundle\Entity;

use Kailab\Bundle\SharedBundle\Imagine\Filter\Resize;

use Kailab\Bundle\SharedBundle\Entity\TranslatedEntity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;
use Doctrine\Common\Collections\ArrayCollection;
use Kailab\Bundle\SharedBundle\Asset\EntityAsset;
use Kailab\Bundle\SharedBundle\Asset\AssetInterface;
use Kailab\Bundle\SharedBundle\Asset\ParameterAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\Bundle\EntityBundle\Repository\SlideRepository")
 * @ORM\Table(name="slides")
 */
class Slide extends TranslatedEntity
{
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
    	parent::__construct();
        $this->loadAssets();
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

    public function getName()
    {
		return $this->getTranslated('name');
    }

    public function getDescription()
    {
		return $this->getTranslated('description');
    }

    protected function loadAssets()
    {
        if(!$this->image instanceof AssetInterface){
            $this->image = new EntityAsset($this, 'image');
        }
    }

    public function getAssets()
    {
        $this->loadAssets();
        return array($this->image);
    }
    
    public function updateAssets()
    {
    	$asset = $this->getImage();
    	if($asset == null){
    		return false;
    	}
    	$content = $asset->getContent();
    	if(!$content){
    		return false;
    	}
    	$imagine = new Imagine();
    	$img= $imagine->load($content);
    	$resize = new Resize(new Box(470, 440));
    	$img = $resize->apply($img);
    
    	$this->setImage(new ParameterAsset(array(
            		'content'       => $img->get('png'),
            		'content_type'  => 'image/png'
    	)));
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

    public function getUrl()
    {
        return $this->url;
    }

    public function setUrl($url)
    {
        $this->url = $url;
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


