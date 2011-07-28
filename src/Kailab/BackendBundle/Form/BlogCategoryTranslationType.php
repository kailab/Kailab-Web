<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class BlogCategoryTranslationType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('locale','hidden');
        $builder->add('name','text',array(
            'required'  => false,
        ));
        $builder->add('description','textarea', array(
            'required'  => false,
        ));
    }

}

