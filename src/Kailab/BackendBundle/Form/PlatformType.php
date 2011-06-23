<?php

namespace Kailab\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class PlatformType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('id','hidden');
        $builder->add('url','url');
        $builder->add('slug','text');
        $builder->add('translations', 'collection', array(
           'type'       => new PlatformTranslationType(),
        ));

        $builder->add('screen_x','integer');
        $builder->add('screen_y','integer');
        $builder->add('screen_w','integer');
        $builder->add('screen_h','integer');

        $builder->add('icon','file',array(
            'required'  => false
        ));
        $builder->add('background','file',array(
            'required'  => false
        ));
    }

    public function getDefaultOptions(array $options)
    {
        return array(
            'data_class' => 'Kailab\FrontendBundle\Entity\Platform',
        );
    }

    public function getIdentifier()
    {
        return 'platform';
    }
}

