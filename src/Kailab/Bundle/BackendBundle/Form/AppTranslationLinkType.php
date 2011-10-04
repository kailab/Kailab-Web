<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class AppTranslationLinkType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('title','text',array(
            'required'  => false,
        ));
        $builder->add('url','url', array(
            'required'  => false,
        ));
    }
}

