<?php

namespace Kailab\FrontendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Imagine\Gd\Imagine;
use Doctrine\Common\Collections\ArrayCollection;
use Kailab\FrontendBundle\Asset\EntityAsset;
use Kailab\FrontendBundle\Asset\AssetInterface;

/**
 * @ORM\Entity(repositoryClass="Kailab\FrontendBundle\Repository\BlogPostRepository")
 * @ORM\Table(name="blog_posts")
 */
class BlogPost
{
    const EXCERPT_SEPARATOR = '<!-- more -->';

    protected $locale;

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

    public function getTitle()
    {
        $trans = $this->getTranslation();
        if($trans){
            return $trans->getTitle();
        }
    }

    public function getContent()
    {
        $trans = $this->getTranslation();
        if($trans){
            return $trans->getContent();
        }
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


