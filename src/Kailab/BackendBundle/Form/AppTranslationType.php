<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class AppTranslationType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
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

    public function getDefaultOptions(array $options)
    {
        return array(
            'data_class' => 'Kailab\FrontendBundle\Entity\AppTranslation',
        );
    }
}

