<?php

namespace Kailab\FrontendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="game_translations")
 */
class GameTranslation
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
     * @ORM\ManyToOne(targetEntity="Game", inversedBy="translations")
     * @ORM\JoinColumn(name="game_id", referencedColumnName="id")
     */
    protected $game;

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

    public function setGame($game)
    {
        $this->game = $game;
    }

    public function getGame()
    {
        return $this->game;
    }
}
