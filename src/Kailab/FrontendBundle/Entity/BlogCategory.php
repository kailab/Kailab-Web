<?php

namespace Kailab\FrontendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Imagine\Gd\Imagine;
use Doctrine\Common\Collections\ArrayCollection;
use Kailab\FrontendBundle\Asset\EntityAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\FrontendBundle\Repository\SlideRepository")
 * @ORM\Table(name="blog_category")
 */
class BlogCategory
{
    protected $locale;

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

}


