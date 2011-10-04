<?php

namespace Kailab\Bundle\EntityBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="question_translations")
 */
class QuestionTranslation
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
     * @ORM\Column(type="string", length="1000")
     */
    protected $title;

    /**
     * @ORM\Column(type="text",  nullable=true)
     */
    protected $answer;

    /**
     * @ORM\ManyToOne(targetEntity="Question", inversedBy="translations")
     * @ORM\JoinColumn(name="question_id", referencedColumnName="id")
     */
    protected $question;

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

    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function getAnswer()
    {
        return $this->answer;
    }

    public function setAnswer($text)
    {
        $this->answer = $text;
    }

    public function setQuestion($question)
    {
        $this->question = $question;
    }

    public function getQuestion()
    {
        return $this->question;
    }
}
