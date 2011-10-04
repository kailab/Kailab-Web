<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Kailab\Bundle\SharedBundle\Controller\EntityCrudController;
use Kailab\Bundle\BackendBundle\Form\BlogPostType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class BlogPostController extends EntityCrudController
{
    protected function getEntityName()
    {
    	return 'KailabEntityBundle:BlogPost';
    }
    
    protected function getViewPrefix()
    {
    	return 'KailabBackendBundle:BlogPost';
    }
    
    protected function getRoutePrefix()
    {
    	return 'backend_blog_post_';
    }

    protected function getFormType()
    {
        return new BlogPostType();
    }
    
    /**
    * @Route("/blog/post", name="backend_blog_post_index")
    * @Template()
    */
    public function indexAction()
    {
    	return parent::indexAction();
    }
    
    /**
     * @Route("/blog/post/new", name="backend_blog_post_new")
     * @Template()
     */
    public function newAction()
    {
    	return parent::newAction();
    }
    
    /**
     * @Route("/blog/post/{id}", name="backend_blog_post_edit")
     * @Template()
     */
    public function editAction($id)
    {
    	return parent::editAction($id);
    }
    
    /**
    * @Route("/blog/post/delete/{id}", name="backend_blog_post_delete")
    * @Template()
    */
    public function deleteAction($id)
    {
    	return parent::deleteAction($id);
    }
    
    /**
     * @Route("/blog/post/toggle/{id}", name="backend_blog_post_toggle")
     * @Template()
     */
    public function toggleAction($id)
    {
    	return parent::toggleAction($id);
    }
    

}
