<?php
namespace Kailab\FrontendBundle\Entity;

use FOS\UserBundle\Entity\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="Kailab\FrontendBundle\Repository\UserRepository")
 * @ORM\Table(name="kailab_user")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\generatedValue(strategy="AUTO")
     */
    protected $id;

    public function __construct()
    {
        parent::__construct();
        // your own logic
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getUpdated()
    {
        return $this->updatedAt;
    }

    public function serUpdated($updated)
    {
        $this->updatedAt = $updated;
    }

    public function getActive()
    {
        return $this->enabled;
    }

    public function setActive($active)
    {
        $this->enabled = $active;
    }

    public function getLast_login()
    {
        return $this->lastLogin;
    }
}
