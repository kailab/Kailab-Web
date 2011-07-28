<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;
use Kailab\FrontendBundle\Entity\BlogPostTranslation;

class BlogCategoryType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
        $builder->add('translations', 'collection', array(
           'type'       => new BlogCategoryTranslationType(),
       ));
    }

}

