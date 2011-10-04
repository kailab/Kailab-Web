<?php

namespace Kailab\Bundle\EntityBundle\Entity;

use Kailab\Bundle\SharedBundle\Asset\ParameterAsset;

use Imagine\ImageInterface;

use Kailab\Bundle\SharedBundle\Entity\TranslatedEntity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Imagine\Gd\Imagine;
use Doctrine\Common\Collections\ArrayCollection;
use Kailab\Bundle\SharedBundle\Asset\EntityAsset;
use Kailab\Bundle\SharedBundle\Asset\AssetInterface;

/**
 * @ORM\Entity(repositoryClass="Kailab\Bundle\EntityBundle\Repository\BlogPostRepository")
 * @ORM\Table(name="blog_posts")
 */
class BlogPost extends TranslatedEntity
{
    const EXCERPT_SEPARATOR = '<!-- more -->';

    protected $images = array();

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\OneToMany(targetEntity="BlogPostTranslation", mappedBy="post", cascade={"persist", "remove"})
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
     * @ORM\ManyToOne(targetEntity="BlogCategory", inversedBy="posts")
     * @ORM\JoinColumn(name="category_id", referencedColumnName="id")
     */
    protected $category;

    /**
     * @ORM\OneToMany(targetEntity="BlogComment", mappedBy="post", cascade={"persist", "remove"})
     */
    protected $comments;

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

    public function getTitle()
    {
     	return $this->getTranslated('title');
    }

    public function getContent()
    {
        return $this->getTranslated('content');
    }

    public function getExcerpt()
    {
        $content = $this->getContent();
        $content = explode(self::EXCERPT_SEPARATOR,$content);
        return reset($content);
    }

    public function hasExcerpt()
    {
        $content = $this->getContent();
        $content = explode(self::EXCERPT_SEPARATOR,$content);
        return count($content) > 0;
    }

    protected function loadAssets()
    {
        $types = array('', 'big', 'small');
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
    
    public function updateAssets()
    {
    	$asset = $this->getImage()->getAsset();
    	
    	if(!$asset instanceof AssetInterface){
    		return false;
    	}
    	$sizes = array('big'=>150, 'small'=>90);
   		// resize image
   		$imagine = new Imagine();
   		$image = $imagine->load($asset->getContent());
   		foreach($sizes as $name=>$width){
   			$box = $image->getSize()->scale($width/$image->getSize()->getWidth());
   			$thumb = $image->thumbnail($box,ImageInterface::THUMBNAIL_OUTBOUND);
   			$asset = new ParameterAsset(array(
                    'content'       => $thumb->get('png'),
                    'content_type'  => 'image/png'
   			));
   			$this->setImage($asset, $name);
   		}
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

    public function getCategory()
    {
        return $this->category;
    }

    public function setCategory($cat)
    {
        $this->category = $cat;
    }

    public function getComments()
    {
        return $this->comments;
    }

    public function setComments($comments)
    {
        $this->comments = $comments;
    }

}


