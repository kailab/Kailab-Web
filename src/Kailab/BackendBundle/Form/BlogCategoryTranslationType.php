<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class BlogCategoryTranslationType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('locale','hidden');
        $builder->add('name','text',array(
            'required'  => false,
        ));
        $builder->add('description','textarea', array(
            'required'  => false,
        ));
    }

    public function getDefaultOptions(array $options)
    {
        return array(
            'data_class' => 'Kailab\FrontendBundle\Entity\BlogCategoryTranslation',
        );
    }
}
