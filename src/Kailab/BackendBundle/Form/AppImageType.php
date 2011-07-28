<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;
use Kailab\FrontendBundle\Entity\SlideTranslation;

class AppImageType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
        $builder->add('position','hidden');
        $builder->add('file','file');
    }

}

