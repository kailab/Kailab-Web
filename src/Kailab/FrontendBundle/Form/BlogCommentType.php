<?php

namespace Kailab\FrontendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;
use Kailab\FrontendBundle\Entity\BlogPostTranslation;

class BlogCommentType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('author_name', 'text', array(
            'label' => 'Your name'
        ));
        $builder->add('author_email', 'text', array(
            'label'     => 'Your email',

        ));
        $builder->add('content', 'textarea');
    }

    public function getDefaultOptions(array $options)
    {
        return array(
            'data_class' => 'Kailab\FrontendBundle\Entity\BlogComment',
        );
    }

}

