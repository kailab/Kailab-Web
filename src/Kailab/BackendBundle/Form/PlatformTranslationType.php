<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class PlatformTranslationType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('locale','hidden');
        $builder->add('name','text',array(
            'required'  => true,
        ));
        $builder->add('excerpt','textarea', array(
            'required'  => false,
        ));
        $builder->add('description','textarea', array(
            'required'  => false,
        ));
    }
}

