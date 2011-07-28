<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class BlogCommentType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
        $builder->add('author_name','text');
        $builder->add('author_email','text');
        $builder->add('content','textarea');
    }
}

