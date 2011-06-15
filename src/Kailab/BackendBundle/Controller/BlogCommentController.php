<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
use Kailab\BackendBundle\Form\BlogCommentType;

class BlogCommentController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:BlogComment';
    protected $view_prefix = 'KailabBackendBundle:BlogComment';
    protected $route_prefix = 'backend_blog_comment_';

    protected function getFormType()
    {
        return new BlogCommentType();
    }

}
