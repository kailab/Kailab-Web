<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class ScreenshotType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
        $builder->add('type', 'choice', array(
            'choices'   => array(
                'iphone'    => 'iPhone',
                'android'   => 'Android',
                'java'      => 'Java',
                'bada'      => 'Bada',
             )
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

