<?php

namespace Kailab\FrontendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="tech_translations")
 */
class TechTranslation
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length="5")
     */
    protected $locale;

    /**
     * @ORM\Column(type="string", length="255")
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length="40000")
     */
    protected $description;

    /**
     * @ORM\ManyToOne(targetEntity="Tech", inversedBy="translations")
     * @ORM\JoinColumn(name="tech_id", referencedColumnName="id")
     */
    protected $tech;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getLocale()
    {
        return $this->locale;
    }

    public function setLocale($locale)
    {
        $this->locale = $locale;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($desc)
    {
        $this->description = $desc;
    }

    public function setTech($tech)
    {
        $this->tech = $tech;
    }

    public function getTech()
    {
        return $this->tech;
    }
}
