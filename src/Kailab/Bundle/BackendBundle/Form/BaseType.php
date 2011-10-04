<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\DependencyInjection\Container;
use Kailab\Bundle\SharedBundle\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class BaseType extends AbstractType
{
    public function getDataNamespace()
    {
    	return 'Kailab\\Bundle\\EntityBundle\\Entity\\';
    }
}

