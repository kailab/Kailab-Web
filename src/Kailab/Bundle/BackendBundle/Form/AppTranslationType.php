<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class AppTranslationType extends BaseType
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
        $builder->add('links', 'collection', array(
            'type'          => new AppTranslationLinkType(),
            'required'      => false,
            'prototype'     => true,
            'allow_add'     => true,
            'allow_delete'  => true
        ));
    }
}

