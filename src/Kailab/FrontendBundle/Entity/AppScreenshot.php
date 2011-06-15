<?php

namespace Kailab\FrontendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Kailab\FrontendBundle\Asset\EntityAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\FrontendBundle\Repository\AppRepository")
 * @ORM\Table(name="app_screenshots")
 */
class AppScreenshot
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="App", inversedBy="app_screenshots")
     * @ORM\JoinColumn(name="app_id", referencedColumnName="id")
     */
    protected $app;

    /**
     * @ORM\ManyToOne(targetEntity="Screenshot", inversedBy="app_screenshots")
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

    public function getPosition()
    {
        return $this->position;
    }

    public function setPosition($k)
    {
        $this->position = intval($k);
    }

    public function getApp()
    {
        return $this->app;
    }

    public function setApp($app)
    {
        $this->app = $app;
    }

    public function getScreenshot()
    {
        return $this->screenshot;
    }

    public function setScreenshot($screen)
    {
        $this->screenshot = $screen;
    }

}
 
