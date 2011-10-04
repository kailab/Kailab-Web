<?php

namespace Kailab\Bundle\SharedBundle\Form;

use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Form\AbstractType as BaseAbstractType;
use Symfony\Component\Form\FormBuilder;

abstract class AbstractType extends BaseAbstractType
{
    abstract public function getDataNamespace();

    public function getDataClassName()
    {
        $class = substr(get_class($this),0,-4);
        return substr($class,strripos($class,'\\')+1);
    }

    public function getDataClass()
    {
        return $this->getDataNamespace().$this->getDataClassName();
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

