<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class AppType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('url','url',array(
            'required'  => false
        ));
        $builder->add('slug','text',array(
            'required'  => true
        ));
        $builder->add('translations', 'collection', array(
            'type'       => new AppTranslationType(),
        ));

        $builder->add('type', 'choice', array(
            'choices'   => array(
                'app'    => 'Application',
                'game'   => 'Videogame',
             )
        ));

        $builder->add('related','entity', array(
            'class'     => 'Kailab\\Bundle\\EntityBundle\\Entity\\App',
            'property'  => 'name',
            'expanded'  => true,
            'multiple'  => true
        ));

        $builder->add('platforms','entity', array(
            'class'     => 'Kailab\\Bundle\\EntityBundle\\Entity\\Platform',
            'property'  => 'name',
            'expanded'  => true,
            'multiple'  => true
        ));

        $builder->add('technologies','entity', array(
            'class'     => 'Kailab\\Bundle\\EntityBundle\\Entity\\Tech',
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

