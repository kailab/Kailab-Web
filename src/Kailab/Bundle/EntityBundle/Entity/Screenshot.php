<?php

namespace Kailab\Bundle\EntityBundle\Entity;

use Kailab\Bundle\SharedBundle\Imagine\Filter\Resize;
use Kailab\Bundle\SharedBundle\Imagine\Filter\Paste;
use Kailab\Bundle\SharedBundle\Imagine\Filter\Crop;
use Kailab\Bundle\SharedBundle\Imagine\Filter\Combined;
use Kailab\Bundle\SharedBundle\Asset\EntityAsset;
use Kailab\Bundle\SharedBundle\Asset\AssetInterface;
use Kailab\Bundle\SharedBundle\Asset\ParameterAsset;
use Kailab\Bundle\SharedBundle\Asset\PublicAssetInterface;

use Imagine\Gd\Image;
use Imagine\Gd\Imagine;
use Imagine\Image\Box;
use Imagine\Image\Point;
use Imagine\Image\Color;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="Kailab\Bundle\EntityBundle\Repository\ScreenshotRepository")
 * @ORM\Table(name="screenshots")
 */
class Screenshot
{
    const ORIENTATION_VERTICAL = 'vertical';
    const ORIENTATION_HORIZONTAL = 'horizontal';

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
     * @ORM\Column(type="string", length=50)
     */
    protected $orientation;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $updated;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @ORM\ManyToOne(targetEntity="Platform", inversedBy="screenshots")
     * @ORM\JoinColumn(name="platform_id", referencedColumnName="id")
     */
    protected $platform;

    protected $images = array();

    public function __construct()
    {
        $this->loadAssets();
        $this->active = true;
        $this->updated = new \DateTime('now');
        $this->created = new \DateTime('now');
        $this->orientation = self::ORIENTATION_VERTICAL;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getSmallUri()
    {
        $asset = $this->getImage('small');
        if($asset instanceof PublicAssetInterface){
            return $asset->getUri();
        }
    }

    public function getOrientation()
    {
        return $this->orientation;
    }

    public function setOrientation($ori)
    {
        $this->orientation = $ori;
    }
	
    /**
     * @return Platform
     */
    public function getPlatform()
    {
        return $this->platform;
    }

    public function setPlatform(Platform $platform)
    {
        $this->platform = $platform;
    }

    public function getActive()
    {
        return $this->active;
    }

    public function setActive($active)
    {
        $this->active = $active;
    }

    protected function loadAssets()
    {
        $types = array('','big','bigcenter','small','item');
        foreach($types as $type){
            if(!isset($this->images[$type])){
                $name = $type ? 'image_'.$type : 'image';
                $this->images[$type] = new EntityAsset($this, $name);
            }
        }
    }
    
    /**
     * @return Image
     */
    protected function getBackgroundImage()
    {
    	$imagine = new Imagine();
    	$asset = $this->getPlatform()->getBackground();
    	if($asset != null){
    		$content = $asset->getContent();
    		if($content){
    			$image = $imagine->load($content);
    			if($this->getOrientation() == self::ORIENTATION_HORIZONTAL){
    				$image->rotate(90);
    			}
    			return $image;
    		}
    	}
    	$size = $this->getScreenSize();
    	$pos = $this->getScreenPosition();
    	$size = new Box(
    		$size->getWidth() + 2*$pos->getX(),
    		$size->getHeight() + 2*$pos->getY()
    	);
    	return $imagine->create($size, new Color('ffffff',100));
    }
    
    /**
    * @return Box
    */
    protected function getScreenSize()
    {
    	$size = $this->getPlatform()->getScreenSize();
    	if($this->getOrientation() == self::ORIENTATION_HORIZONTAL){
    		$size = new Box($size->getHeight(), $size->getWidth());
    	}
    	return $size;
    }
    
    /**
     * @return Point
     */
    protected function getScreenPosition()
    {
    	$pos = $this->getPlatform()->getScreenPosition();
    	if($this->getOrientation() == self::ORIENTATION_HORIZONTAL){
    		$pos = new Point($pos->getY(), $pos->getX());
    	}
    	return $pos;
    }
    
    /**
     * @return Image
     */
    protected function combineImage()
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
    	$image = $imagine->load($content);
    	
    	$size = $this->getScreenSize();
    	$resize = new Resize($size, Resize::OUTSIDE_CROP);
    	$image = $resize->apply($image);
    	
    	$paste = new Paste(
    		$this->getBackgroundImage(),
    		$this->getScreenPosition()
    	);
    	$image = $paste->apply($image);
    	
    	return $image;
    }
    
    public function updateAssets()
    {
		$image = $this->combineImage();
		
		$filters = array();
		$filters['bigcenter'] = new Combined(
			new Resize(new Box(475, 475)),
			new Crop(new Box(475, 475), Crop::CENTER, Crop::CENTER)
		);
		if($this->getOrientation() == self::ORIENTATION_HORIZONTAL){
			$filters['big'] = new Combined(
				new Resize(new Box(475, 250)),
				new Crop(new Box(475,250))
			);
		}else{
			$filters['big']	 = new Combined(
				new Resize(new Box(250, 475)),
				new Crop(new Box(250, 475))
			);
		}
		$filters['item'] = new Combined(
			new Resize(new Box(150, 150)),
			new Crop(new Box(150, 150), Crop::CENTER, Crop::BOTTOM)
		);
		$filters['small'] = new Resize(new Box(150, 150));
		
		foreach($filters as $name=>$filter){
			$img = $filter->apply($image->copy());
			$this->setImage(new ParameterAsset(array(
			    		'content'       => $img->get('png'),
			            'content_type'  => 'image/png'
			)), $name);
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
        }
    }

    public function setImage($path, $name='')
    {
        $this->loadAssets();
        $img = $this->getImage($name);
        if($img == null){
            return;
        }
        $img->setAsset($path);
        $this->updated = new \DateTime('now');
    }
    
    public function getUri($name='')
    {
    	$img = $this->getImage($name);
    	if($img != null){
    		return $img->getUri();
    	}
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


