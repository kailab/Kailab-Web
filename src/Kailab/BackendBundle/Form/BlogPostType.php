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
        $builder->add('image','file',array(
            'type'      => 'file'
        ));
        $builder->add('url','url');
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

