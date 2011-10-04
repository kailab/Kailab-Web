<?php

namespace Kailab\Bundle\EntityBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Kailab\Bundle\SharedBundle\Asset\EntityAsset;

/**
 * @ORM\Entity(repositoryClass="Kailab\Bundle\EntityBundle\Repository\TechRepository")
 * @ORM\Table(name="tech_screenshots")
 */
class TechScreenshot
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Tech", inversedBy="tech_screenshots")
     * @ORM\JoinColumn(name="tech_id", referencedColumnName="id", onDelete="CASCADE", onUpdate="CASCADE")
     */
    protected $tech;

    /**
     * @ORM\ManyToOne(targetEntity="Screenshot", inversedBy="tech_screenshots")
     * @ORM\JoinColumn(name="screenshot_id", referencedColumnName="id", onDelete="CASCADE", onUpdate="CASCADE")
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

    public function getTech()
    {
        return $this->tech;
    }

    public function setTech($tech)
    {
        $this->tech = $tech;
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
 
