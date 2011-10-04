<?php

namespace Kailab\Bundle\FrontendBundle\Form;

use Symfony\Component\Form\FormBuilder;
use Kailab\Bundle\SharedBundle\Form\AbstractType;

class BlogCommentType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder->add('author_name', 'text', array(
            'label' 	=> 'Your name',
            'required'	=> true
        ));
        $builder->add('author_email', 'text', array(
            'label'     => 'Your email',
        	'required'	=> true
        ));
        $builder->add('content', 'textarea');
    }
    
    public function getDataNamespace()
    {
    	return 'Kailab\\Bundle\\EntityBundle\\Entity\\';
    }
    
    public function getName()
    {
    	return 'comment';
    }
}

