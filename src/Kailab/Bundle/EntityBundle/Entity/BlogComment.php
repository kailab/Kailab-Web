<?php

namespace Kailab\Bundle\EntityBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Imagine\Gd\Imagine;
use Doctrine\Common\Collections\ArrayCollection;
use Kailab\Bundle\SharedBundle\Asset\EntityAsset;
use Symfony\Component\Validator\Constraints\Email;

/**
 * @ORM\Entity(repositoryClass="Kailab\Bundle\EntityBundle\Repository\BlogCommentRepository")
 * @ORM\Table(name="blog_comment")
 */
class BlogComment
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $active;

    /**
     * @ORM\Column(type="string", length="40000")
     */
    protected $content;

    /**
     * @ORM\Column(type="string", length="255")
     */
    protected $author_name;

    /**
     * @ORM\Column(type="string", length="255")
     * @Assert\Email()
     */
    protected $author_email;

    /**
     * @ORM\ManyToOne(targetEntity="BlogPost", inversedBy="comments")
     * @ORM\JoinColumn(name="post_id", referencedColumnName="id")
     */
    protected $post;

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

    public function getContent()
    {
        return $this->content;
    }

    public function setContent($content)
    {
        $this->content = $content;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function setCreated($time)
    {
        $this->created = $time;
    }

    public function getAuthorName()
    {
        return $this->author_name;
    }

    public function setAuthorName($name)
    {
        $this->author_name = $name;
    }

    public function getAuthorEmail()
    {
        return $this->author_email;
    }

    public function setAuthorEmail($email)
    {
        $this->author_email = $email;
    }

    public function getPost()
    {
        return $this->post;
    }

    public function setPost($post)
    {
        $this->post = $post;
    }

    public function getAuthorLink()
    {
        $name = $this->author_name;
        if(!$name){
            $name = 'anonymous';
        }
        $name = htmlspecialchars($name);
        if($this->author_email){
            $name = '<a href="mailto:'.urlencode($this->author_email).'">'.$name.'</a>';
        }
        return $name;
    }

    public function getHash()
    {
        return md5(strtolower(trim($this->author_email)));
    }

}
