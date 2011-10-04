<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Kailab\Bundle\SharedBundle\Controller\EntityCrudController;
use Kailab\Bundle\BackendBundle\Form\BlogCategoryType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class BlogCategoryController extends EntityCrudController
{
    protected function getEntityName()
    {
    	return 'KailabEntityBundle:BlogCategory';
    }
    
    protected function getViewPrefix()
    {
    	return 'KailabBackendBundle:BlogCategory';
    }
    
    protected function getRoutePrefix()
    {
    	return 'backend_blog_category_';
    }

    protected function getFormType()
    {
        return new BlogCategoryType();
    }
    
    /**
    * @Route("/blog/category", name="backend_blog_category_index")
    * @Template()
    */
    public function indexAction()
    {
    	return parent::indexAction();
    }
    
    /**
     * @Route("/blog/category/new", name="backend_blog_category_new")
     * @Template()
     */
    public function newAction()
    {
    	return parent::newAction();
    }
    
    /**
     * @Route("/blog/category/{id}", name="backend_blog_category_edit")
     * @Template()
     */
    public function editAction($id)
    {
    	return parent::editAction($id);
    }
    
    /**
    * @Route("/blog/catergory/delete/{id}", name="backend_blog_category_delete")
    * @Template()
    */
    public function deleteAction($id)
    {
    	return parent::deleteAction($id);
    }
    
    
    /**
    * @Route("/blog/catergory/toggle/{id}", name="backend_blog_category_toggle")
     * @Template()
    */
    public function toggleAction($id)
    {
    return parent::toggleAction($id);
    }

    /**
    * @Route("/blog/category/up/{id}", name="backend_blog_category_up")
    * @Template()
    */
    public function upAction($id)
    {
		return parent::upAction($id);
    }

    /**
    * @Route("/blog/category/down/{id}", name="backend_blog_category_down")
    * @Template()
    */
    public function downAction($id)
    {
        return parent::downAction($id);
    }

}
