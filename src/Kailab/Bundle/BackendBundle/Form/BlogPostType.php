<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class BlogPostType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('category','entity', array(
            'class'     => 'Kailab\\Bundle\\EntityBundle\\Entity\\BlogCategory',
            'property'  => 'name',
            'expanded'  => true,
            'required'  => false

        ));
        $builder->add('image','file',array(
            'required'  => false,
        ));
        $builder->add('translations', 'collection', array(
           'type'       => new BlogPostTranslationType(),
       ));
    }

}

