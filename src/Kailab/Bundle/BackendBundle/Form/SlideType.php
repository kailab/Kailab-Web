<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class SlideType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('image','file',array(
            'required'  => false,
        ));
        $builder->add('url','url', array(
            'required'  => false,
        ));
        $builder->add('translations', 'collection', array(
           'type'       => new SlideTranslationType(),
       ));
    }

}

