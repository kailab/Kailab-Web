<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;
use Kailab\Bundle\EntityBundle\Entity\Screenshot;

class ScreenshotType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('orientation', 'choice', array(
            'choices'   => array(
                Screenshot::ORIENTATION_VERTICAL    => 'Vertical',
                Screenshot::ORIENTATION_HORIZONTAL  => 'Horizontal'
            )
        ));
        $builder->add('platform', 'entity', array(
            'class'     => 'Kailab\\Bundle\\EntityBundle\\Entity\\Platform',
            'property'  => 'name',
            'expanded'  => false,
            'required'  => true
        ));
        $builder->add('image','file',array(
            'required'  => false,
        ));
    }

}

