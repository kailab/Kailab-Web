<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Kailab\Bundle\SharedBundle\Controller\EntityCrudController;
use Kailab\Bundle\BackendBundle\Form\BlogCommentType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class BlogCommentController extends EntityCrudController
{
    protected function getEntityName()
    {
    	return 'KailabEntityBundle:BlogComment';
    }
    
    protected function getViewPrefix()
    {
    	return 'KailabBackendBundle:BlogComment';
    }
    
    protected function getRoutePrefix()
    {
    	return 'backend_blog_comment_';
    }

    protected function getFormType()
    {
        return new BlogCommentType();
    }
    
    /**
    * @Route("/blog/comment", name="backend_blog_comment_index")
    * @Template()
    */
    public function indexAction()
    {
    	return parent::indexAction();
    }
    
    /**
     * @Route("/blog/comment/new", name="backend_blog_comment_new")
     * @Template()
     */
    public function newAction()
    {
    	return parent::newAction();
    }
    
    /**
     * @Route("/blog/comment/{id}", name="backend_blog_comment_edit")
     * @Template()
     */
    public function editAction($id)
    {
    	return parent::editAction($id);
    }
    
    
    /**
    * @Route("/blog/comment/delete/{id}", name="backend_blog_comment_delete")
     * @Template()
    */
    public function deleteAction($id)
    {
    	return parent::deleteAction($id);
    }
    
    /**
    * @Route("/blog/comment/toggle/{id}", name="backend_blog_comment_toggle")
    * @Template()
    */
    public function toggleAction($id)
    {
    	return parent::toggleAction($id);
    }

}
