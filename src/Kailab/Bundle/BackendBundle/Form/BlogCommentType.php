<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class BlogCommentType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('author_name','text');
        $builder->add('author_email','text');
        $builder->add('content','textarea');
        
        $builder->add('post', 'entity', array(
                    'class'     => 'Kailab\\Bundle\\EntityBundle\\Entity\\BlogPost',
                    'property'  => 'title',
                    'expanded'  => false,
                    'required'  => true
        ));
    }
}

