<?php

namespace Kailab\Bundle\EntityBundle\Entity;

use Kailab\Bundle\SharedBundle\Entity\TranslatedEntity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Imagine\Gd\Imagine;
use Doctrine\Common\Collections\ArrayCollection;
use Kailab\Bundle\SharedBundle\Asset\EntityAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\Bundle\EntityBundle\Repository\BlogCategoryRepository")
 * @ORM\Table(name="blog_category")
 */
class BlogCategory extends TranslatedEntity
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\OneToMany(targetEntity="BlogPost", mappedBy="category", cascade={"persist", "remove"})
     */
    protected $posts;

    /**
     * @ORM\Column(type="integer")
     */
    protected $position;

    /**
     * @ORM\OneToMany(targetEntity="BlogCategoryTranslation", mappedBy="category", cascade={"persist", "remove"})
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

    public function getPosts()
    {
        return $this->posts;
    }

    public function setPosts($posts)
    {
        $this->posts = $posts;
    }

}


