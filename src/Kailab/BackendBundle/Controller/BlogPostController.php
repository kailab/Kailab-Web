<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
use Kailab\BackendBundle\Form\BlogPostType;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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
        if(!$entity){
            throw new NotFoundHttpException('The post does not exist.');
        }
        $img = $entity->getImage();
        return $img->getResponse();
    }

}
