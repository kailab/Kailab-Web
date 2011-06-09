<?php

namespace Kailab\BackendBundle\Controller;

use Kailab\BackendBundle\Controller\EntityCrudController;
use Kailab\FrontendBundle\Entity\Slide;
use Kailab\BackendBundle\Form\BlogCategoryType;

class BlogCategoryController extends EntityCrudController
{
    protected $entity_name = 'KailabFrontendBundle:BlogCategory';
    protected $view_prefix = 'KailabBackendBundle:BlogCategory';
    protected $route_prefix = 'backend_blog_category_';

    protected function getFormType()
    {
        return new BlogCategoryType();
    }

    public function upAction($id)
    {
        $entity = $this->findEntity($id);
        $position = $entity->getPosition();
        $entity->setPosition($position-1);
        $em = $this->getEntityManager();
        $em->persist($entity);
        $em->flush();
        $session = $this->get('session');
        $session->setFlash('notice','Category was moved up.');
        return $this->redirectCrud('list');
    }

    public function downAction($id)
    {
        $entity = $this->findEntity($id);
        $position = $entity->getPosition();
        $entity->setPosition($position+1);
        $em = $this->getEntityManager();
        $em->persist($entity);
        $em->flush();
        $session = $this->get('session');
        $session->setFlash('notice','Category was moved down.');
        return $this->redirectCrud('list');
    }

}
