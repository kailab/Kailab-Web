<?php

namespace Kailab\Bundle\BackendBundle\Form;

use Symfony\Component\Form\FormBuilder;

class BlogCategoryType extends BaseType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('translations', 'collection', array(
           'type'       => new BlogCategoryTranslationType(),
       ));
    }

}

