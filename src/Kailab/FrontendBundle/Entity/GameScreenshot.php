<?php

namespace Kailab\FrontendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Kailab\FrontendBundle\Asset\EntityAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\FrontendBundle\Repository\GameRepository")
 * @ORM\Table(name="game_screenshots")
 */
class GameScreenshot
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Game", inversedBy="screenshots")
     * @ORM\JoinColumn(name="game_id", referencedColumnName="id")
     */
    protected $game;

    /**
     * @ORM\ManyToOne(targetEntity="Screenshot", inversedBy="games")
     * @ORM\JoinColumn(name="screenshot_id", referencedColumnName="id")
     */
    protected $screenshot;

    /**
     * @ORM\Column(type="integer")
     */
    protected $position;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getGame()
    {
        return $this->game;
    }

    public function setGame($game)
    {
        $this->game = $game;
    }

    public function getScreenshot()
    {
        return $this->screenshot;
    }

    public function setScreenshot($screen)
    {
        $this->screensot = $screen;
    }

}
 
