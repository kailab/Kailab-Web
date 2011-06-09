<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
use Kailab\BackendBundle\Form\BlogPostType;

class BlogPostController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:BlogPost';
    protected $view_prefix = 'KailabBackendBundle:BlogPost';
    protected $route_prefix = 'backend_blog_post_';

    protected function getFormType()
    {
        return new BlogPostType();
    }

    public function imageAction($id)
    {
        $entity = $this->findEntity($id);
        $img = $entity->getImage();
        return $img->getResponse();
    }

}
