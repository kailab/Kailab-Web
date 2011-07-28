<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;
use Kailab\FrontendBundle\Entity\BlogPostTranslation;

class BaseType extends AbstractType
{
    protected $data_namespace = 'Kailab\\FrontendBundle\\Entity\\';

    public function getDataClassName()
    {
        $class = substr(get_class($this),0,-4);
        return substr($class,strripos($class,'\\')+1);
    }

    public function getDataClass()
    {
        return $this->data_namespace.$this->getDataClassName();
    }

    public function getDefaultOptions(array $options)
    {
        return array(
            'data_class' => $this->getDataClass()
        );
    }

    public function getName()
    {
        return Container::underscore($this->getDataClassName());
    }

}

