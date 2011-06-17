<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class BlogCommentType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
        $builder->add('author_name','text');
        $builder->add('author_email','text');
        $builder->add('content','textarea');
    }

    public function getDefaultOptions(array $options)
    {
        return array(
            'data_class' => 'Kailab\FrontendBundle\Entity\BlogComment',
        );
    }

}

