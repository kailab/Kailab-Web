<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;
use Kailab\FrontendBundle\Entity\Screenshot;

class ScreenshotType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
        $builder->add('orientation', 'choice', array(
            'choices'   => array(
                Screenshot::ORIENTATION_VERTICAL    => 'Vertical',
                Screenshot::ORIENTATION_HORIZONTAL  => 'Horizontal'
            )
        ));
        $builder->add('platform', 'entity', array(
            'class'     => 'Kailab\\FrontendBundle\\Entity\\Platform',
            'property'  => 'name',
            'expanded'  => false,
            'required'  => true
        ));
        $builder->add('image','file',array(
            'required'  => false,
        ));
    }

    public function getDefaultOptions(array $options)
    {
        return array(
            'data_class' => 'Kailab\FrontendBundle\Entity\Screenshot',
        );
    }

}

