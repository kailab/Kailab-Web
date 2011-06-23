<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class TechType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
        $builder->add('slug','text', array(
            'required'  => false,
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
            'data_class' => 'Kailab\FrontendBundle\Entity\Tech',
        );
    }

    public function getIdentifier()
    {
        return 'tech';
    }
}

