<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class AppImageType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('position','hidden');
        $builder->add('file','file');
    }

}

