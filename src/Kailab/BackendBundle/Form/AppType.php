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
        $builder->add('url','url');
        $builder->add('translations', 'collection', array(
           'type'       => new AppTranslationType(),
        ));
        $builder->add('screenshots','entity', array(
            'class'     => 'Kailab\\FrontendBundle\\Entity\\Screenshot',
            'property'  => 'type',
            'expanded'  => false,
            'multiple'  => true
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

