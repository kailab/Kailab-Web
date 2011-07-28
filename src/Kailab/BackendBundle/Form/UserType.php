<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;
use Kailab\FrontendBundle\Entity\SlideTranslation;

class UserType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id', 'hidden');
        $builder->add('username', 'text');
        $builder->add('password','repeated', array(
            'type'=>'password',
            'first_name'=>'password',
            'second_name' =>'confirm you password',
            'required' => false
        ));
        $builder->add('email', 'email');
    }
}

