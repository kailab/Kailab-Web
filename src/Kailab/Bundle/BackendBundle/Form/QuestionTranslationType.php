<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class QuestionTranslationType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('locale','hidden');
        $builder->add('title','text',array(
            'required'  => false,
        ));
        $builder->add('answer','textarea', array(
            'required'  => false,
        ));
    }
}

