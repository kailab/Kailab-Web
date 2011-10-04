<?php

namespace Kailab\Bundle\BackendBundle\Controller;

use Kailab\Bundle\SharedBundle\Controller\EntityCrudController;
use Kailab\Bundle\BackendBundle\Form\TechType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class TechController extends EntityCrudController
{
    protected function getEntityName()
    {
    	return 'KailabEntityBundle:Tech';
    }
    
	protected function getViewPrefix()
	{
		return 'KailabBackendBundle:Tech';
	}
    
    protected function getRoutePrefix()
    {
    	return 'backend_tech_';
    }
    
    protected function getFormType()
    {
    	return new TechType();
    }

   /**
    * @Route("/tech", name="backend_tech_index")
    * @Template()
    */
    public function indexAction()
    {
    	return parent::indexAction();
    }
    
    /**
     * @Route("/tech/new", name="backend_tech_new")
     * @Template()
     */
    public function newAction()
    {
    	return parent::newAction();
    }
    
    /**
     * @Route("/tech/{id}", name="backend_tech_edit")
     * @Template()
     */
    public function editAction($id)
    {
    	return parent::editAction($id);
    }  
    
    /**
    * @Route("/tech/delete/{id}", name="backend_tech_delete")
     * @Template()
    */
    public function deleteAction($id)
    {
    	return parent::deleteAction($id);
    }
    
    
    /**
    * @Route("/tech/toggle/{id}", name="backend_tech_toggle")
     * @Template()
    */
    public function toggleAction($id)
    {
    	return parent::toggleAction($id);
    }

    /**
    * @Route("/tech/up/{id}", name="backend_tech_up")
    * @Template()
    */
    public function upAction($id)
    {
		return parent::upAction($id);
    }

    /**
    * @Route("/tech/down/{id}", name="backend_tech_down")
    * @Template()
    */
    public function downAction($id)
    {
		return parent::downAction($id);
    }

}
