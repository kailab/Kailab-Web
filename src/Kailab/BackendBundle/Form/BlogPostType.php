<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;
use Kailab\FrontendBundle\Entity\BlogPostTranslation;

class BlogPostType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
        $builder->add('category','entity', array(
            'class'     => 'Kailab\\FrontendBundle\\Entity\\BlogCategory',
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

    public function getDefaultOptions(array $options)
    {
        return array(
            'data_class' => 'Kailab\FrontendBundle\Entity\BlogPost',
        );
    }

}

