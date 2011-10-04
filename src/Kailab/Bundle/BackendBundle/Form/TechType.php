<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class TechType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('slug','text', array(
            'required'  => true,
        ));
        $builder->add('url','url', array(
            'required'  => false,
        ));
        $builder->add('translations', 'collection', array(
           'type'       => new TechTranslationType(),
        ));
        $builder->add('icon','file',array(
            'required'  => false,
        ));
        $builder->add('image','file',array(
            'required'  => false,
        ));

        $builder->add('platforms','entity', array(
            'class'     => 'Kailab\\Bundle\\EntityBundle\\Entity\\Platform',
            'property'  => 'name',
            'expanded'  => true,
            'multiple'  => true
        ));
        $builder->add('screenshots','entity', array(
            'class'     => 'Kailab\\Bundle\\EntityBundle\\Entity\\Screenshot',
            'property'  => 'small_uri',
            'expanded'  => false,
            'multiple'  => true,
            'required'  => false
        ));
    }
}

