<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class BlogPostTranslationType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('locale','hidden');
        $builder->add('title','text',array(
            'required'  => true,
        ));
        $builder->add('content','textarea', array(
            'required'  => false,
        ));
    }
}

