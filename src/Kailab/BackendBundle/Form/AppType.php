<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;
use Kailab\FrontendBundle\Entity\SlideTranslation;

class AppType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
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
            'class'     => 'Kailab\\FrontendBundle\\Entity\\App',
            'property'  => 'name',
            'expanded'  => true,
            'multiple'  => true
        ));

        $builder->add('platforms','entity', array(
            'class'     => 'Kailab\\FrontendBundle\\Entity\\Platform',
            'property'  => 'name',
            'expanded'  => true,
            'multiple'  => true
        ));

        $builder->add('technologies','entity', array(
            'class'     => 'Kailab\\FrontendBundle\\Entity\\Tech',
            'property'  => 'name',
            'expanded'  => true,
            'multiple'  => true
        ));

        $builder->add('screenshots','entity', array(
            'class'     => 'Kailab\\FrontendBundle\\Entity\\Screenshot',
            'property'  => 'id',
            'expanded'  => false,
            'multiple'  => true,
            'required'  => false
        ));
    }

    public function getDefaultOptions(array $options)
    {
        return array(
            'data_class' => 'Kailab\FrontendBundle\Entity\App',
        );
    }

    public function getIdentifier()
    {
        return 'app';
    }
}

